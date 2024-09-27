'use client';

import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from 'recoil';
import { Button } from 'antd';
import ReactQuill from "react-quill";
import QuillModule from "./QuillModule";
import 'react-quill/dist/quill.snow.css';

import { AttachmentRepo } from "../repository/attachment";
import Paths from "./Paths";
const BASE_PATH = Paths.BASE_PATH;

const QuillEditor = ({ originalContent, handleData }) => {
    const { t } = useTranslation();
    const [ content, setContent ] = useState('');
    const [ attachmentData, setAttachmentData ] = useState([]);
    const { deleteAttachmentFile } = useRecoilValue(AttachmentRepo);
    
    const quillRef = useRef(null);

    const handleSave = () => {
        handleData({
            content: content,
            attachmentData: attachmentData,
        });
    };
    const handleCancel = () => {
        if(attachmentData.length > 0){
            const tempAttachmentData = attachmentData.filter(item => {
                const result = deleteAttachmentFile(item.dirName, item.fileName, item.fileExt);
                return result.result
            });
            if(tempAttachmentData.length > 0) {
                console.log('There is(are) attachment(s) could not be deleted');
            };
            setAttachmentData(tempAttachmentData);
        };
    };

    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/jpg,image/png,image/jpeg");
        input.setAttribute("multiple", "multiple");
        input.click();

        input.onchange = async () => { // onChange 추가
            let files = input.files;
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();

            if (range && (files !== null)) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const fileName = file.name;
                    const ext_index = fileName.lastIndexOf('.');
                    const fileExt = ext_index !== -1 ? fileName.slice(ext_index + 1) : "";

                    // formData 추가
                    const formData = new FormData();
                    formData.append('fileName', fileName);
                    formData.append('fileExt', fileExt);
                    formData.append('file', file);

                    try {
                        const response = await fetch(`${BASE_PATH}/upload`, {
                            method: "POST",
                            // headers: { 'Content-Type': 'multipart/form-data' },
                            body: formData,
                        })
                        const result = await response.json();
                        const upldateUrl = `${BASE_PATH}/${result.url}`;
                        
                        editor.insertEmbed(range.index, 'image', upldateUrl);
                        // editor.setSelection(range.index + 1);

                        const tempAttachment = {
                            attachmentCode : result.code,
                            dirName: result.dirName,
                            fileName: result.fileName,
                            fileExt: result.fileExt,
                            url: result.url
                        };
                        setAttachmentData(attachmentData.concat(tempAttachment));
                    }
                    catch (err) {
                        alert('Image 올리는 중 error가 발생했습니다.');
                        console.log('Failed to upload', err);
                    }
                }
            } else {
                alert('Editor를 선택하고 다시 시도해 주시기 바랍니다.')
            }
        }
    }, [ attachmentData]);

    const formats = [
        "header", "size", "font",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "bullet", "indent", "link", "image",
        "color", "background", "align",
        "script", "code-block", "clean"
    ];

    const modules = useMemo(() => ({
        toolbar: {
            container: "#toolBar",
            handlers: {
                image: imageHandler
            }
        },
    }), [imageHandler]);

    useEffect(() => {
        setContent(originalContent);
    }, [originalContent])

    return (
        <div>
            <div id="toolBar" style={{ width: '100%', border: '1px solid #777777', borderBottom: '0' }}>
                <QuillModule />
            </div>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                className="add-upload-editor"
                modules={modules}
                formats={formats}
                value={content}
                onChange={setContent}
            />
            <div style={{display:'flex', flexDirection:'row', width:'160px', marginTop:'0.5rem', justifyContent:'space-evenly'}}>
                <Button type='primary' onClick={handleSave}>{t('common.save')}</Button>
                <Button onClick={handleCancel}>{t('common.cancel')}</Button>
            </div>
        </div>
    )
}

export default QuillEditor;