import { SendEmailCommand } from "@aws-sdk/client-ses";

export function getEmailCommand(
  recipient: string,
  password: string,
): SendEmailCommand {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `You have been invited to a StoryCrafter project! Your credentials are:
- Username: Your email
- Password: ${password}
This password is temporary. You will need to change it after your first login.`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Story Crafter invitation!",
      },
    },
    Source: "cybersorcerers23@gmail.com",
    ReplyToAddresses: [
      /* more items */
    ],
  });
}
