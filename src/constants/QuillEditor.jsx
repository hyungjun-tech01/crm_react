'use client';

import React, { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

import QuillModule from "./QuillModule";
import Paths from "./Paths";
const BASE_PATH = Paths.BASE_PATH;

const QuillEditor = ({ content, handleContent, attachmentCode, handleAttachmentCode, handleAddAttachment }) => {
    const quillRef = useRef(null);

    const changeImageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/jpg,image/png,image/jpeg");
        input.setAttribute("multiple", "multiple");
        input.click();

        input.onchange = async () => { // onChange 추가
            let files = input.files;
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();

            if (files !== null) {
                let tempCode = attachmentCode;
                const reader = new FileReader();
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        editor.insertEmbed(range.index, 'image', reader.result);
                        editor.setSelection(range.index + 1);
                    };

                    const fileName = file.name;
                    const ext_index = fileName.lastIndexOf('.');
                    const fileExt = ext_index !== -1 ? fileName.slice(ext_index + 1) : "";

                    // formData 추가
                    const formData = new FormData();
                    formData.append('attachmentCode', tempCode);
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
                        if(!attachmentCode){
                            handleAttachmentCode(result.code);
                        };
                        const tempAttachment = {
                            attachmentCode : result.code,
                            dirName: result.dirName,
                            fileName: result.fileName,
                            fileExt: result.fileExt,
                            url: result.url
                        };
                        handleAddAttachment(tempAttachment);
                    }
                    catch (err) {

                    }
                }
            }
        }
    }

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
                image: changeImageHandler
            }
        },
    }), []);

    return (
        <div>
            <div id="toolBar" style={{ width: '100%', border: '1px solid #777777', borderBottom: '0' }}>
                <QuillModule />
            </div>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                className="add-upload-content"
                modules={modules}
                formats={formats}
                value={content}
                onChange={handleContent}
            />
        </div>
    )
}

export default QuillEditor;