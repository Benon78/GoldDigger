import fs from 'node:fs/promises';
import path from 'node:path';
import { sendResponse } from "./sendResponse.js";
import {getContentType} from './getContentType.js';


export const serveStatic = async (req, res, baseDirname) => {

    const publicDir = path.join(baseDirname,'public')
    const filePath = path.join(
        publicDir,
        req.url === '/' ? 'index.html' : req.url
    )

    // get the file extention
    const ext = path.extname(filePath)

    // get the content type
    const contentType = getContentType(ext)

    try {

        const content = await fs.readFile(filePath)
        sendResponse(res,200,contentType,content)
        
    } catch (error) {
        if(error.code == 'ENOENT'){
            const content = await fs.readFile(path.join(publicDir,'404.html'))
            sendResponse(res,404,'text/html',content)
        }
        else{
            const content = await fs.readFile(path.join(publicDir,'404.html'))
            sendResponse(res,404,'text/html',content)
        }
    }
}