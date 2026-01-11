# CLAUDE.md

Project guidance for Claude Code when working with this repository.

## Project Overview

RentaNet is a static marketing website for an Australian web and email hosting company (renta.net). Promotes PHP/static hosting, email services, domain registration, and Linux consulting.

## File Structure

```
rentanet/
├── index.html              # Homepage
├── base.css                # Generic reusable framework styles
├── site.css                # Site-specific theming (colors, fonts)
├── base.js                 # Generic framework JavaScript
├── site.js                 # Site-specific JavaScript (optional, for complex sites)
├── Server_Room_Dark.webp   # Hero background image
├── favicon.ico             # Site favicon
├── services/index.html     # Services page
├── pricing/index.html      # Pricing page
├── linux/index.html        # Linux support page
├── ai.txt                  # Complete site content in prose (for AI agents)
├── base.txt                # Generic site structure specification
├── site.txt                # Site-specific configuration values
├── deploy.php              # Webhook handler for auto-deploy
└── .env.example            # Webhook secret template
```

## Framework Files (base.* and site.*)

The site uses a modular architecture separating generic framework from site-specific customization:

| Generic (reusable)  | Site-specific        | Purpose              |
|---------------------|----------------------|----------------------|
| `base.css`          | `site.css`           | Styles               |
| `base.js`           | `site.js` (optional) | JavaScript           |
| `base.txt`          | `site.txt`           | AI specifications    |
| —                   | `ai.txt`             | Content              |

### base.css (~1300 lines)
Generic CSS framework with layout patterns, components, animations, and responsive breakpoints. Uses CSS custom properties with sensible defaults that site.css overrides.

### site.css (~215 lines)
Site-specific theming: color palette, fonts, background images, and brand tweaks.

### base.js (~180 lines)
Generic JavaScript: theme toggle, particles, navbar scroll effect, mobile menu, scroll reveal animations. Uses `SITE_CONFIG` object for site-specific values.

### site.js (optional)
For complex sites needing custom JavaScript beyond what base.js provides. Not used by RentaNet but available for sites with interactive features.

### base.txt
Describes the HTML structure patterns: section types, navigation, footer, card layouts, utility classes.

### site.txt
Site-specific configuration: brand name, colors, fonts, navigation links, page metadata.

### ai.txt
Complete textual content in prose form. Dual purpose:
1. AI agents can fetch it to understand the site without parsing HTML
2. Source of truth for content when regenerating pages

## Creating a New Site

Step-by-step guide to create a new site using this framework:

### Step 1: Copy Framework Files

Copy these files unchanged:
```
base.css    → newsite/base.css
base.js     → newsite/base.js
base.txt    → newsite/base.txt (reference only, not served)
```

### Step 2: Create site.css

Start from RentaNet's site.css as a template. Customize:

```css
:root {
    /* Your brand colors */
    --accent: #YOUR_COLOR;
    --accent-hover: #YOUR_HOVER;

    /* Your fonts */
    --font-primary: "YourFont", sans-serif;
    --font-heading: "YourHeadingFont", sans-serif;

    /* Your background */
    --hero-bg-image: url('/your-background.webp');
}
```

### Step 3: Create site.txt

Define your site configuration:
- Brand name and logo markup
- Color palette (dark/light mode values)
- Google Fonts URL
- Navigation structure
- Page metadata (titles, descriptions)
- Contact information

### Step 4: Create ai.txt

Write all your site content in plain prose:
- Business description
- Services offered
- Pricing details
- Contact information
- Any other textual content

This becomes your single source of truth for content.

### Step 5: Update base.js SITE_CONFIG

Edit the config at the top of base.js:
```javascript
const SITE_CONFIG = {
    themeStorageKey: "yoursite-theme",  // Unique localStorage key
    particleCount: 20,
    scrollThreshold: 50
};
```

### Step 6: Generate HTML Pages

Using Claude Code or another AI:
1. Read base.txt for structure patterns
2. Read site.txt for configuration
3. Read ai.txt for content
4. Generate HTML pages combining all three

Each HTML page needs:
- Theme init script in `<head>` (copy from template)
- Links to base.css and site.css
- Script tag for base.js (and site.js if needed)

### Step 7: Update Inline Theme Key

The theme init script in each HTML `<head>` has a hardcoded localStorage key:
```javascript
const stored = localStorage.getItem("yoursite-theme");
```
This must match `SITE_CONFIG.themeStorageKey` in base.js.

### Step 8: Add Assets

- Favicon
- Hero background image
- Any other images referenced in site.css

## CSS Variables

All sizing, spacing, and colors use custom properties:

```css
/* Spacing */
--spacing-1: 1rem;
--spacing-2: 2rem;

/* Container widths */
--max-width-wide: 1200px;
--max-width-narrow: 800px;

/* Border radius */
--radius-sm: 12px;
--radius-md: 16px;

/* Typography */
--font-size-base: 0.95rem;
--line-height-normal: 1.7;

/* Transitions */
--transition-base: 0.3s ease;
```

## Key Patterns

### Theming
- Dark mode default (`html.dark` class)
- Theme persisted to localStorage
- CSS custom properties for all colors
- Respects `prefers-color-scheme` when no stored preference

### Styling
- Glass morphism via `backdrop-filter`
- Responsive breakpoints: 1024px, 900px, 768px, 600px
- No build step — vanilla HTML/CSS/JS

### Shared Components
- Navigation, footer, particles duplicated in each HTML file
- All pages link to `/base.css`, `/site.css`, and `/base.js`

## Development

```bash
# Local dev server
python -m http.server 8080
# or
npx serve -p 8080
```

## Deployment

Push to `main` branch triggers GitHub webhook to `https://renta.net/deploy.php` which runs `git pull`.

Server path: `mrn:/srv/renta.net/web/app/public`
