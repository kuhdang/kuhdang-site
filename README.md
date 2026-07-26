# kuhdang.com — deploy & workflow notes

Live site: https://kuhdang.com
Netlify project: https://app.netlify.com/projects/kuhdang-site
GitHub repo: https://github.com/kuhdang/kuhdang-site

## How this is wired up

- `index.html` is the entire site (single self-contained file — no build step).
- This folder is a git repo, pushed to GitHub (`kuhdang/kuhdang-site`).
- Netlify is connected to that GitHub repo. Every push to the `master` branch
  automatically triggers a new deploy — no manual deploy command needed.
- The domain `kuhdang.com` (and `www.kuhdang.com`, which redirects to it) points
  at Netlify via DNS records at Porkbun. HTTPS is handled automatically by Netlify.

## Making a change (the normal workflow)

**Never edit the live site directly.** Always go through this folder:

1. Ask Claude Code (or edit `index.html` yourself) to make the change locally.
2. **Preview it** before publishing — just double-click `index.html` to open it
   in your browser, or ask Claude to open it for you. Nothing is live yet at
   this point.
3. Once you're happy with it, commit and push:
   ```
   git add index.html
   git commit -m "describe the change"
   git push
   ```
4. Netlify picks up the push automatically and republishes the site — usually
   live within 30–60 seconds. Check https://app.netlify.com/projects/kuhdang-site/deploys
   to watch it happen or confirm it succeeded.

If you're working with Claude Code in a future session, just say what you want
changed — it can edit the file, show you a preview, and run the `git` commands
for you.

## Rolling back if something breaks

Netlify keeps every past deploy. To instantly revert to an older version:

1. Go to https://app.netlify.com/projects/kuhdang-site/deploys
2. Find the last known-good deploy in the list.
3. Click it, then click **"Publish deploy"**.

That's it — the live site reverts immediately, with no git commands needed.
(Your git history is unaffected either way, so you can also just fix the file
and push a new commit if you'd rather move forward than roll back.)

## Note on Git contributor verification

Netlify's free plan blocks auto-deploys from git pushes it doesn't recognize
as coming from a verified account ("Unrecognized Git contributor" error). If
this ever reappears (e.g. after re-authenticating GitHub), fix it at:
Netlify team settings → Members → Git Contributors → Edit settings → Connect
GitHub. This links your GitHub account to your Netlify account so future
pushes are trusted automatically.

## Contact form

The "Get in touch" form posts directly to a Google Apps Script endpoint, which
appends each submission as a row in a Google Sheet (Timestamp | Name | Message).
This only works on the real hosted domain — it cannot be tested from a sandboxed
preview. Verified working live on 2026-07-26.
