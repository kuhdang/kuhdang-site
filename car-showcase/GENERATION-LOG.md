# Car Showcase — Generation Log

Provenance record for every generated asset. Keeps the piece reproducible and
lets later shots reference earlier job IDs directly (Higgsfield accepts a prior
generation's job ID as a media input, so these IDs are working references, not
just bookkeeping).

---

## Locked assets

### `assets/hero-frame.png` — Act 1 loop point

The visual bible. This frame is the `start_image` **and** `end_image` for the
Act 1 loop, which is what makes the loop seamless rather than crossfaded. Every
later shot art-directs back to this frame's light temperature and grade.

| | |
|---|---|
| **Job ID** | `3ee06f36-0712-4ec6-bc81-e507d4af8874` |
| **Model** | `nano_banana_pro` (served as `nano_banana_2`) |
| **Dimensions** | 1376 × 768 (16:9, 1k) |
| **Cost** | 2 credits (batch of 4 candidates) |
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
| `nano_banana_pro` | still, 1k (batch up to 4) | 2 |

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
