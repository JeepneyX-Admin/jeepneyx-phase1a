# JeepneyX Website - Phase 1A

Static corporate website for Jeepney X focused on digital credibility, business presentation, and inquiry capture.

## Phase Summary
- Phase: 1A (Static Corporate Expo Website)
- Hosting target: GitHub Pages
- Goal: Present company profile and capabilities with a premium, automotive-inspired design

## Locked Stack
- HTML
- Tailwind CSS (CDN)
- Light vanilla JavaScript for mobile navigation only
- Form handling via Formspree

## Current Pages
- `index.html` - Home
- `company.html` - About / Company Profile
- `contact.html` - Contact and Inquiry Form

## Key Brand Assets
- Hero/feature images:
	- `assets/images/jeepneyX-01.webp`
	- `assets/images/jeepneyX-02.webp`
- Logo:
	- `assets/images/JEEPNEYX-LOGO.webp`

## Contact Form Configuration
- Form action endpoint:
	- `https://formspree.io/f/xvzwknyr`

## Local Preview
From the project root, run one of the following:

```powershell
python -m http.server 8080
```

Then open:
- `http://localhost:8080/index.html`

## GitHub Pages Readiness Checklist
- [x] Static-only architecture (no backend runtime)
- [x] Home/About/Contact pages implemented
- [x] Full-screen homepage hero treatment
- [x] Formspree integration configured
- [x] Responsive navigation and layout
- [x] Approved content tone and scope boundaries respected

## Remaining Manual QA Before Release
- Verify responsive behavior on desktop/tablet/mobile
- Confirm all nav links and CTA links
- Perform at least 3 successful Formspree test submissions
- Replace placeholder social profile URLs when official links are available
- Confirm no placeholder copy remains
