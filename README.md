# kuhdang.com — deploy & workflow notes

Live site: https://kuhdang.com
GitHub Pages settings: https://github.com/kuhdang/kuhdang-site/settings/pages
GitHub repo: https://github.com/kuhdang/kuhdang-site

Previously hosted on Netlify — migrated to GitHub Pages on 2026-07-26. The old
Netlify project (kuhdang-site) is still sitting there, just disconnected from
the domain; safe to delete once you're comfortable everything's working.

## How this is wired up

- `index.html` is the entire site (single self-contained file — no build step).
- This folder is a git repo, pushed to GitHub (`kuhdang/kuhdang-site`).
- GitHub Pages is enabled on this repo, deploying from the `master` branch
  root. Every push to `master` automatically triggers a new Pages build —
  no manual deploy command needed.
- A `CNAME` file in the repo root (containing `kuhdang.com`) tells GitHub
  Pages which custom domain to serve. A `.nojekyll` file tells it to serve
  the files as-is, skipping GitHub's default Jekyll processing.
- The domain `kuhdang.com` (and `www.kuhdang.com`, which redirects to it)
  points at GitHub Pages via DNS records at Porkbun: four `A` records on the
  root pointing to GitHub's Pages IPs, and a `CNAME` on `www` pointing to
  `kuhdang.github.io`. HTTPS is handled automatically by GitHub (Let's
  Encrypt), with "Enforce HTTPS" turned on.

## Making a change (the normal workflow)

**Never edit the live site directly.** Always go through this folder:

1. Ask Claude Code (or edit `index.html` yourself) to make the change locally.
2. **Preview it** before publishing — just double-click `index.html` to open
   it in your browser, or ask Claude to open it for you. Nothing is live yet
   at this point. This *is* the "preview before it goes live" step — GitHub
   Pages doesn't have an automatic per-branch/per-PR preview URL like Netlify
   did, so local preview is the equivalent safeguard here, and it costs
   nothing to do before every push.
3. Once you're happy with it, commit and push:
   ```
   git add index.html
   git commit -m "describe the change"
   git push
   ```
4. GitHub Pages picks up the push automatically and republishes the site —
   usually live within a minute or two. Check
   https://github.com/kuhdang/kuhdang-site/actions or the Pages settings page
   above to watch the build or confirm it succeeded.

If you're working with Claude Code in a future session, just say what you
want changed — it can edit the file, show you a preview, and run the `git`
commands for you.

## Rolling back if something breaks

GitHub Pages doesn't have Netlify's one-click "restore an old deploy" button —
instead, rollback is a normal git operation:

1. Find the last good commit: `git log --oneline`
2. Revert the bad commit(s) and push:
   ```
   git revert <bad-commit-hash>
   git push
   ```
   This creates a new commit that undoes the change (keeps history intact,
   nothing destructive) and GitHub Pages redeploys automatically.
3. Alternatively, just ask Claude Code to fix the file and push a new commit,
   same as any other change — often faster than a formal revert.

## Contact form

The "Get in touch" form posts directly to a Google Apps Script endpoint, which
appends each submission as a row in a Google Sheet (Timestamp | Name | Message).
This is an external service, unaffected by which host serves the site — it
cannot be tested from a sandboxed preview, only on the real hosted domain.
Verified working on Netlify on 2026-07-26, and re-verified working on GitHub
Pages after the migration, same day.
