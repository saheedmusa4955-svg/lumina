import { sendEmail } from './utils/mailer';

export const sendTransactionEmail = async (userEmail: string, type: string, amount: number, status: string, reason?: string) => {
  const subject = `Transaction ${status}: ${type}`;
  
  // Format the amount
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  let html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
      <h2 style="color: #333;">Transaction ${status}</h2>
      <p>Hello,</p>
      <p>Your recent <strong>${type}</strong> transaction for <strong>${formattedAmount}</strong> has been <strong>${status}</strong>.</p>
  `;

  if (reason && status === 'DECLINED') {
    html += `<p style="color: #d9534f; background: #fdf7f7; padding: 10px; border-radius: 4px;"><strong>Reason:</strong> ${reason}</p>`;
  }

  html += `
      <p>If you have any questions, please contact our support team.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Lumina Bank. All rights reserved.</p>
    </div>
  `;

  try {
    await sendEmail(userEmail, subject, html);
    console.log(`[EMAIL] Successfully sent ${status} transaction email to ${userEmail}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send transaction email to ${userEmail}:`, error);
  }
};
