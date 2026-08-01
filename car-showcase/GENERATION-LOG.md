# Car Showcase — Generation Log

Provenance record for every generated asset. Keeps the piece reproducible and
lets later shots reference earlier job IDs directly (Higgsfield accepts a prior
generation's job ID as a media input, so these IDs are working references, not
just bookkeeping).

---

## Locked assets

### `assets/act3-drive.mp4` — Act 3 scroll-scrubbed orbit

Two chained 8s clips concatenated into one 16.1s track, colour graded, and
encoded for scrubbing. Generated free on the unlimited allowance.

| | |
|---|---|
| **Clip 1** | `4bb6697d-8c9f-4abc-bf1a-0662c005ca8d` — rain-forward prompt |
| **Clip 2** | `7eca9254-3631-4f9b-b20b-9c30d92a68f6` — chained from clip 1's final frame |
| **Model** | `kling3_0`, `mode: pro`, 8s each, 16:9 |
| **Join quality** | SSIM 0.987 between clip 1's last frame and clip 2's first |
| **Committed** | 1920 × 1080, CRF 24, **GOP 6**, silent, faststart — 8.7 MB |

**Scrub encode.** `-g 6 -keyint_min 6 -sc_threshold 0` places a keyframe every
6 frames (0.25 s at 24 fps) so an arbitrary seek decodes at most 5 frames.
Standard encodes place keyframes ~2 s apart, which makes scroll-scrubbing lurch
between them instead of tracking the input. Measured alternatives: GOP 1
(all-intra, perfect seeking) 15 MB; GOP 6 8.8 MB; GOP 12 8.1 MB. GOP 6 chosen as
the balance — switch to GOP 1 if scrubbing feels rough in the built page.

**Colour grade**, baked in at assembly:
`eq=brightness=-0.10:contrast=1.12:saturation=0.92` plus a midtone curve. This
exists because the car drifts from dark charcoal to silver as the camera orbits
to side-on — three prompts failed to prevent it, moving brightness ~2%. The
cause is lighting, not paint: a dark car seen rear-on sits in its own shadow,
but swung side-on under streetlights it catches reflections across the whole
flank and reads bright. The model is behaving correctly, so prompting cannot
argue with it. The grade also usefully quiets the brake calipers and panel lines.

**Beat coverage (five beats — beat 6 dropped):**

| Beat | Shot | Clip |
|---|---|---|
| 1 | low rear three-quarter | 1 |
| 2 | low hero angle | 1 |
| 3 | side profile, full silhouette | 1 |
| 4 | low front, up the nose | 2 |
| 5 | overhead roofline and wing | 2 |
| ~~6~~ | ~~wheel / brake caliper detail~~ | **dropped** |

Beat 6 was cut deliberately. A macro on a brake caliper is where generated
detail collapses, and it contradicts the minimum-distance rule the piece relies
on. Six stats now spread across five beats, with the side profile carrying two.

**Known compromises:**

- **Clip 2 is materially weaker than clip 1.** The camera closes to near
  full-frame, brake calipers, wheel spokes, door handles and "GT3RS" side text
  are all crisply legible, a driver is visible in the cabin, and there is little
  motion blur. Accepted rather than re-rolled.
- **Chaining compounds drift.** Clip 2 inherited clip 1's silvered car and
  lighter framing as its start image and pushed further in both directions. Any
  future chained clip should be generated from a *graded* start frame so it
  inherits the corrected look rather than the drifted one.
- Rain is moderate, not torrential. Three prompt strategies were tried,
  including restructuring to lead with rain as the subject; that helped but did
  not reach a downpour. The canvas rain overlay is the intended fix, and gives
  constant density across all three acts rather than per-clip variation.

---

### `assets/act2-launch.mp4` — Act 2 launch and whip-around

Generated in this session using the free-trial **unlimited** allowance — cost 0
credits (balance verified unchanged at 2 before and after).

| | |
|---|---|
| **Job ID** | `4c45c79c-5e11-48bb-b83f-f4255be3d806` (B1) |
| **Model** | `kling3_0`, `mode: pro`, `sound: on`, 8s, 16:9 |
| **start_image** | `3ee06f36…` — Candidate 4, matching the locked Act 1 |
| **Source** | 1920 × 1080, 24 fps, 8.04 s, 20 MB |
| **Committed** | CRF 23, silent, faststart — 6.1 MB |
| **Audio** | extracted to `assets/act2-launch-audio.m4a` (129 KB) |

**Beat coverage — all three Act 2 beats landed in a single take:**

| Time | Beat |
|---|---|
| 0–1s | car mid-distance in Act 1's world |
| 2s | accelerates toward camera, front-on |
| 3s | close pass at peak speed, wheel and flank smeared into blur |
| 4s | whip-around lands on rear three-quarter, wing and taillight bar |
| 5–8s | settles, car driving away, spray and mist kicking up behind |

**Continuity with Act 1:** frame 0 measures SSIM 0.933 against `hero-frame.png`
(Candidate 4), so the loop-to-launch handoff needs no blending. Same car, grade,
neon palette and rain throughout.

