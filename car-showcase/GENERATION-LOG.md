# Car Showcase — Generation Log

Provenance record for every generated asset. Keeps the piece reproducible and
lets later shots reference earlier job IDs directly (Higgsfield accepts a prior
generation's job ID as a media input, so these IDs are working references, not
just bookkeeping).

---

## Locked assets

### `assets/act2-launch.mp4` — Act 2 launch and whip-around

Generated in this session using the free-trial **unlimited** allowance — cost 0
credits (balance verified unchanged at 2 before and after).

| | |
|---|---|
| **Job ID** | `8df3fca8-923d-4020-90e4-25b4791313df` |
| **Model** | `kling3_0`, `mode: pro`, `sound: on`, 8s, 16:9 |
| **start_image** | `c038068e…` — the locked hero frame |
| **Source** | 1924 × 1076, 24 fps, 23.6 Mb/s, 8.04 s, 23 MB |
| **Committed** | 1920 × 1080, CRF 23, silent, faststart — 6.6 MB |
| **Audio** | extracted to `assets/act2-launch-audio.m4a` (129 KB) |

**Beat coverage — all three Act 2 beats landed in a single take:**

| Time | Beat |
|---|---|
| 0–2s | car accelerates toward camera from the Act 1 framing |
| 2–3s | close pass at peak speed, heavy motion blur, background streaking |
| 3–4s | camera whips around to rear three-quarter |
| 4–8s | settles on wing and taillight signature, car driving away, still moving |

**Continuity with Act 1:** frame 0 measures SSIM 0.964 against `hero-frame.png`,
so the loop-to-launch handoff needs no blending — the launch effectively begins
inside Act 1's world. Same livery, grade, neon palette and rain throughout.

Because the piece is all video rather than video-into-3D, the treatment's
planned motion-blur handoff at the close pass is no longer a seam to hide — it
is one continuous take.

**Known compromises:**

- A driver is briefly visible through the side window during the close pass
  (~t=3s). Heavily motion-blurred, so low risk, but present.
- Number plate reads as garbled text from ~t=5s onward in the rear framing.
- The Candidate 3 livery is at its most prominent here — the "GT3 RS" side text
  fills frame during the close pass.

**Act 3 input:** the final frame is the natural `start_image` for Act 3, so the
camera continues from where Act 2 settles. Not committed, since it is
re-extractable:
>
> `ffmpeg -sseof -0.05 -i act2-launch.mp4 -update 1 -q:v 2 act2-final-frame.png`

---

### `assets/hero-loop.mp4` — Act 1 hero loop

Supplied by the user, who generated it **outside this session** and provided it
directly. It was not produced by this session's MCP calls.

To be accurate about provenance — which is the whole point of this file — it is
still an AI generation. The job record shows Higgsfield `kling3_0` (pro, sound
on) run against the Act 1 motion prompt drafted for Phase 2. It is a
user-supplied asset, not a non-AI one.

| | |
|---|---|
| **Job ID** | `c95c74b6-1feb-46e1-9a55-26c960c8c56c` |
| **Model** | `kling3_0`, `mode: pro`, `sound: on` |
| **Source** | 1924 × 1076, 24 fps, 20.6 Mb/s, 8.04 s, 20.8 MB |
| **Committed** | 1920 × 1080, CRF 23, silent, faststart — 4.4 MB |
| **Audio** | extracted to `assets/hero-loop-audio.m4a` (129 KB) |

Both `start_image` and `end_image` were
`c038068e-32fb-4acf-9a70-5efdfcb6023e` — Candidate 3. The hero frame was
re-locked to match (see below), so the loop and the colour bible now agree.

**Loop quality (measured, not eyeballed):** the final frame is the closest match
to frame 0 — SSIM 0.809, falling monotonically backward through the tail
(0.758 at t=7.96, 0.726 at t=7.92, 0.634 at t=7.71). The model converged back
toward its start composition as instructed, so **the existing end is already the
optimal loop point and trimming would make the seam worse.** Residual mismatch is
mostly per-frame rain and grain randomness plus slight camera drift.

The video is stored silent by design. The audio bed runs as a separate
continuous Web Audio layer so it survives Act 3's scroll-scrubbing — see the
audio constraint note at the end of this file.

The 20.8 MB source is intentionally not committed; it is recoverable from the
job ID above.

