export default `
<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#E6A8D7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#87CEEB;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#grad)" rx="20" ry="20"/>
  <path d="M0 0 Q150 150 300 0 T600 0" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <path d="M0 100 Q150 250 300 100 T600 100" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
</svg>
`;