Because the piece is all video rather than video-into-3D, the treatment's
planned motion-blur handoff at the close pass is no longer a seam to hide — it
is one continuous take.

**Selection — three takes were compared:**

| Take | Prompt | Outcome |
|---|---|---|
| **B1** | original Act 2 prompt, Candidate 4 start | **Selected.** Holds distance, all three beats, no visible driver |
| B2 | + slow-shutter blur, distance rule dropped | Camera drifted into the door panel at t=3–5s — unusable framing |
| B2r | identical prompt to B2, second roll | Best measured blur (edge density 0.97 at t=4 vs B1's 3.48, ~72% softer) but not selected |

The B2/B2r pair is the useful record here: **the same prompt produced both the
worst framing and the best close pass.** The extreme close-ups in B2 were roll
variance, not prompt causation — a planned "B3" to re-impose a distance
constraint would have been fixing a bug that did not exist. With generation
free, re-rolling an unchanged prompt is often more informative than rewriting it.

**Known compromises:**

- **The settle at t=4–5s is close and fairly crisp** — panel lines, wheel spokes
  and exhaust tips are readable. This is the frame most exposed to detail
  scrutiny. B2r resolved it via heavy blur but was not the chosen take.
- **The "GT3 RS" plate is legible** in several frames, inherited from Candidate 4.

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

## Delivery formats

Every act ships as **AV1 in WebM first, H.264 MP4 as fallback**. Chrome, Edge,
Firefox and Safari 17+ take the WebM; anything older falls through to the MP4.

The WebM was VP9 until a measured comparison replaced it. All variants were
scored by SSIM against the committed MP4, which is the crispest copy available
(the 20 MB generator original was never kept):

| Encode | Size | vs VP9 | SSIM |
|---|---|---|---|
| VP9, as originally shipped | 3.93 MB | — | 0.9445 |
| VP9 two-pass, tuned | 3.13 MB | −20% | 0.9463 |
| AV1, crf 32 | 2.98 MB | −24% | 0.9471 |
| AV1, crf 36 | 2.33 MB | −41% | 0.9457 |
| **AV1 crf 32 + unsharp** | **3.17 MB** | **−19%** | **0.9464** |

**Re-encoding buys size, not sharpness.** Every unsharpened variant lands
between 0.944 and 0.947 — far too narrow to see. The only thing that raises
apparent detail is a mild `unsharp=5:5:0.55:5:5:0.0` pass before encoding, and
because AV1 comes in so far under the VP9 budget, the saving pays for it and
still lands smaller. Sharpening costs fidelity against the same encode
(0.9471 → 0.9464) because it deliberately deviates from the source; it still
beats the VP9 it replaces.

Shipped result — every clip is both smaller and closer to the MP4:

| Act | old WebM | new WebM | saved | old SSIM | new SSIM |
|---|---|---|---|---|---|
| 1 — loop | 3.93 MB | 3.17 MB | 19% | 0.9445 | 0.9464 |
| 2 — launch | 3.45 MB | 2.74 MB | 21% | 0.9425 | 0.9432 |
| 3 — drive | 7.41 MB | 7.12 MB | 4% | 0.9532 | 0.9533 |

Act 3 saves least because its GOP-6 scrub encode forces frequent keyframes,
which limits how much inter-frame compression any codec can do. That is the
cost of smooth scrubbing and it is worth paying. GOP 6 survives the AV1 encode
intact — 12 keyframes in 3 s at 24 fps, same as the VP9 — and seeks measure a
44.5 ms median, 109 ms worst case.

**Upscaling was considered and rejected.** At native 1:1 the source carries very
little fine detail: between the shallow depth of field the treatment asked for
and the softness the generator produced, most of the frame is already blur.
Encoding at 1440p or 4K would multiply file size to store an interpolation of
that blur. Genuine added detail would need AI super-resolution, which costs
generation credits.

**The `type` attribute is load-bearing.** Sources are declared
`type='video/webm; codecs="av01.0.08M.08"'`. A plain `video/webm` returns
"maybe" from `canPlayType` on a browser with WebM but no AV1 decoder, so it
would accept the source and then fail rather than falling through to the MP4.
With the codec spelled out it returns empty and the fallback works. Verified:
the string reports "probably" and decodes at 1920×1080.

**Sharpening does not disturb the Act 3 scrub.** The concern was that raising
high-frequency detail would make frame-to-frame noise more visible while
scrubbing. Measured as mean luma of the frame difference: 11.101 for the old
VP9, 11.152 for AV1 + sharpen — a 0.5% difference, which settled it.

## Testing notes

Two environment quirks cost real debugging time and will bite again:

- **The bundled Chromium has no H.264.** `canPlayType('avc1…')` returns empty and
  MP4s fail with `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`. Video playback can only be
  verified through the WebM path locally. Not a page bug.
- **`python3 -m http.server` does not support HTTP Range.** Without range
  requests a video reports `seekable: [0,0]`, and every `currentTime` assignment
  is silently ignored — no throw, no error, the playhead simply never moves.
  Scrubbing cannot be tested on it. Use a range-capable server; GitHub Pages
  serves ranges correctly.

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
