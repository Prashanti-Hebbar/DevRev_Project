import { client, publicSDK } from "@devrev/typescript-sdk";
import Sentiment from 'sentiment'; // Sentiment analysis library
import nodemailer from 'nodemailer'; // Email notification
import { WebClient } from '@slack/web-api'; // Slack notification

// Sentiment Analysis Setup
const sentiment = new Sentiment();

// Configuration for thresholds
const FRUSTRATION_THRESHOLD = -1; // Threshold for negative sentiment score
const FRUSTRATION_KEYWORDS = ['angry', 'frustrated', 'bad experience', 'disappointed']; // Keywords for frustration

// Slack Setup (replace with your Slack token)
const slackClient = new WebClient('YOUR_SLACK_TOKEN');
const slackChannel = '#support-alerts';

// Email Setup (replace with your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

async function sendEmailAlert(ticketId: string, message: string) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'support-team@example.com',
    subject: `Frustration Alert: Ticket ${ticketId}`,
    text: `Frustration detected in ticket ${ticketId}:\n\n${message}`,
  };

  await transporter.sendMail(mailOptions);
}

async function sendSlackAlert(ticketId: string, message: string) {
  await slackClient.chat.postMessage({
    channel: slackChannel,
    text: `🚨 Frustration Alert! 🚨\n\nTicket ${ticketId} has customer frustration:\n\n${message}`,
  });
}

// Frustration detection logic
function detectFrustration(message: string): boolean {
  // Sentiment analysis
  const sentimentResult = sentiment.analyze(message);
  if (sentimentResult.score <= FRUSTRATION_THRESHOLD) {
    return true; // Frustration detected based on sentiment score
  }

  // Keyword-based detection
  for (let keyword of FRUSTRATION_KEYWORDS) {
    if (message.toLowerCase().includes(keyword)) {
      return true; // Frustration detected based on keywords
    }
  }

  return false;
}

export async function handleEvent(event: any) {
  const devrevPAT = event.context.secrets.service_account_token;
  const APIBase = event.execution_metadata.devrev_endpoint;
  const devrevSDK = client.setup({
    endpoint: APIBase,
    token: devrevPAT,
  });

  try {
    // Fetch the latest support ticket (you can adjust the query as needed)
    const response = await devrevSDK.worksList({
      limit: 1,
      type: [publicSDK.WorkType.Ticket],
    });

    const ticket = response.data.works[0];
    const customerMessage = (ticket as any).customer_message;
 // Assuming customer_message is part of the ticket object

    // Check if the customer's message indicates frustration
    if (detectFrustration(customerMessage)) {
      // Send email and Slack alerts
      await sendEmailAlert(ticket.id, customerMessage);
      await sendSlackAlert(ticket.id, customerMessage);

      // Track the event in logs (for reporting/tracking)
      console.log(`Frustration detected in ticket ${ticket.id}:`, customerMessage);

      // Optionally, you can log the event to a database or file for reporting
      // logFrustration(ticket.id, customerMessage);
    }

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const run = async (events: any[]) => {
  for (let event of events) {
    await handleEvent(event);
  }
};

export default run;
