const AWS = require('aws-sdk');
const ses = new AWS.SES();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  const params = {
    Destination: {
      ToAddresses: ['your@email.com'],
    },
    Message: {
      Body: {
        Text: {
          Data: `Name: ${body.name}\nEmail: ${body.email}\nMessage: ${body.message}`,
        },
      },
      Subject: { Data: 'AgTrackr Contact Form Submission' },
    },
    Source: 'reece@nunezdev.com',
  };

  try {
    await ses.sendEmail(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (err) {
    console.error('Error sending email:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
