# Shooter face

Drop a square image in this folder and it is mapped onto the head of the figure
taking the shot. **The filename does not matter** — any `.png`, `.jpg`, `.jpeg`
or `.webp` here is picked up automatically. If you keep several, one named
`shooter-face.*` wins; otherwise it is the first alphabetically.

With no image present the figure falls back to a plain silhouette head, so
neither state breaks.

Two things to know:

1. **Keep it local.** Do not hotlink a remote URL. The build claims zero
   external requests and a judge can check that in the network tab in five
   seconds. A file in this folder is bundled by Vite, so the claim stays true.

2. **Crop it tight and square** — head and shoulders, face centred. The image is
   clipped to a circle, and the head is drawn larger than human scale so the
   face reads at all; that enlargement is what makes the figure look like an
   action figure rather than a person.
