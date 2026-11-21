# INACKRA — positioning and search

## Positioning

Multidisciplinary Designer. Digital products and visual systems, connecting design, AI and development. Eight years of design experience. Current AI-assisted workflow is described separately from historical client projects. Plenum remains an independent product in development; its experimental measurements retain their original limitations.

Home: selected product case studies, a nearby entry to the mixed visual gallery, then separate project and team enquiries. Existing graphic and motion works remain uncaptioned.

## Static routes

Russian uses `/`; English uses `/en/`. Each language has its own canonical URLs, reciprocal hreflang links and real internal anchors. Language is determined by the URL; storage does not redirect crawlers or visitors.

AIO and Plenum task tabs have individual static pages. Client-side tab changes update history, canonical, title, description and structured data. Back/forward navigation and legacy task hashes remain supported. Archive filters have static `/work/cases/`, `/work/images/` and `/work/video/` URLs; old query filters still work.

The build waits for lazy case content, then produces complete React HTML with resolved Suspense boundaries. React hydrates the existing page; the logo loader is an independent overlay. Text and gallery layouts remain readable without JavaScript. Original media stay on R2, images use native lazy loading, and offscreen videos pause.

## Search metadata

Each route includes a title, description, canonical, language alternates, Open Graph/Twitter metadata and JSON-LD. The structured data describes the author, website, pages, case studies and breadcrumbs using facts visible in the portfolio. No ratings or unverified client outcomes are added.

`/sitemap.xml` lists 54 indexable URLs. The 208 uncaptioned media detail pages and two Evapolar placeholders use `noindex,follow`; they are accessible but do not compete with substantive case studies. `/robots.txt` permits crawling and advertises the sitemap. Unknown URLs receive GitHub Pages' `404.html`, not a homepage with a success status.

GEO uses the same readable content and clear authorship as SEO. No special AI keyword blocks, invisible content or guarantees of citations are used.

## Verification and remaining deployment work

Run `npm ci`, `npm run build`, then `npm test`. Search checks verify all 264 static pages, language pairs, canonical URLs, linked routes, interface assets and task-specific narratives. A separate DOM hydration check also exercised representative RU/EN pages, loader completion, task/filter navigation and history restoration without recoverable hydration errors. This does not replace browser layout testing. Existing tests cover motion, card warp, scroll controls, form validation, media catalogue and case evidence.

After deployment, submit `https://inackra.work/sitemap.xml` in the owner's Google Search Console and inspect the root, English root and selected task pages. Indexing and appearance in AI answers remain decisions of the respective services. Check the owner's Cloudflare settings separately if crawlers receive challenges; source code alone cannot verify account-side bot restrictions.

Official references:
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/appearance/ai-features

Visual QA on the user's connected browser is still pending. The cloud preview was not inspected because automatic approval review rejected that access under the user's local-browser privacy preference.
