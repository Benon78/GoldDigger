import { v4 as uuidv4 } from 'uuid'
import { logPurchase } from "../utils/logPurchase.js"
import { sendResponse } from "../utils/sendResponse.js"
import { sendInvoiceEmail } from '../utils/invoiceEmail.js'

export const handlePost = async (req,res,baseDir) => {
    const transactionId = uuidv4();
    let body = ''

    for await (const chuck of req){
        body += chuck
    }

    try {

        const data = JSON.parse(body)
        sendResponse(res,200,'application/json',JSON.stringify({success: true}))
        await logPurchase(data,baseDir)
        await sendInvoiceEmail({id: transactionId, ...data}, baseDir)

    } catch (error) {
        console.error(error)
        sendResponse(res,400,'application/json',JSON.stringify({success: false}))
    }

}