---

### `assets/hero-frame.png` — Act 1 loop point

The visual bible. This frame is the `start_image` **and** `end_image` for the
Act 1 loop, which is what makes the loop seamless rather than crossfaded. Every
later shot art-directs back to this frame's light temperature and grade.

| | |
|---|---|
| **Job ID** | `c038068e-32fb-4acf-9a70-5efdfcb6023e` |
| **Model** | `nano_banana_pro` (served as `nano_banana_2`) |
| **Dimensions** | 1376 × 768 (16:9, 1k) |
| **Cost** | 8 credits (4 candidates × 2 credits each) |
| **Selected** | Candidate 3 of 4 |

**Why this frame:** chosen to match `assets/hero-loop.mp4`, which was generated
from it as both `start_image` and `end_image`. Candidate 4 was the original pick
on compositional merit, but the loop had already been built from Candidate 3, and
keeping the delivered loop was preferred over regenerating. Consistency with the
locked motion asset decided this, not the frame's own merits.

**Known compromises, carried knowingly:**

- **Invented yellow livery and side text.** Not a clean hero object. This was
  flagged before selection as a risk to **Act 3**, where six stat captions have
  to sit in negative space without competing — the livery graphics add visual
  noise in exactly that register. Choosing this frame accepts that risk rather
  than removing it, so **Act 3 stat placement must be designed around the
  livery**, favouring the emptier camera-right road area over anything crossing
  the car's flank.
- Not a pixel-accurate 992 GT3 RS — reads as "911-ish GT3 RS", a consistent
  limitation of current image models on exact model-year fidelity.
- Background is busier than Candidate 4's (skyline detail, twin neon signs), so
  it dissolves less cleanly into bokeh. Depth of field in later shots should
  compensate.

> **Poster note:** for the `<video poster>` attribute, prefer frame 0 of
> `hero-loop.mp4` over this still. They are compositionally the same shot, but
> the encoded first frame matches the video exactly and avoids a visible pop on
> playback start.

**Prompt:**

> Cinematic film still. Porsche 911 GT3 RS driving on a wet city street at night,
> front three-quarter view, camera low at bumper height, tracking alongside the
> car. Rain-slicked black asphalt reflecting streetlights and neon signage in long
> vertical smears. Light drizzle, fine rain streaks visible against dark negative
> space. Headlights cutting two clean cones of light through mist. The car passes
> directly beneath a sodium streetlight, centered in frame, empty stretch of road
> ahead and behind. Desaturated cool blue-black shadows, warm sodium and neon
> practicals as the only saturation in frame. Shallow depth of field, city
> background dissolved into soft blurred bokeh light shapes, never competing with
> the car for sharpness. Fine even film grain, rain droplets and streak trails on
> the lens. Moody high-contrast nighttime cinematography, Blade Runner 2049
> wet-city palette. Photoreal, shot on 35mm anamorphic.

---

## Reference — model costs (preflighted, not estimated)

| Model | Config | Credits |
|---|---|---|
| `kling3_0` | 8s, 1080p, pro, sound **off** | 14 |
| `kling3_0` | 8s, 1080p, pro, sound **on** | 20 |
| `cinematic_studio_3_0` | 8s, 1080p | 80 |
| `cinematic_studio_3_0` | per second | 10 |
| `nano_banana_pro` | still, 1k | 2 **per image** |

> **Preflight caveat:** `get_cost: true` under-reports batches. A `count: 4`
> image request preflighted at 2 credits but billed 8 (2 per image). Treat
> preflight as a *per-unit* price and multiply by `count` yourself.

`kling3_0` is the workhorse: ~5.7× cheaper than Cinema Studio for equivalent
duration, and it accepts both `start_image` and `end_image` — required for the
Act 1 loop.

## Reference — audio constraint

Higgsfield's `generate_audio` is **text-to-speech only**; it cannot produce
music or sound effects. The only audio path is baking it into video via
`sound: "on"`.

Because Act 3 is scroll-scrubbed (scrubbing garbles baked audio), the plan is:
generate Act 1 with sound on, extract its rain + idle-engine bed, and run that
as one continuous Web Audio layer across the whole piece, muted by default.
Act 3 clips generate silent. This also means the audio never cuts — matching
the treatment's throughline.
