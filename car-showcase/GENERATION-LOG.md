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

> ⚠️ **OUT OF DATE — must be regenerated.** This take was built from
> **Candidate 3**, but Act 1 has since been re-locked to **Candidate 4**. The two
> acts now show different cars: Act 2's carries the yellow livery and "GT3 RS"
> side text, Act 1's does not. The handoff will read as a hard cut on the car
> itself. Regenerate from `3ee06f36…` before any build work depends on it.

**Continuity with Act 1:** frame 0 measured SSIM 0.964 against the *Candidate 3*
hero frame, so the handoff was seamless under the old pairing. That figure no
longer applies now that Act 1 comes from Candidate 4.

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

Generated in this session on the free-trial **unlimited** allowance — 0 credits.
Selected after eight iterations from the Candidate 4 hero frame.

| | |
|---|---|
| **Job ID** | `64ad98d0-819a-4d0b-a841-9bd77b12bc26` (attempt 6) |
| **Model** | `kling3_0`, `mode: pro`, `sound: on`, 8s, 16:9 |
| **start/end image** | `3ee06f36…` — Candidate 4, both roles, for a native loop |
| **Source** | 1920 × 1080, 24 fps, 8.04 s, 23 MB |
| **Committed** | CRF 23, silent, faststart — 6.2 MB |
| **Audio** | extracted to `assets/hero-loop-audio.m4a` (129 KB) |
| **Loop seam** | SSIM 0.771 (last frame vs frame 0) |
| **Drift profile** | 0.30–0.38 — flat, confirming the camera holds position |

**Why attempt 6 won.** The iteration converged on six requirements: camera locked
relative to the car, real sense of speed, minimum distance held, constant rain,
roller-rig shake, and blur. Attempt 6 is the take that satisfies them together
without introducing a new artifact.

| Attempt | Outcome |
|---|---|
| 1 | Camera orbited into the flank — rejected |
| 2 | Over-corrected: entire scene frozen, car appeared parked |
| 3 | Speed restored, framing locked, but camera too smooth |
| 4 | Shake introduced, still moderate |
| 5 | Strongest shake, but rain cut out away from streetlights and car colour drifted |
| **6** | **Selected** — rain more consistent, shake held, framing and distance stable |
| 7 | Best rain and colour of all, 21% softer, but the car oscillated forward and backward — rejected |
| 8 | Abandoned once attempt 6 was chosen |

**Two realism principles drove the prompts**, both of which also mask generative
artifacts: the camera never closes distance on the car, because fine detail is
where the model's weakness shows; and rain is kept heavy across frame, because it
occludes clean surfaces and breaks up edges.

**Known compromises:**

- **The "GT3 RS" number plate stays legible.** It is baked into Candidate 4, so
  the model preserves it regardless of prompt. Not fixable by prompting — it
  needs a different hero still or a masking pass.
- **The car reads dry rather than soaked**, most visibly in stretches away from
  streetlights. Three separate prompts failed to change this; the model treats
  the start image's clean bodywork as the object's identity.
- Rain is denser near light sources than in shadow. Physically defensible, but
  the treatment asks for streaks against dark negative space too — the planned
  canvas rain overlay is what closes this gap, at constant density across all
  three acts.

**A note on review method:** attempt 7 was initially assessed as the strongest
take on measurements alone. It was rejected on playback because the car
oscillates forward and backward — an artifact invisible to both a 1 fps
filmstrip and an SSIM drift profile, which cannot distinguish reduced motion
from oscillating motion. Takes must be watched, not only measured.

The video is stored silent by design. The audio bed runs as a separate
continuous Web Audio layer so it survives Act 3's scroll-scrubbing — see the
audio constraint note at the end of this file.

The 23 MB source is intentionally not committed; it is recoverable from the
job ID above.

**Superseded:** an earlier Act 1 loop (`c95c74b6-1feb-46e1-9a55-26c960c8c56c`),
supplied by the user and built from Candidate 3, was committed first and has been
replaced by attempt 6. It remains recoverable from that job ID.

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

**Why this frame:** the original pick on compositional merit, and restored after
the Candidate 3 route was abandoned. The streetlight sits directly above the car
— the loop beat the treatment specifies — the background dissolves genuinely into
soft bokeh rather than competing detail, the wet asphalt carries long vertical
reflection smears, and there is large clean negative space camera-left for Act 3
stat placement. No livery, so nothing competes with the stat captions.

**Known compromises, carried knowingly:**

- **Fabricated "GT3 RS" number plate**, legible in the still and preserved
  through every generated take. Not removable by prompting; it needs either a
  different hero still or a masking pass in post.
- **The car reads clean and dry** rather than rain-soaked. The model treats this
  as the object's identity and carries it into motion, which is why three
  separate "soaked bodywork" prompts failed to change it.
- Not a pixel-accurate 992 GT3 RS — reads as "911-ish GT3 RS", a consistent
  limitation of current image models on exact model-year fidelity.

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
