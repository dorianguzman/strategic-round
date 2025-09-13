// Google Apps Script - Email Service for QStarLabs Deck
// This script handles form submissions and sends emails

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Extract form fields (all guaranteed to be present from frontend validation)
    const name = data.name;
    const email = data.email;
    const company = data.company;
    const timestamp = data.timestamp || new Date().toISOString();
    
    // Email recipients
    const recipients = 'dorian@qstarlabs.ai,yang@qstarlabs.ai,mattrobinson@qstarlabs.ai';
    
    // Create email subject
    const subject = `Strategic Round Deck Viewer - ${company}`;
    
    // Create HTML email body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #7c3aed;">New Deck Access Request</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
        </div>
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from the QStarLabs Strategic Round deck.
        </p>
      </div>
    `;
    
    // Create plain text version
    const textBody = `
New Deck Access Request

Name: ${name}
Email: ${email}
Company: ${company}
Time: ${new Date(timestamp).toLocaleString()}

This is an automated notification from the QStarLabs Strategic Round deck.
    `;
    
    // Send the email
    MailApp.sendEmail({
      to: recipients,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody
    });
    
    // Log to Google Sheet
    let spreadsheet;
    let sheet;
    
    try {
      // Try to find existing spreadsheet by name
      const files = DriveApp.getFilesByName('QStarLabs Deck Access Log');
      if (files.hasNext()) {
        spreadsheet = SpreadsheetApp.open(files.next());
        sheet = spreadsheet.getActiveSheet();
      } else {
        // Create new spreadsheet if it doesn't exist
        spreadsheet = SpreadsheetApp.create('QStarLabs Deck Access Log');
        sheet = spreadsheet.getActiveSheet();
        
        // Add headers
        sheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Name', 'Email', 'Company', 'Date Submitted']]);
        sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
        sheet.setFrozenRows(1);
        
        // Format columns
        sheet.setColumnWidth(1, 180); // Timestamp
        sheet.setColumnWidth(2, 150); // Name
        sheet.setColumnWidth(3, 200); // Email
        sheet.setColumnWidth(4, 180); // Company
        sheet.setColumnWidth(5, 150); // Date Submitted
      }
    } catch (e) {
      console.error('Error with spreadsheet:', e);
      // If there's an error, create a new one
      spreadsheet = SpreadsheetApp.create('QStarLabs Deck Access Log ' + new Date().toISOString());
      sheet = spreadsheet.getActiveSheet();
      sheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Name', 'Email', 'Company', 'Date Submitted']]);
    }
    
    // Add the new entry
    sheet.appendRow([
      timestamp,
      name,
      email,
      company,
      new Date()
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email sent successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error
    console.error('Error in doPost:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'QStarLabs Email Service is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}