# DevRev_Project
Project Documentation
Project Title:
Customer Frustration Alerting System
Objective:
The objective of this project is to develop a DevRev Snap-In that detects customer frustration in real-time conversations and alerts support agents. This system aims to enhance customer service by enabling timely interventions, potentially preventing escalations, and improving customer satisfaction.
Problem Statement:
Detecting customer frustration in real-time often relies on manual observation, which can result in delayed responses and poor customer experiences. This project provides an automated solution that continuously analyzes customer sentiment during conversations, triggering alerts for support teams when frustration is detected.
Core Features:
1. Sentiment Analysis: Real-time sentiment analysis of conversation text to identify signs of frustration.
2. Threshold Configuration: Allow configuration of frustration detection thresholds using Snap-In inputs (e.g., certain words, phrases, or sentiment scores).
3. Alert Mechanism: Notify support users via email, in-app notifications, or an integrated messaging platform like Slack.
4. Tracking and Reporting: Log instances of customer frustration and generate reports for analyzing trends over time.
Tools and Technologies:
- Programming Language: TypeScript
- Platform: DevRev Snap-In Platform
- APIs:
  - DevRev APIs for fetching/posting notifications and comments
  - Email/Slack APIs for sending alerts to external services
How the System Works:
1. Event Source Configuration: The Snap-In listens to `work_created` events in the DevRev platform.
2. Sentiment Analysis Logic: When a customer message is associated with a work item, the Snap-In performs real-time sentiment analysis using predefined thresholds.
3. Trigger Alerts: If the sentiment analysis score indicates frustration, the system sends an alert to support agents.
4. Log and Track: Each detected instance is logged for reporting purposes.
File Structure:
Key Files and their Purpose:
1. `index.ts`: Entry point that listens to events, processes customer messages, and initiates the sentiment analysis and alert logic.
2. `main.ts`: Handles the main Snap-In functionality, including passing events to the sentiment analysis service.
3. `sentimentAnalysis.ts`: Implements the logic for analyzing the sentiment of customer messages and checking against predefined thresholds.
4. `loggingService.ts`: Provides methods to log important actions or errors for debugging and tracking purposes.
5. `alertService.ts`: Manages sending notifications via email or Slack when frustration is detected.
6. `apiClient.ts`: Manages API interactions with DevRev for fetching and updating work items.
7. `config.ts`: Stores configuration values such as thresholds, email recipients, and Slack webhook URLs.
8. `manifest.yaml`: Defines the Snap-In configuration, including inputs, event sources, automations, and commands.
Sample Manifest File:

    version: '2'

    name: Customer Frustration Alerting System
    description: A Snap-In to detect and alert customer frustration.

    service_account:
      display_name: "Customer Frustration Bot"

    event_sources:
      organization:
        - name: devrev-webhook
          display_name: DevRev
          type: devrev-webhook
          config:
            event_types:
              - work_created

    inputs:
      organization:
        - name: sentiment_threshold
          description: Threshold for frustration detection.
          field_type: number
          default_value: 0.5
          ui:
            display_name: Sentiment Threshold

    functions:
      - name: detect_frustration
        description: Detects customer frustration and triggers alerts.

    automations:
      - name: frustration_automation
        source: devrev-webhook
        event_types:
          - work_created
        function: detect_frustration
    
Logic Flow:
1. Event Trigger: Snap-In is triggered when a new work item is created in DevRev.
2. Sentiment Analysis: Customer messages from the work item are analyzed for frustration.
3. Threshold Check: If the sentiment score exceeds the threshold, the system categorizes it as frustration.
4. Alert and Log: Alerts are sent to support agents, and the incident is logged for reporting.
Deployment Steps:
1. Set Up DevRev Snap-In Environment: Install and configure the DevRev Snap-In CLI.
2. Update Files: Replace the default template files with the provided project-specific files (`index.ts`, `main.ts`, etc.).
3. Manifest Deployment: Deploy the Snap-In using the `manifest.yaml` file:
   ```bash
   devrev snap_in_version upgrade --manifest <PATH_TO_MANIFEST> --testing-url <URL>
   ```
4. Test Snap-In: Create or update work items in DevRev to test functionality and verify logs.
5. Monitor Logs: View logs to ensure sentiment analysis, alerts, and tracking are functioning correctly.
Conclusion:
This Snap-In automates customer frustration detection, enabling support teams to respond proactively. The integration of real-time sentiment analysis, configurable thresholds, and robust alert mechanisms ensures improved customer satisfaction and efficient handling of support cases.
