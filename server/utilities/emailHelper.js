const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const transport = nodemailer.createTransport({
    service:"gmail",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL_ID,
        pass:process.env.APP_PASSWORD
    }
});
const replaceTags = (content,detailsToUpdate)=>{
    return Object.keys(detailsToUpdate).reduce((updatedContent,key)=>{
        return updatedContent.replace(new RegExp(`#{${key}}`,"g"),detailsToUpdate[key])
    },content)
}
const emailHelper = async(templateName,receiverEmail,detailsToUpdate)=>{
    try{
        const templatePath = path.join(__dirname,"email_templates",templateName);
        let content = await fs.promises.readFile(templatePath,"utf-8");
        content = replaceTags(content,detailsToUpdate);
        const emailDetails = {
            to:receiverEmail,
            from:process.env.EMAIL_ID,
            subject:"Email sent from Book My Show",
            html:content
        }
        await transport.sendMail(emailDetails);
        console.log("email sent");
    }
    catch(error){
        console.log("failed to send email")
    }
}
module.exports = emailHelper;