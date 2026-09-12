# Shooter face

Drop a square image here named `shooter-face` with any of these extensions:

    shooter-face.png   shooter-face.jpg   shooter-face.jpeg   shooter-face.webp

Stage.jsx picks it up automatically and maps it onto the head of the figure
taking the shot. No code change needed — with no file present the figure falls
back to a plain silhouette head, so nothing breaks either way.

Two things to know:

1. **Keep it local.** Do not hotlink a remote URL. The build claims zero
   external requests and a judge can check that in the network tab in five
   seconds. A file in this folder is bundled by Vite, so the claim stays true.

2. **Crop it tight and square** — head and shoulders, face centred. The image is
   clipped to a circle. At true human scale that circle is about 12px across, so
   the figure's head is drawn larger when a face is present, which is why it
   reads as an action figure rather than a person.
