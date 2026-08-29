# Venkat Portfolio

Ultra-modern portfolio website for Venkat - Lead AI & Full-Stack Solutions Architect.

![Preview](https://via.placeholder.com/1200x630/0f111a/8b5cf6?text=Venkat+Portfolio)

## Quick Start (Local Development)

```powershell
# 1. Install Python (if not already installed)
# 2. Run the local server:
python -m http.server 3000

# 3. Open your browser:
#    http://localhost:3000
```

## Or Use the Provided Batch File

```batch
launch.bat
```

This will open `http://localhost:3000` and start the Python HTTP server.

## Project Structure

```
profile_venkat/
├── index.html          # Main HTML entry point
├── style.css           # Ultra-modern luxury design system
├── script.js           # Interactive JS engine (803 lines)
├── launch.bat          # Local server launcher
├── _redirects          # Netlify/Render SPA fallback
├── netlify.toml        # Netlify deployment config
└── render.yaml         # Render.com static service config
└── components/         # 8 HTML partials (header, hero, about, etc.)
└── assets/images/      # Profile avatar
```

## Features

- Particle & constellation canvas background
- Mouse cursor ambient glow
- Typewriter text effect
- 3D card tilt on mouse hover
- Theme accent color switcher (violet/cyan/emerald/amber/rose)
- Interactive CLI terminal with command execution
- Project filtering & modal details
- Testimonials carousel
- Metric counters with Intersection Observer
- Contact form with spam protection
- Live timezone clock
- Mobile navigation toggle
- Toast notification engine

## Deployment Platforms

### Netlify
1. Connect your Git repository
2. Deploy the `root` directory
3. The `netlify.toml` + `_redirects` handle client-side routing automatically

### Render.com
1. New Static Service
2. Set `Root Directory: .` (current folder)
3. Use `render.yaml` for pre-configured settings

### Vercel
1. Import GitHub repository
2. Auto-detects static HTML
3. No config needed (CDN handles everything)

### GitHub Pages
1. Add to repo
2. Configure GitHub Actions or Settings > Pages
3. Set source branch and folder (usually `/` or `/dist`)

## Build Notes

- **No build step required** - pure static HTML/CSS/JS
- All external dependencies load from CDNs (Google Fonts, FontAwesome)
- Component loader fetches HTML partials from `components/` directory
- Ensure full project folder is deployed (not just `/dist`)
- Works on any static site host

## Customization

- Change default theme: modify `data-theme="violet"` in `<html>` tag
- Update accent colors: CSS variables in `style.css` `:root` block
- Modify component content: edit files in `components/` directory
- Replace avatar: update `assets/images/avatar.jpg`