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
