import { resend, FROM_EMAIL, APP_NAME } from "@/lib/resend";
import {
  ApplicationReceivedEmail,
  ApplicationStatusChangedEmail,
  NewApplicationNotificationEmail,
} from "./templates";

export async function sendApplicationReceivedEmail({
  to,
  applicantName,
  jobTitle,
  companyName,
}: {
  to: string;
  applicantName: string;
  jobTitle: string;
  companyName: string;
}) {
  return resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `【応募完了】${jobTitle}（${companyName}）へのご応募を受け付けました`,
    react: ApplicationReceivedEmail({ applicantName, jobTitle, companyName }),
  });
}

export async function sendApplicationStatusChangedEmail({
  to,
  applicantName,
  jobTitle,
  companyName,
  status,
  message,
}: {
  to: string;
  applicantName: string;
  jobTitle: string;
  companyName: string;
  status: string;
  message?: string;
}) {
  return resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `【選考状況更新】${jobTitle}（${companyName}）の応募状況が更新されました`,
    react: ApplicationStatusChangedEmail({
      applicantName,
      jobTitle,
      companyName,
      status,
      message,
    }),
  });
}

export async function sendNewApplicationNotificationEmail({
  to,
  employerName,
  applicantName,
  jobTitle,
  dashboardUrl,
}: {
  to: string;
  employerName: string;
  applicantName: string;
  jobTitle: string;
  dashboardUrl: string;
}) {
  return resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `【新着応募】${jobTitle}に新しい応募がありました`,
    react: NewApplicationNotificationEmail({
      employerName,
      applicantName,
      jobTitle,
      dashboardUrl,
    }),
  });
}
