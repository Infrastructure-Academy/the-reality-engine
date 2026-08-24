# SEO and Analytics Audit — 25 August 2026

## Finding

The supplied Reddit screenshots indicate a discoverability gap: Reddit search does not surface authoritative discussion connecting iAAi, Infrastructure Academy, and Civilisational Systems Engineering (CSE). The acronym CSE is instead dominated by unrelated meanings, including Computer Science Engineering and California Supplemental Exam.

This is distinct from the public Academy content. The live Academy homepage explicitly states that Civilisational Systems Engineering (CSE) answers questions about how civilisation remembers and how infrastructure survives, and that the Infrastructure Academy of Artificial Intelligence (iAAi) publishes the research openly. The live Framework page describes the analytical framework and the live Glossary page defines its core terms and relays.

## Measured analytics access

The Academy source contains a Google Analytics 4 tag with measurement ID `G-2V0JTTfM97` in both `docs/site.html` and `docs/index.html`. The Analytics dashboard requires Google authentication. Google blocked the attempted sign-in because the device/location was unrecognized and there was insufficient verification information. No Google Analytics traffic figures were therefore retrieved or inferred.

The Academy also contains a custom analytics dashboard and client calls to `/api/trpc/analytics.*`. On the deployed GitHub Pages site, the endpoint `/api/trpc/analytics.topPages` returned HTTP 404 because GitHub Pages is static. The public analytics dashboard page loads but cannot retrieve the backend data. This means the custom dashboard is not currently a usable public measurement source on the deployed Academy host.

The TRE project includes a Umami script reference using `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID`; this confirms instrumentation is configured for TRE, but no dashboard result was exposed by the current inspection.

## Crawler signals

The live `robots.txt` returns HTTP 200, allows crawling, and includes `Sitemap: https://infra-acad-kuqzaex2.manus.space/sitemap.xml`. The live `sitemap.xml` returns HTTP 200 and contains 111 URLs, but all 111 use the `infra-acad-kuqzaex2.manus.space` host rather than `www.infrastructure-academy.com`. This is the clearest concrete crawler repair candidate because the public canonical host and the submitted sitemap host are inconsistent.

The Academy source metadata already includes a long description and keyword set containing the full terms `Infrastructure Academy of Artificial Intelligence`, `iAAi`, and `Civilisational Systems Engineering`, plus `CSE`. The source also contains a canonical link, `robots` content of `index, follow`, Open Graph metadata, Twitter metadata, and one JSON-LD block. The live public pages visibly contain the full terms and definitions.

## Recommended next changes — approval required

1. Regenerate `sitemap.xml` so every `<loc>` uses the canonical `https://www.infrastructure-academy.com/` host, then update the `Sitemap:` line in `robots.txt` to that canonical sitemap URL.
2. Ensure the canonical URL is present and correct on the homepage and principal iAAi/CSE pages, with consistent trailing-slash policy.
3. Add explicit JSON-LD `Organization` and `WebSite` data to the homepage, naming the organization as Infrastructure Academy of Artificial Intelligence (iAAi) and describing Civilisational Systems Engineering (CSE) without ambiguity.
4. Add a dedicated, crawlable short definition block for iAAi and CSE near the top of the homepage and Framework page, using the exact full names and a stable internal link between them.
5. Keep the existing GA4 tag, but restore authenticated access through a recognized device/location before reporting GA results. Separately, either connect the custom analytics dashboard to a deployed backend or label it clearly as unavailable on the static GitHub Pages host.
6. After publication, submit the canonical sitemap and key URLs in Google Search Console and re-check rendered HTML, robots, sitemap hosts, and structured data.

## References

[1] [Google Search Central: What is URL Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)

[2] [Google Search Central: Organization Structured Data](https://developers.google.com/search/docs/appearance/structured-data/organization)

[3] [Google Analytics Help: Overview of Google Analytics Reports](https://support.google.com/analytics/answer/9212670)

[4] Live Academy homepage: https://www.infrastructure-academy.com/

[5] Live Academy Framework page: https://infrastructure-academy.com/pages/framework.html

[6] Live Academy Glossary page: https://infrastructure-academy.com/pages/glossary.html


## Exact live checks

On 25 August 2026, `https://www.infrastructure-academy.com/robots.txt` returned HTTP 200 with `Allow: /` and a sitemap declaration pointing to `https://infra-acad-kuqzaex2.manus.space/sitemap.xml`. The live `https://www.infrastructure-academy.com/sitemap.xml` returned HTTP 200 with 111 `<loc>` entries; 0 use `www.infrastructure-academy.com` and 111 use the Manus host. This confirms a host-consistency defect in the deployed crawler signals.

The local Academy source contains GA4 measurement ID `G-2V0JTTfM97`, `robots=index, follow`, a long description, a keyword set, Open Graph/Twitter tags, a canonical tag, and one JSON-LD block. The live homepage and Framework/Glossary pages visibly contain full iAAi and CSE explanations, so the Reddit result is not evidence of missing site copy.

Google’s public guidance says canonicalization selects the representative URL for duplicate content and that Organization structured data can help Google understand and disambiguate an organization. These support correcting sitemap-host consistency and strengthening explicit organization/framework structured data, but they do not guarantee ranking or Reddit coverage.
