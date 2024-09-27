import React from 'react';
import { selector } from "recoil";

import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const AttachmentRepo = selector({
    key: "AttachmentRepository",
    get: ({getCallback}) => {
        const deleteAttachmentFile = getCallback(() => async (dirName, fileName, fileExt) => {
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
            deleteAttachmentFile,
            modifyAttachmentInfo,
        }
    }
})