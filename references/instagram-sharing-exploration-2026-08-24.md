# Instagram Sharing Exploration — 24 August 2026

## Verified account state

The enabled Instagram connector is authorized for **@nigel.dearden** (Nigel Dearden). A read-only account check returned 108 followers, 130 following, 1 post, and a publishing-limit window of 0/100 used with 100 remaining. No content was created or published.

A read-only post-list check returned one existing image post: Instagram post ID `18023766118040526`, public URL `https://www.instagram.com/p/BsuHC4Fge10/`, 5 likes, 0 comments, posted 17 January 2019 UTC. The connector returned a pagination cursor, indicating more history may be available.

## Verified connector capabilities

The enabled connector exposes four operations: read account information, read the post list, read insights for a specified post, and create one Instagram post/story/reel. The create operation requires public media URLs and supports image or video media. Reels accept one video up to 300 MB and 15 minutes; Stories accept up to 10 media items with videos up to 100 MB and 60 seconds; ordinary posts support 1–10 items. A reel may also be shared to the feed. The create operation presents a confirmation card before publishing. It does not natively schedule content.

## Link strategy

The official Instagram Help Center states that an organic Instagram Story can include a link sticker, and tapping it redirects viewers to the linked website. Recommended destination for the iAAi campaign: `https://www.infrastructure-academy.com/`. For a reel or feed post, use a clear call to action such as “Visit the link in bio” unless the Instagram account surface provides a currently available clickable-link feature; do not assume a caption URL is clickable.

## Approval boundary

No Instagram post, story, reel, edit, deletion, or schedule has been performed. Any future publication must be proposed with the exact video URL, caption, cover/thumbnail choice, destination URL, and content type, then explicitly approved by Nigel before creation/publishing.

## Sources

1. Instagram connector runtime tool list and read-only responses from the 24 August 2026 session.
2. [Instagram Help Center — About link sticker on Instagram Stories](https://help.instagram.com/192168966243613/), accessed 24 August 2026.


## Public video verification — 25 August 2026

The following preserved CDN-hosted videos were checked read-only and each returned HTTP 200. Their CDN `Content-Type` is `application/octet-stream`, so Instagram should ingest them by their `.mp4` extension and the exact URL should be retained in the publication proposal.

| Candidate | Format / use | Verified CDN URL |
|---|---|---|
| iAAi Teaser | 30-second teaser | https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/IAAI_Teaser_30s_ad87eb51.mp4 |
| WhatsApp / Stories | 9:16 vertical | https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/IAAI_WhatsApp_Stories_9x16_8c7aca76.mp4 |
| iAAi Twitter Teaser | 16:9 | https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/IAAI_Twitter_Teaser_16x9_9cddb68c.mp4 |
| iAAi LinkedIn Professional | 16:9 | https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/IAAI_LinkedIn_Professional_16x9_fd21eefc.mp4 |
| iGO trailer | 16:9 | https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/iGO_trailer_v7_6a22857c.mp4 |
| iGO Architecture Movie | 16:9 | https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/iGO_Movie_SHARE_WITH_TEAM_16x9_7c72b3fe.mp4 |
| Reality Engine Trailer | 16:9 | https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/reality-engine-trailer_7e837497.mp4 |
| Investor Companion | 16:9 | https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/kUQZAex2uPvgKcHnt7bmh3/final_investor_companion_5aa32eb1.mp4 |

No Instagram content was created, edited, scheduled, or published. The canonical campaign destination remains https://www.infrastructure-academy.com/; for Reels/feed posts, use “link in bio” unless a currently available native link surface is explicitly confirmed; for Stories, use a link sticker.
