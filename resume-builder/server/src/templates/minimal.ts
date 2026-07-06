export const minimalTemplate = `
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
      color: #374151;
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
      gap: 20px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 15px;
    }
    
    .name-title {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .name {
      font-size: 2.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      letter-spacing: -0.02em;
    }
    
    .subtitle {
      font-size: 0.95rem;
      color: {accentColor};
      margin: 0;
      font-weight: 500;
    }
    
    .contact-info {
      font-size: 0.8rem;
      color: #4b5563;
      text-align: right;
      line-height: 1.5;
    }
    
    .contact-info a {
      color: {accentColor};
      text-decoration: none;
    }
    
    .grid-layout {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 10px;
    }
    
    h2 {
      font-size: 0.8rem;
      font-weight: 700;
      color: {accentColor};
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    
    .section-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .summary-text, .content-text {
      font-size: 0.85rem;
      line-height: 1.5;
      color: #4b5563;
      margin: 0;
    }
    
    /* Experence and Education lists styling */
    .experience-list, .education-list {
      font-size: 0.85rem;
      line-height: 1.5;
      color: #4b5563;
      margin: 0;
    }
    
    .experience-list ul, .education-list ul {
      margin: 0;
      padding-left: 15px;
    }
    
    .experience-list li, .education-list li {
      margin-bottom: 5px;
    }
    
    .experience-list h3, .education-list h3 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
      display: flex;
      justify-content: space-between;
    }
    
    .experience-list .meta, .education-list .meta {
      font-size: 0.775rem;
      color: #9ca3af;
      margin-bottom: 4px;
    }
    
    .skills-list {
      font-size: 0.85rem;
      color: #4b5563;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="name-title">
        <h1 class="name">{name}</h1>
      </div>
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
