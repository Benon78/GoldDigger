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

        // 3️⃣ Build HTML email
            const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color:#d4af37;">GoldDigger Investment Confirmation</h2>
                <p>Dear Investor,</p>
                <p>Thank you for your investment with <strong>GoldDigger</strong>.</p>
                <p><strong>Transaction Summary:</strong></p>
                <ul>
                <li><b>Transaction ID:</b> ${transaction.id}</li>
                <li><b>Amount Paid:</b> £${transaction.amountPaid}</li>
                <li><b>Gold Purchased:</b> ${transaction.goldSold} oz</li>
                </ul>
                <p>Please find your official invoice attached as a PDF document.</p>
                <p style="margin-top:20px;">Best regards,<br/>The GoldDigger Team</p>
            </div>
            `;

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
            html: htmlContent,
            attachments: [
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