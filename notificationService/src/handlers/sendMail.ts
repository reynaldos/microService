import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SQSEvent } from "aws-lambda";
import { REGION  } from '../constants/Environments';

const sesClient = new SESClient({
	region: REGION,
});

export interface SendEmail {
	recipient: string;
	subject: string;
	body: string;
}

const emailSender = 'rey.sanchez.dev@gmail.com';

const send = async ({ recipient, subject, body }: SendEmail) => {
// const send = async () => {
		try {
			const params = {
        Source: emailSender,
				ReplyToAddresses: [emailSender],
				Destination: {
					ToAddresses: [...recipient.split(',').map((email) => email.trim())],
					// ToAddresses: ['rey.sanchez.dev@gmail.com'],
				},
				Message: {
          Subject: {
						Charset: 'UTF-8',
						Data: subject,
					},
					Body: {
						Html: {
							Charset: 'UTF-8',
							Data: body,
						},
					},	
				}
			};

			const command = new SendEmailCommand(params);
			return await sesClient.send(command);
		} catch (error) {
			console.log(error);
		}
	};



// definition for lambda function
async function sendMail(event: SQSEvent) {

  const record = event.Records[0];
  console.log(record);

  const email: SendEmail = JSON.parse(record.body);

  const result = await send(email);
  console.log(result);
	
  return event;
};
	
// exported as handler
export const handler = sendMail;
