import { APP_NAME } from "@/lib/resend";

interface ApplicationReceivedProps {
  applicantName: string;
  jobTitle: string;
  companyName: string;
}

export function ApplicationReceivedEmail({
  applicantName,
  jobTitle,
  companyName,
}: ApplicationReceivedProps) {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "#0284c7" }}>{APP_NAME}</h1>
      <p>{applicantName} 様</p>
      <p>
        <strong>{companyName}</strong> の <strong>{jobTitle}</strong> へのご応募ありがとうございます。
      </p>
      <p>応募内容を確認の上、担当者よりご連絡差し上げます。しばらくお待ちください。</p>
      <hr />
      <p style={{ color: "#6b7280", fontSize: "12px" }}>{APP_NAME}</p>
    </div>
  );
}

interface ApplicationStatusChangedProps {
  applicantName: string;
  jobTitle: string;
  companyName: string;
  status: string;
  message?: string;
}

export function ApplicationStatusChangedEmail({
  applicantName,
  jobTitle,
  companyName,
  status,
  message,
}: ApplicationStatusChangedProps) {
  const statusLabel: Record<string, string> = {
    reviewing: "選考中",
    interview: "面接調整中",
    offered: "内定",
    rejected: "不採用",
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "#0284c7" }}>{APP_NAME}</h1>
      <p>{applicantName} 様</p>
      <p>
        <strong>{companyName}</strong> の <strong>{jobTitle}</strong> への応募状況が更新されました。
      </p>
      <p>
        現在のステータス: <strong>{statusLabel[status] ?? status}</strong>
      </p>
      {message && <p>{message}</p>}
      <hr />
      <p style={{ color: "#6b7280", fontSize: "12px" }}>{APP_NAME}</p>
    </div>
  );
}

interface NewApplicationNotificationProps {
  employerName: string;
  applicantName: string;
  jobTitle: string;
  dashboardUrl: string;
}

export function NewApplicationNotificationEmail({
  employerName,
  applicantName,
  jobTitle,
  dashboardUrl,
}: NewApplicationNotificationProps) {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "#0284c7" }}>{APP_NAME}</h1>
      <p>{employerName} 様</p>
      <p>
        <strong>{jobTitle}</strong> に <strong>{applicantName}</strong> 様から応募がありました。
      </p>
      <a
        href={dashboardUrl}
        style={{
          display: "inline-block",
          backgroundColor: "#0284c7",
          color: "white",
          padding: "12px 24px",
          borderRadius: "6px",
          textDecoration: "none",
          marginTop: "16px",
        }}
      >
        ダッシュボードで確認する
      </a>
      <hr />
      <p style={{ color: "#6b7280", fontSize: "12px" }}>{APP_NAME}</p>
    </div>
  );
}
