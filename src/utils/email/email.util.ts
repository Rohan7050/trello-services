// import nodemailer from 'nodemailer';
// import { SMTP_DETAILS } from '../../config';
// import { DB_ENVIRONMENT } from '../../database/database.config';

// interface EmailData {
//   email: string | Array<string>;
//   subject: string;
//   text?: string;
//   html?: string;
//   headers?: any;
//   cc?: any;
//   bcc?: any;
//   attachments?: any;
// }

// export class EmailService {
//   static async sendEmail(data: EmailData) {
//     return new Promise(async (resolve, reject) => {
//       console.log(DB_ENVIRONMENT, SMTP_DETAILS[DB_ENVIRONMENT].SMTP_HOST)

//       let transporter = nodemailer.createTransport({
//         // @ts-ignore
//         host: SMTP_DETAILS[DB_ENVIRONMENT].SMTP_HOST,
//         port: SMTP_DETAILS[DB_ENVIRONMENT].SMTP_PORT,
//         secure: false,
//         tls: {
//           rejectUnauthorized: false,
//         },
//         auth: {
//           user: SMTP_DETAILS[DB_ENVIRONMENT].SMTP_USER,
//           pass: SMTP_DETAILS[DB_ENVIRONMENT].SMTP_PASSWORD,
//         },
//         logger: false,
//       });

//       transporter.sendMail(
//         {
//           from: SMTP_DETAILS[DB_ENVIRONMENT].FROM_ADDRESS,
//           to: data.email,
//           cc: SMTP_DETAILS[DB_ENVIRONMENT].CC,
//           bcc: SMTP_DETAILS[DB_ENVIRONMENT].BCC,
//           subject: data.subject,
//           text: data.text,
//           html: data.html,
//           headers: data.headers,
//           attachments: data.attachments,
//         },
//         (err, info) => {
//           if (err) return reject(err);
//           resolve(info.response);
//         }
//       );
//     });
//   }

//   static async sendEmailWithPriority(data: EmailData, priority: any) {
//     return new Promise(async (resolve, reject) => {
//       let transporter = nodemailer.createTransport({
//         // @ts-ignore
//         priority: priority,
//         headers: {
//           'x-priority': '1',
//           'x-msmail-priority': priority,
//           importance: priority,
//         },
//         host: SMTP_DETAILS[DB_ENVIRONMENT].SMTP_HOST,
//         port: SMTP_DETAILS[DB_ENVIRONMENT].SMTP_PORT,
//         pool: true,
//         tls: {
//           rejectUnauthorized: false,
//         },
//         auth: {
//           user: SMTP_DETAILS[DB_ENVIRONMENT].SMTP_USER,
//           pass: SMTP_DETAILS[DB_ENVIRONMENT].SMTP_PASSWORD,
//         },
//         logger: false,
//       });

//       transporter.sendMail(
//         {
//           from: SMTP_DETAILS[DB_ENVIRONMENT].FROM_ADDRESS,
//           to: data.email,
//           cc: SMTP_DETAILS[DB_ENVIRONMENT].CC,
//           bcc: SMTP_DETAILS[DB_ENVIRONMENT].BCC,
//           subject: data.subject,
//           text: data.text,
//           html: data.html,
//           headers: data.headers,
//           attachments: data.attachments,
//         },
//         (err, info) => {
//           if (err) return reject(err);
//           resolve(info.response);
//         }
//       );
//     });
//   }
// }
