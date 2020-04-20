const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
const creds = require('./config');
const port = process.env.PORT || 5000;
require ('dotenv').config();

let transport = {
    host: 'smtp.gmail.com', 
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
}

let transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});

router.post('/api/contact', (req, res, next) => {
    const contact = req.body.contact
    let content = `
        Name: ${contact.name}<br/> 
        Email: ${contact.email}<br/> 
        Phone: ${contact.phone}<br/>
        How did you hear about us?: ${contact.how}<br/> 
        Venuw/Locations: ${contact.location}<br/> 
        Message: ${contact.message} `
    console.log(content)

    let mail = {
        to: creds.USER, // Client Email
        subject: creds.USER,
        html: content,
        dsn: {
            id: 'Fail Mail',
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: creds.USER
        },
        dsn: {
            id: 'Success Mail',
            return: 'headers',
            notify: 'success',
            recipient: creds.USER
        }
    }

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            console.log(err)
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
            status: 'success'
            })
        }
    })

    transporter.sendMail({
    	from: creds.USER, // Host email
    	to: contact.email,
    	subject: "Eastside Wedding Videography",
        html: `
        <h1>Thank you for contacting us!</h1>
        <h3>We will get back to you as soon as we can.</h3><br/>
        <p>Here is a copy of your message:</p>
        <div style="background-color: rgb(238, 238, 238); padding:10px;">
        ${content}
        </div>`
    }, function(error, info){
    	if(error) {
      	console.log(error);
    	} else{
      	console.log("follow up email sent");
    	}
    });
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(port)