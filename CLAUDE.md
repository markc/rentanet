# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RentaNet is a static marketing website for an Australian web and email hosting company. The site promotes WordPress hosting, email services, domain registration, and Linux consulting services.

## Architecture

This is a vanilla HTML/CSS/JavaScript static site with no build system or framework:

- **index.html** - Homepage
- **rentanet.css** - All styles (CSS custom properties for theming, responsive design)
- **rentanet.js** - Theme toggle, particles animation, scroll effects, mobile menu
- **Subpages** - Each subdirectory (`/services/`, `/pricing/`, `/linux/`, `/settings/`) contains its own `index.html`
- **CONTEXT.txt** - AI-readable site summary (served as `text/plain` at `https://renta.net/CONTEXT.txt`)

## CONTEXT.txt

Machine-readable summary of site content for AI agents. Contains business info, services, pricing, contact details, and technical specs. Served as `text/plain` so remote AI clients can fetch full site context without parsing HTML.

## Key Patterns

### Theming
- Dark mode is default (`html.dark` class)
- Theme toggled via JavaScript, persisted to localStorage (`renta-theme` key)
- CSS uses custom properties (e.g., `--bg-primary`, `--accent`, `--text-primary`) for theme switching
- System preference (`prefers-color-scheme`) respected when no stored preference

### Shared Components
- Navigation, footer, and particle effects are duplicated in each HTML file (no templating)
- All pages link to the same `/rentanet.css` and `/rentanet.js`
- Background image: `Server_Room_Dark.webp` used for hero and section backgrounds

### CSS Architecture
- Glass morphism effects using `backdrop-filter` and semi-transparent backgrounds
- CSS animations for particles, gradients, hover effects
- Responsive breakpoints at 1024px, 768px, 900px, 600px
- Brand color: `#BF0000` (dark red) used consistently

## Deployment

Static files served directly - no build step required.

### Server Setup (mrn:/srv/renta.net/web/app/public)

1. Clone the repo on the server:
   ```bash
   cd /srv/renta.net/web/app
   git clone git@github.com:markc/rentanet.git public
   ```

2. Create `.env` with the webhook secret (must match GitHub webhook config):
   ```bash
   cd public
   cp .env.example .env
   nano .env  # set DEPLOY_SECRET to match webhook
   ```

3. GitHub webhook is pre-configured (push events to `https://renta.net/deploy.php`)

### Workflow

Push to main branch -> GitHub sends webhook -> `deploy.php` runs `git pull` -> site updated
