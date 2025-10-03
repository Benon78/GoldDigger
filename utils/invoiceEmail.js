import nodemailer from 'nodemailer';
import { getInvoice } from "./invoiceGenerator.js";

export const sendInvoiceEmail = async (transaction, baseDir) => {
   try {

        // Get invoice PDF
        const invoicePath = await getInvoice(transaction,baseDir)

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GOOGLE_EMAIL_USER,
                pass: process.env.GOOGLE_APP_PASSWORD,
            },
        });

        // Setup email details
        const mailOptions = {
            from: `"GoldDigger" <${process.env.GOOGLE_EMAIL_USER}>`,
            to: transaction.email,
            subject: 'Your GoldDigger Investiment Invoice',
            text: `Dear invester,

            Thank you for your purchase of £${transaction.amountPaid}. You bought ${transaction.goldSold} oz of gold.

            Please find your official invoice attached.

            Best regards,
            GoldDigger Team`,
            attachements: [
                {
                    filename: `invoice-${transaction.id}.pdf`,
                    path: invoicePath,
                }
            ],
        }

        //Send email
        await transporter.sendMail(mailOptions);
        console.log(`Invoice Sent to ${transaction.email}`);
    
   } catch (error) {
    console.log('Fail to send invoice: ', error);
   }
}