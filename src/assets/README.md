# Shooter face

`stephencurry.jpeg` is imported directly by `Stage.jsx` and drawn on the head of
the figure taking the shot.

The crop is hardcoded — `FACE_CROP` in `Stage.jsx` is a fixed source square
tuned to this exact 416x416 photo. **Swap the file and the crop needs
re-tuning**, or the head will frame the wrong part of the image.

Keep the image local. It is bundled by Vite and served same-origin; hotlinking a
remote URL would break the zero-external-request claim, which is checkable in
the network tab.
