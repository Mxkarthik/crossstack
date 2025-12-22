import {createTransport} from 'nodemailer'

const sendMail = async({email,subject,html})=>{
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
            user : "djskasdf",
            pass:  "asdfasdfa"
        },
    });

    await transport.sendMail({
        from: "dsadsfasd",
        to:email,
        subject,
        html,
    });
};

export default sendMail;