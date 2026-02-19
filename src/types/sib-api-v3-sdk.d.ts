declare module 'sib-api-v3-sdk' {
  export class ApiClient {
    static instance: ApiClient;
    authentications: {
      'api-key': {
        apiKey: string;
      };
    };
  }

  export class TransactionalEmailsApi {
    sendTransacEmail(sendSmtpEmail: SendSmtpEmail): Promise<any>;
  }

  export class SendSmtpEmail {
    sender?: { name: string; email: string };
    to?: Array<{ email: string; name?: string }>;
    subject?: string;
    htmlContent?: string;
    textContent?: string;
  }

  export class EmailCampaignsApi {
    createEmailCampaign(emailCampaigns: CreateEmailCampaign): Promise<any>;
  }

  export class CreateEmailCampaign {
    name?: string;
    subject?: string;
    sender?: { name: string; email: string };
    type?: string;
    htmlContent?: string;
    recipients?: { listIds: number[] };
    scheduledAt?: string;
  }
}
