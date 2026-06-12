const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "Applied Biotech Systems", email: process.env.EMAIL_FROM || "noreply@appliedbiotech.com" };
    sendSmtpEmail.to = [{ email: toEmail }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (error) {
    console.error('[CORE MAIL SUB-SYSTEM EXCEPTION]:', error);
    return false;
  }
};

module.exports = { sendEmail };
