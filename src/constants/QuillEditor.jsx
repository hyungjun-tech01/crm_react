'use client';

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from 'recoil';
import { Button } from 'antd';
import ReactQuill from "react-quill-new";
import QuillToolbar from "./QuillToolbar";
import 'react-quill-new/dist/quill.snow.css';

import { AttachmentRepo } from "../repository/attachment";
import Paths from "./Paths";
const BASE_PATH = Paths.BASE_PATH;

const QuillEditor = ({ originalContent, handleData, handleClose }) => {
    const { t } = useTranslation();
    const [ content, setContent ] = useState('');
    const [ attachments, setAttachments ] = useState([]);
    const { uploadFile, deleteFile } = useRecoilValue(AttachmentRepo);
    
    const quillRef = useRef(null);

    const handleAttachment = (data) => {
        setAttachments(prev => [
            ...prev,
            data
        ]);
    };

    const handleSave = () => {
        handleData({
            content: content,
            attachments: attachments,
        });
        handleClose();
    };

    const handleCancel = () => {
        if(attachments.length > 0){
            const tempAttachmentData = attachments.filter(item => {
                const result = deleteFile(item.dirName, item.fileName, item.fileExt);
                return result.result
            });
            if(tempAttachmentData.length > 0) {
                console.log('There is(are) attachment(s) could not be deleted');
            };
            setAttachments(tempAttachmentData);
        };
        handleClose();
    };

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        // input.setAttribute("multiple", "multiple");
        input.setAttribute("name", "image");
        input.click();

        input.onchange = async () => { // onChange 추가
            const file = input.files[0];
            const res = await uploadFile(file);
            
            if(!res.result){
                alert(res.result.message);
                return;
            };

            const tempAttachment = {
                attachmentCode: res.data.code,
                dirName: res.data.dirName,
                fileName: res.data.fileName,
                fileExt: res.data.fileExt,
                url: res.data.url
            };
            handleAttachment(tempAttachment);
            
            const editor = quillRef.current.getEditor();
            quillRef.current.focus();

            const imageUrl = `${BASE_PATH}/${res.data.url}`;
            const range = editor.getSelection();
            if (range) {
                editor.insertEmbed(range.index, 'image', imageUrl);
                editor.setSelection(range.index + 1, 1);
            } else {
                // 범위가 없을 때 커서를 맨 끝에 두고 이미지 삽입
                editor.setSelection(editor.getLength(), 0);
                // editor.insertEmbed(editor.getLength(), 'image', imageUrl);
                editor.clipboard.dangerouslyPasteHTML(
                    editor.getSelection().index,
                    `<img src=${imageUrl} alt="image" />`
                );
            };
        };
    };

    const linkHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "*");
        input.setAttribute("multiple", "multiple");
        input.setAttribute("name", "files");
        input.click();

        input.onchange = async () => { // onChange 추가
            for(let i = 0; i < input.files.length; i++ ){
                const file = input.files[i];
                const res = await uploadFile(file);
            
                if(!res.result){
                    alert(res.result.message);
                    return;
                };
    
                const tempAttachment = {
                    attachmentCode: res.data.code,
                    dirName: res.data.dirName,
                    fileName: res.data.fileName,
                    fileExt: res.data.fileExt,
                    url: res.data.url
                };
                handleAttachment(tempAttachment);
                
                const editor = quillRef.current.getEditor();
                quillRef.current.focus();
    
                const fileUrl = `${BASE_PATH}/${res.data.url}`;
                const linkString = `<a href=${fileUrl} download/>${res.data.fileName}</a>`;
                const range = editor.getSelection();
                if (range) {
                    editor.clipboard.dangerouslyPasteHTML(range.index, linkString);
                    editor.setSelection(range.index + 1, 1);
                } else {
                    // 범위가 없을 때 커서를 맨 끝에 두고 이미지 삽입
                    editor.setSelection(editor.getLength(), 0);
                    editor.clipboard.dangerouslyPasteHTML(
                        editor.getSelection().index, linkString
                    );
                };
            };
        };
    };

    const formats = [
        "header", "size", "font",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "indent", "link", "image",
        "color", "background", "align",
        "script", "code-block"
    ];

    const modules = useMemo(() => ({
        toolbar: { // 툴바에 넣을 기능들을 순서대로 나열하면 된다.
            container: '#QuillToolbar',
            handlers: { // 위에서 만든 이미지 핸들러 사용하도록 설정
                image: imageHandler,
                link: linkHandler,
            },
        },
    }), []);

    useEffect(() => {
        setContent(originalContent);
        if(quillRef.current){
            quillRef.current.focus();
        }
    }, [originalContent]);

    return (
        <div>
            <QuillToolbar />
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