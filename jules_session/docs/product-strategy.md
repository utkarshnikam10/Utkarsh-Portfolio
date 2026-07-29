# NEXUS - product and interaction strategy

## The corrected experience model

The first version of the brief was strongest when the world was navigation, but a portfolio cannot hide all useful information behind exploration. The final structure keeps the world as the memorable entry point and adds an intentional dossier below it.

```text
Arrival in the world
        |
Explore six focused landmarks
        |
Scroll begins -> camera composes a second, third, and fourth view
        |
About / selected work / capabilities / trajectory / contact
```

This preserves discovery while giving a recruiter a direct, scan-friendly path through the work.

## Why it is not an open world

- All six landmarks are visible from the home composition.
- Each location has a specific narrative job: principles, work, thinking, experiments, outcomes, or contact.
- The dock is a semantic fallback for touch, keyboard, and users who prefer direct navigation.
- There are no free-roam controls, hidden tasks, or game loops.

## Motion rules

- Camera framing introduces a chapter before a panel is shown.
- Hover creates feedback; a click makes a meaningful change of focus.
- Scroll movement changes the world composition only inside the spatial introduction.
- All other content uses restrained reveal motion so reading is never delayed by animation.
- Reduced-motion preferences shorten camera changes and disable continuous scroll embellishments.

## Reference translation

The reference repository suggested an effective pattern: treat the environment as part of the scroll narrative, not a decorative hero. NEXUS translates that into an original, lightweight landscape with procedural geometry and a different visual language. It deliberately avoids its specific room, models, and interaction sequence.

## Performance budget

- Client-only canvas import to protect the server-rendered page.
- Procedural meshes, no GLTF downloads, and a DPR cap of 1.75.
- Scroll progression is stored in a mutable ref; React does not render for every scroll frame.
- GSAP only controls transform-level scroll accents and deterministic camera values.
- Opaque dossier sections take over after the spatial sequence, making long-form content inexpensive to read and scan.

## Content integrity rule

The current work cards are explicitly marked as development case studies. Before public deployment, replace them with real projects and verified impact. A high-craft interaction never excuses invented credentials.
