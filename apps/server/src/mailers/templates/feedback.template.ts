export const feedbackTemplate = (
  name: string,
  email: string,
  feedback: {
    type: "bug" | "feature" | "general";
    subject: string;
    description: string;
  },
  brandColor = "#000000",
  brandName = "Locatr",
) => ({
  subject: `New ${feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)} Feedback - ${feedback.subject}`,
  text: `
New feedback received from ${name} (${email})

Type: ${feedback.type.toUpperCase()}
Subject: ${feedback.subject}

Message:
${feedback.description}

Please review and take appropriate action.
  `,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${brandColor}; font-size: 24px; font-weight: bold; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .content { padding: 20px; }
      .content h1 { font-size: 24px; color: #333333; margin-bottom: 20px; }
      .feedback-info { background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid ${brandColor}; }
      .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
      .label { font-weight: bold; color: #555555; }
      .value { color: #333333; }
      .type-badge { 
        display: inline-block; 
        padding: 4px 12px; 
        font-size: 12px; 
        font-weight: bold; 
        text-transform: uppercase; 
        border-radius: 20px; 
        color: #ffffff;
        background-color: ${feedback.type === "bug" ? "#dc3545" : feedback.type === "feature" ? "#28a745" : "#6c757d"};
      }
      .description { 
        background-color: #ffffff; 
        padding: 15px; 
        border: 1px solid #e0e0e0; 
        border-radius: 6px; 
        margin: 15px 0; 
        line-height: 1.6;
      }
      .footer { 
        font-size: 14px; 
        color: #999999; 
        text-align: center; 
        padding: 20px; 
        border-top: 1px solid #e0e0e0; 
        margin-top: 20px; 
      }
    </style></head><body>
      <div class="container">
        <div class="header">${brandName} Admin</div>
        <div class="content">
          <h1>New Feedback Received</h1>
          
          <div class="feedback-info">
            <div class="info-row">
              <span class="label">From:</span>
              <span class="value">${name} (${email})</span>
            </div>
            <div class="info-row">
              <span class="label">Type:</span>
              <span class="type-badge">${feedback.type}</span>
            </div>
            <div class="info-row">
              <span class="label">Subject:</span>
              <span class="value">${feedback.subject}</span>
            </div>
          </div>

          <div class="description">
            <strong>Message:</strong><br><br>
            ${feedback.description.replace(/\n/g, "<br>")}
          </div>
        </div>
        
        <div class="footer">
          <p>This feedback was submitted through the ${brandName} feedback form.</p>
          <p>Please review and respond appropriately.</p>
        </div>
      </div>
    </body></html>
  `,
});
