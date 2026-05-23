# Public Assets - Caminho Digital

This directory contains public assets served directly by the Next.js server. The following files are referenced in the application and should be present:

## Required Files

### Favicon
- **File**: `favicon.ico`
- **Size**: 32x32 (or 64x64)
- **Format**: ICO format
- **Usage**: Browser tab icon, address bar icon
- **Tools**: Use favicon generators or convert from PNG/SVG
- **Recommended**: Create from main branding colors (Caminho Digital green #10b981)

### Apple Icon
- **File**: `apple-icon.png`
- **Size**: 180x180 pixels minimum
- **Format**: PNG with transparency
- **Usage**: iOS home screen icon, PWA install icon
- **Tools**: Use design software or logo generator
- **Recommended**: Caminho Digital mark/logo on gradient background

### Open Graph Image
- **File**: `og-image.png`
- **Size**: 1200x630 pixels
- **Format**: PNG
- **Usage**: Social media sharing (LinkedIn, Facebook, Twitter, WhatsApp)
- **Content**: Marketing message + branding
- **Recommended**: 
  - "Caminho Digital - Turbine Suas Redes"
  - ERP branding
  - Green accent color (#10b981)
  - Include key features or value proposition

### Web App Manifest Icon References
- **File**: `site.webmanifest`
- **Status**: ✅ Generated (references favicon.ico and apple-icon.png)
- **Purpose**: PWA support and web app installability

## Generation Tools

### Favicon
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/

### All-in-one Asset Generator
- https://www.npmjs.com/package/pwa-asset-generator (npm package)
  ```bash
  npm install -g pwa-asset-generator
  pwa-asset-generator ./logo.svg ./public --splash-only
  ```

### Social Media Image Generator
- Figma (design-based)
- Canva (template-based)
- Manual creation with design software

## Implementation Priority

1. **favicon.ico** — Quick to generate, critical for browser
2. **apple-icon.png** — PWA support
3. **og-image.png** — Social sharing and marketing

## Current Status

- ✅ Routes configured in Next.js
- ✅ Metadata references in `app/layout.tsx`
- ✅ Manifest file created (`site.webmanifest`)
- ⏳ **Waiting**: Visual asset files (images/icons)

## Next Steps

1. Create or design the favicon
2. Create or design the apple icon
3. Create or design the OG image
4. Place files in this directory
5. Test with social media debuggers (Facebook, LinkedIn, Twitter)

---

**Note**: All PNG files should be optimized (use tools like TinyPNG, ImageOptim) before deployment to minimize bandwidth usage.
