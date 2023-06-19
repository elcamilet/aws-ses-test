import React, { useState } from 'react';
import AWS from 'aws-sdk';

export function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    recipient: '',
    subject: '',
    message: ''
  });
  const [responseLog, setResponseLog] = useState([]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Set up the AWS SDK with your credentials and region
    AWS.config.update({
      region: 'eu-west-1', // Replace with your region
      credentials: new AWS.Credentials('ACCESS_KEY', 'SECRET_KEY') // Replace with your credentials
    });

    // Create a new SES object
    const ses = new AWS.SES();

    // Get the form values
    const { name, email, recipient, subject, message } = formData;

    // Set up the parameters for the email
    const params = {
      Destination: {
        ToAddresses: [recipient]
      },
      Message: {
        Body: {
          Text: {
            Data: message
          }
        },
        Subject: {
          Data: subject
        }
      },
      Source: `${name} <${email}>`
    };

    // Send the email
    ses.sendEmail(params, function(err, data) {
      if (err) {
        console.error(err);
        setResponseLog([...responseLog, "ERROR: " + err]); 
      } else {
        console.log(data);
        setResponseLog([...responseLog, "SUCCESS: " + JSON.stringify(data)]); 
      }
    });
  }

  return (
    <>
      <h1>AWS Simple Email Service Test</h1>
      <div className="container">
        <div className="left">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />

            <label htmlFor="email">Remitente</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />

            <label htmlFor="recipient">Destinatario</label>
            <input type="email" id="recipient" name="recipient" value={formData.recipient} onChange={handleChange} />

            <label htmlFor="subject">Asunto</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} />

            <label htmlFor="message">Mensaje</label>
            <textarea id="message" name="message" rows="8" cols="50" value={formData.message} onChange={handleChange}></textarea>

            <button type="submit">Enviar</button>
          </form>
        </div>
        <div className="right">
          <p>
            <h4>REGISTROS</h4>
            {responseLog.map((item, index) => (
              <><li key={index}>{item}</li><br /></>
            ))}
          </p>
        </div>
      </div>
    </>
  );
}
