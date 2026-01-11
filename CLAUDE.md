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
├── rentanet.js             # Theme toggle, particles, scroll effects, mobile menu
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

## AI-Assisted Site Generation

This site uses a three-file strategy enabling AI agents to understand and rebuild the site:

### ai.txt — Content

Plain text prose containing ALL textual content from the site. No layout hints, no HTML — just the words. Serves dual purpose:

1. **AI Discovery**: Any AI agent can fetch `/ai.txt` to instantly understand what the business offers, pricing, services, and contact details without parsing HTML.
2. **Content Source**: When regenerating pages, AI reads ai.txt for the actual text content.

This could become a web standard — like `robots.txt` but for AI agents to understand site content.

### base.txt — Structure

Generic specification describing the HTML/CSS framework patterns:

- Section types (hero, page-hero, content-section, bg-image-section)
- Navigation and footer structure
- Card layouts and grid patterns
- Utility classes and responsive behavior
- JavaScript features

Reusable across any site built on this framework.

### site.txt — Configuration

Site-specific customization values:

- Brand name and logo markup
- Color palette (dark/light mode values)
- Typography (fonts, Google Fonts URL)
- Navigation links and page configurations
- JavaScript config (theme storage key, particle count)
- Asset paths

### Regenerating Pages

To rebuild or create new pages:
1. Read `base.txt` for structure patterns
2. Read `site.txt` for theming/config
3. Read `ai.txt` for content
4. Generate HTML combining all three

## CSS Architecture

Styles are split into two files:

### base.css — Generic Framework (~1300 lines)

Reusable across sites. Contains:
- CSS custom property definitions with defaults
- Layout patterns (grids, containers, spacing)
- Component styles (cards, buttons, navigation, footer)
- Responsive breakpoints and media queries
- Animations and transitions

### site.css — Site Theme (~215 lines)

RentaNet-specific. Contains:
- Color palette overrides (`--accent: #DF0000`)
- Font definitions (Inter, Quicksand)
- Background image URL
- Brand-specific component tweaks

### CSS Variables

All sizing, spacing, and colors use custom properties defined in `:root`:

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

## JavaScript Configuration

`rentanet.js` uses a config object for site-specific values:

```javascript
const SITE_CONFIG = {
    themeStorageKey: "renta-theme",
    particleCount: 20,
    scrollThreshold: 50
};
```

## Key Patterns

### Theming
- Dark mode default (`html.dark` class)
- Theme persisted to localStorage
- CSS custom properties for all colors
- Respects `prefers-color-scheme` when no stored preference

### Styling
- Glass morphism via `backdrop-filter`
- Brand color: `#DF0000` dark / `#BF0000` light
- Responsive breakpoints: 1024px, 900px, 768px, 600px
- No build step — vanilla HTML/CSS/JS

### Shared Components
- Navigation, footer, particles duplicated in each HTML file
- All pages link to `/base.css`, `/site.css`, and `/rentanet.js`

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
