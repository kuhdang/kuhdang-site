# Car Showcase — Generation Log

Provenance record for every generated asset. Keeps the piece reproducible and
lets later shots reference earlier job IDs directly (Higgsfield accepts a prior
generation's job ID as a media input, so these IDs are working references, not
just bookkeeping).

---

## Locked assets

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

> ⚠️ **Frame mismatch.** Both `start_image` and `end_image` were
> `c038068e-32fb-4acf-9a70-5efdfcb6023e` — **Candidate 3**, not the locked hero
> frame `assets/hero-frame.png` (Candidate 4, `3ee06f36…`). Candidate 3 carries
> the invented yellow livery and side text. Acts 2 and 3 are meant to
> art-direct back to the locked frame's grade, so these two assets currently
> disagree about what the car looks like. Unresolved.

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
| **Job ID** | `3ee06f36-0712-4ec6-bc81-e507d4af8874` |
| **Model** | `nano_banana_pro` (served as `nano_banana_2`) |
| **Dimensions** | 1376 × 768 (16:9, 1k) |
| **Cost** | 8 credits (4 candidates × 2 credits each) |
| **Selected** | Candidate 4 of 4 |

**Why this frame won:** streetlight sits directly above the car (the loop beat
specified in the treatment); background is genuinely dissolved into soft bokeh
rather than competing detail; long vertical reflection smears on wet asphalt;
large clean negative space camera-left for Act 3 stat placement; cool blue-black
shadows with warm practicals as the only saturation.

**Known compromises:** not a pixel-accurate 992 GT3 RS — reads as "911-ish GT3
RS", which is a consistent limitation of current image models on exact model-year
fidelity. Carries a fabricated "GT3 RS" number plate.

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
