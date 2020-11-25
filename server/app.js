const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const nodemailer= require('nodemailer');
const schedule = require('node-schedule');

const app = express();
app.use(cors());
app.use(express.json());

let credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
let connection = mysql.createConnection(credentials);
connection.connect();

let gmail_cred = JSON.parse(fs.readFileSync('gmail_credentials.json', 'utf8'));
const transporter = nodemailer.createTransport(gmail_cred);

function rowToObject(row) {
  return {
    send_year: row.send_year,
    send_month: row.send_month,
    send_day: row.send_day,
    email_address: row.email_address,
    code_content: row.code_content,
  };
}

app.get('/emailform/:id', (request, response) => {
  const query = 'SELECT id, send_year, send_month, send_day, email_address, code_content FROM emailform WHERE id = ?';
  const params = [request.params.id];
  connection.query(query, params, (error, rows) => {
    response.send({
      ok: true,
      email: rows.map(rowToObject),
    });
  });
});

app.post('/send', (request, response) => {
  const query = 'INSERT INTO emailform(send_year, send_month, send_day, email_address, code_content) VALUES (?, ?, ?, ?, ?)';
  const params = [request.body.send_year, request.body.send_month, request.body.send_day, request.body.email_address, request.body.code_content];
  connection.query(query, params, (error, result) => {
    if (error) throw error;
    
    response.send({
      ok: true,
    });
    
    let date = new Date(parseInt(request.body.send_year), parseInt(request.body.send_month) + 1, parseInt(request.body.send_day), 0, 0, 0);
    
    schedule.scheduleJob(date, function(){
      let mailOptions = {
        from: 'code.time.capsule@gmail.com',
        to: String(request.body.email_address),
        subject: 'Look at how much your coding skills have grown! (From Code Time Capsule)',
        text: String(request.body.code_content)
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });   
    });
  });
});

const port = 3444;
app.listen(port, () => {
  console.log(`We're live on port ${port}`);
})
