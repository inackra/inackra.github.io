# Media gallery

The /work/ page mixes the existing product cases with 104 independent visual works: 86 original images and 18 original H.264 MP4s. There are no series or captions. Each visual work has a static /work/visual/<id>/ page, with recommendations restricted to its media type. The random seed persists in sessionStorage so filters and back navigation retain the same order.

## Cloudflare R2

1. Create a dedicated Standard-class bucket, for example `inackra-media`.
2. Extract `inackra-r2-images.zip` and `inackra-r2-videos.zip` locally. Upload their **contents directly to the bucket root**, preserving names. Do not upload the ZIP archives or an enclosing folder. Expected total: **122 objects** — 86 images, 18 MP4 originals, and 18 JPEG video posters.
3. In the bucket's Settings → Custom Domains, connect `media.inackra.work`. Wait for Active. This makes these portfolio assets publicly accessible. Keep unrelated private files out of this bucket.
4. Run `npm run check:media` after uploads finish. This verifies object sizes, content types, poster availability and one video range request using public URLs only.
5. Publish the website update to GitHub only after media verification succeeds.

The original files are byte-for-byte unchanged. Total original size: 1,112,351,434 bytes. Lightweight posters are auxiliary stills; they do not replace or re-encode the MP4 files. The website repository contains only the catalog and code, not the original gallery files. No R2 credentials are needed in frontend code or GitHub.

The production media origin defaults to `https://media.inackra.work`. `VITE_MEDIA_ORIGIN` can override it for local QA. Videos play muted and inline when visible, pause outside the viewport or when the tab is hidden, and expose sound and native controls on the individual page. If a browser blocks autoplay, the detail page offers a Play button. The site's motion pause and reduced-motion preference also pause autoplay.

For future additions, retain each original, record its type, dimensions and SHA-256 in `src/gallery/catalog.json`, and upload it with the same key used by the catalog. Static detail routes are generated from this catalog during the normal build.
