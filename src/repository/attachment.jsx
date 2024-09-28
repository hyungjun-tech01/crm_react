import React from 'react';
import { selector } from "recoil";

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const AttachmentRepo = selector({
    key: "AttachmentRepository",
    get: ({getCallback}) => {
        const uploadFile = getCallback(() => async (file) => {
            const fileName = file.name;
            const ext_index = fileName.lastIndexOf('.');
            const fileExt = ext_index !== -1 ? fileName.slice(ext_index + 1) : "";

            const formData = new FormData();
            formData.append('fileName', fileName);
            formData.append('fileExt', fileExt);
            formData.append("file", file); // 위에서 만든 폼데이터에 이미지 추가
            
            try {
                const response = await fetch(`${BASE_PATH}/upload`, {
                    method: "POST",
                    body: formData,
                })
                const result = await response.json();

                if(result.status === 500) {
                    return { result: false, message: 'Image 올리는 중 error가 발생했습니다.'};
                };
                return {
                    result: true,
                    data: {
                        dirName: result.dirName,
                        fileName: result.fileName,
                        fileExt: result.fileExt,
                        url: result.url
                    }
                };
            } catch(err) {
                return { result: false, message: 'Image 올리는 중 error가 발생했습니다.'};
            };
        });
        const deleteFile = getCallback(() => async (dirName, fileName, fileExt) => {
            const queryObj = {
                dirName : dirName,
                fileName : fileName,
                fileExt : fileExt,
            };
            const input_json = JSON.stringify(queryObj);
            try{
                const response = await fetch(`${BASE_PATH}/deleteFile`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const result = await response.json();
                return { result: true, data: {fileName: result.fileName, filePath: result.filePath} };
            } catch(e) {
                console.log('\t[ deleteAttachment ] error occurs');
                return { result: false, message: 'fail to query'};
            };
        });
        const modifyAttachmentInfo = getCallback(() => async (data) => {
            const queryObj = {
                action_type : data.actionType,
                attachment_code : data.attachmentCode,
                uuid : data.uuid,
                dir_name : data.dirName,  
                file_name : data.fileName,
                file_ext : data.fileExt,
                creator : data.creator,
            };
            const input_json = JSON.stringify(queryObj);
            try{
                const response = await fetch(`${BASE_PATH}/modifyAttachment`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const result = await response.json();
                if(result.message) {
                    return { result: false, message: result.message};
                } else {
                    return {
                        result: true,
                        data: {
                            attachmentCode : result.out_attachment_code,
                            uuid : result.out_uuid,
                            index : result.out_attachment_index,
                            creator : result.out_create_user,
                            createDate : result.out_create_date,
                            deleteDate : result.out_delete_date,
                        }
                    };
                }
            } catch(e) {
                console.log('\t[ deleteAttachment ] error occurs');
                return { result: false, message: 'fail to query'};
            };
        })

        return {
            uploadFile,
            deleteFile,
            modifyAttachmentInfo,
        }
    }
})