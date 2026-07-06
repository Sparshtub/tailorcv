export const prismTemplate = `
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
      color: #1f2937;
      background-color: #ffffff;
      -webkit-print-color-adjust: exact;
      box-sizing: border-box;
    }
    
    .container {
      display: flex;
      min-height: 297mm;
      width: 210mm;
      margin: 0 auto;
    }
    
    .sidebar {
      width: 32%;
      background-color: {accentColor}0a;
      border-right: 1px solid {accentColor}30;
      padding: 30px 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .main {
      width: 68%;
      padding: 35px 30px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .name-title {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .name {
      font-size: 2.25rem;
      font-weight: 800;
      color: #111827;
      line-height: 1.1;
      margin: 0;
    }
    
    .subtitle {
      font-size: 0.95rem;
      font-weight: 600;
      color: {accentColor};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }
    
    h2 {
      font-size: 0.95rem;
      font-weight: 700;
      color: {accentColor};
      border-bottom: 2px solid {accentColor}30;
      padding-bottom: 5px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    
    .section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .contact-info {
      font-size: 0.8rem;
      line-height: 1.6;
      color: #4b5563;
    }
    
    .contact-info a {
      color: {accentColor};
      text-decoration: none;
    }
    
    .skills-list {
      font-size: 0.85rem;
      color: #374151;
      line-height: 1.6;
    }
    
    .summary-text, .content-text {
      font-size: 0.875rem;
      line-height: 1.6;
      color: #374151;
      margin: 0;
    }
    
    /* Experence and Education lists styling */
    .experience-list, .education-list {
      font-size: 0.85rem;
      line-height: 1.6;
      color: #374151;
      margin: 0;
    }
    
    .experience-list ul, .education-list ul {
      margin: 0;
      padding-left: 18px;
    }
    
    .experience-list li, .education-list li {
      margin-bottom: 6px;
    }
    
    .experience-list h3, .education-list h3 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 4px 0;
    }
    
    .experience-list .meta, .education-list .meta {
      font-size: 0.775rem;
      color: #6b7280;
      margin-bottom: 6px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <div class="name-title">
        <h1 class="name">{name}</h1>
      </div>
      
      <div class="section">
        <h2>Contact</h2>
        <div class="contact-info">
          {contact}
        </div>
      </div>
      
      {skillsSection}
    </div>
    
    <div class="main">
      {resumeMainSection}
      {coverLetterMainSection}
    </div>
  </div>
</body>
</html>
`;
