# Ithinoru Pattu!!!!!

A Vite camera app that analyzes a look with an ONNX vision model that runs in the user's browser and recommends music.

## Run locally

Install dependencies and start the Vite development server:

```powershell
npm install
npm run dev
```

Open the local URL on your phone or computer, allow camera access, and tap **Scan this look**. You can also select a photo.

The app downloads `Xenova/clip-vit-base-patch32` on the first scan and runs it in a Web Worker. Camera frames and uploaded photos remain in the browser; only the model download and song search links use the network. Song buttons open a YouTube search for the selected track.
