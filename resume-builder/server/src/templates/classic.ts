export const classicTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Roboto:wght@300;400;500;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
    
    body {
      font-family: {fontFamily}, sans-serif;
      margin: 0;
      padding: 0;
      color: #2b2b2b;
      background-color: #ffffff;
      -webkit-print-color-adjust: exact;
      box-sizing: border-box;
    }
    
    .container {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    
    .header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      border-bottom: 2px solid {accentColor};
      padding-bottom: 15px;
    }
    
    .name {
      font-size: 2.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      letter-spacing: -0.01em;
    }
    
    .contact-info {
      font-size: 0.85rem;
      color: #4b5563;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      line-height: 1.4;
    }
    
    .contact-info a {
      color: {accentColor};
      text-decoration: none;
    }
    
    h2 {
      font-size: 1.1rem;
      font-weight: 700;
      color: {accentColor};
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
    }
    
    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .summary-text, .content-text {
      font-size: 0.9rem;
      line-height: 1.6;
      color: #374151;
      margin: 0;
    }
    
    /* Experence and Education lists styling */
    .experience-list, .education-list {
      font-size: 0.875rem;
      line-height: 1.6;
      color: #374151;
      margin: 0;
    }
    
    .experience-list ul, .education-list ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .experience-list li, .education-list li {
      margin-bottom: 6px;
    }
    
    .experience-list h3, .education-list h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
      display: flex;
      justify-content: space-between;
    }
    
    .experience-list .meta, .education-list .meta {
      font-size: 0.8rem;
      color: #6b7280;
      margin-bottom: 4px;
      font-style: italic;
    }
    
    .skills-list {
      font-size: 0.875rem;
      color: #374151;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="name">{name}</h1>
      <div class="contact-info">
        {contact}
      </div>
    </div>
    
    {resumeMainSection}
    {coverLetterMainSection}
  </div>
</body>
</html>
`;
