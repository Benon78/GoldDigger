import fs from 'node:fs/promises'
import path from 'node:path'
import { format } from 'node:util'

export const logPurchase = async(data, baseDir) => {
    const { timeStamp, amountPaid, pricePerOz, goldSold } = data;

    const formartEntry = format(
        '%s | amount paid: £%s | price per Oz: £%s | gold sold: %s Oz \n',
        timeStamp,
        amountPaid,
        pricePerOz,
        goldSold
    )

   const filePath = path.join(baseDir,'purchase.txt')
   fs.appendFile(filePath,formartEntry,'utf-8')
}