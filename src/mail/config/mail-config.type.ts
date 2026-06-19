export type MailConfig = {
  appName: string;
  resendApiKey: string;
  contactFromEmail: string;
  contactToEmail: string;
};

export type IncomingMailConfig = MailConfig & {
  resendWebhookSigningSecret: string;
  resendWebhookToleranceSeconds: number;
  incomingToEmails?: string;
};
