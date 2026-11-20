# INACKRA portfolio

React + Vite. Node.js 22. Run `npm ci`, `npm run dev` or `npm run build`.

Publish this source to the public repository inackra/inackra.github.io (main branch). In Settings → Pages select GitHub Actions. Run the Deploy Pages workflow. Set the custom domain to inackra.work in Pages settings BEFORE changing DNS; public/CNAME alone does not configure it for Actions.

Cloudflare DNS records, DNS only (gray cloud):

| Type | Name | Target |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | inackra.github.io |

Read existing records first. Replace only conflicting website records. Keep email MX/TXT records. Use the exact GitHub-generated TXT token for domain verification if needed. After domain validation and certificate issuance enable Enforce HTTPS in Pages settings.

Every push to main deploys automatically. Artwork and CV belong to their respective owners. Included fonts retain their license.

## Updated interaction and archive

Selected projects use a native horizontal carousel with swipe, keyboard navigation and arrows. The complete current catalogue is served at `/work/`, including direct visits on GitHub Pages. Tags are maintained in `src/archive.js`; case content stays in `src/caseStudies.js` and `src/content.js`.

Desktop wheel scrolling uses Lenis. Touch scrolling stays native. The custom rail uses immediate scroll and freezes its geometry during a gesture to prevent mobile viewport changes from moving its target. The preloader counts completed resource tasks (code, font, logo, covers). Reduced motion remains supported.

`npm run build` prepares both routes; `npm test` runs the platform-stub and numerical regression checks after a build. These checks do not replace browser/device visual QA. The new local displacement effect needs comparison against the reference in a live browser before being described as an exact visual match.

Google Sheets setup and account authorization: see `docs/ENQUIRIES.md`. Without a configured receiver the form retains an email fallback. Live delivery must be verified against an actual sheet after deployment.

## Case pages

Project cards link to `/work/<id>/` rather than opening a project dialog. Static entry pages are emitted by `scripts/build-pages.mjs`, so direct links work on GitHub Pages. Image enlargement in AIO remains a separate image viewer.

AIO contains 11 workflows in Russian and English. Narrative, screen captions and prototype controls live in `src/aio/`; screenshot files retain their original content. No import audit reports or original upload archives are shipped. The bottom task selector is followed by a separate previous/next project area with cover images. `npm test` includes route, language and media checks.

Original AIO PNGs are stored in `assets/aio-media.tar.gz` (under GitHub’s per-file upload limit). The build extracts them into ignored `public/assets/aio-*` folders before Vite copies them to the deploy output. No image compression or repainting occurs. Build on Node.js 22 with `tar` available (as in the existing Ubuntu Pages workflow). AIO code and media load only when needed by its case page.
