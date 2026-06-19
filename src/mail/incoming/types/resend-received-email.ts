export type ResendReceivedEmail = {
  id?: string;
  to?: string[];
  from?: string;
  subject?: string | null;
  html?: string | null;
  text?: string | null;
  attachments?: Array<{
    filename?: string;
    content_type?: string;
    content_disposition?: string | null;
    content_id?: string | null;
    size?: number;
  }>;
};
