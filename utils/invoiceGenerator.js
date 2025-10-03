import fsp from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'
import {v4 as uuidv4 } from 'uuid'
import PDFDocument from 'pdfkit'


export const getInvoice = async ( transaction, baseDir) => {
    const randomUUID = uuidv4();
    const invoiceDir = path.join(baseDir, 'invoices')
    const outputPath = path.join(invoiceDir,`invoice-${randomUUID}.pdf`);

        try {
            // Ensure folder exists
            await fsp.mkdir(invoiceDir,{ recursive: true})

            // create PDF Document
            const doc = new PDFDocument()
            const writeStream = await fs.createWriteStream(outputPath)
            doc.pipe(writeStream);

            // Invoice header
            doc
                .fontSize(20)
                .text('GoldDigger Investment Invoice', { align: 'center'})
                .moveDown();
            
            // Invoice Info
            doc
                .fontSize(12)
                .text(`Invoice ID: ${randomUUID}`);
            doc.text(`Date: ${new Date().toLocaleDateString()}`);
            doc.moveDown();

            // Transaction Details
            doc.fontSize(14).text('Transaction Details', { underline: true});
            doc.moveDown(0.5);

            // Invoice details
            doc.font('fonts/GoogleSansCode-VariableFont_wght.ttf')
                .fontSize(12).text(`Transaction ID: ${transaction.id}`);
            doc.text(`Customer Email: ${transaction.email}`);
            doc.text(`Amount Paid: £${transaction.amountPaid.toFixed(2)}`);
            doc.text(`Gold Purchased: ${transaction.goldSold} oz`);
            doc.moveDown();

            // Footer
            doc
                .fontSize(10)
                .text(
                "Thank you for investing with GoldDigger.\nThis document serves as proof of your transaction.",
                { align: "center" }
                );

            doc.end();

            // Return a promise
            return new Promise((resolve, reject) => {
                writeStream.on('finish', () => resolve(outputPath));
                writeStream.on('error', reject)
            })
           
            
        } catch (error) {
            console.error(error)
        }

}