# Ithinoru Pattu (ഇതിനൊരു പാട്ട്) — AI Outfit to Soundtrack Engine

A real-time camera and computer vision experience that scans your outfit, clothing silhouette, color harmony, patterns, and T-shirt text to instantly curate and stream a matching soundtrack across **Malayalam, Hindi, Tamil, and Global** music.

---

## Key Features

1. **Real-Time Audio Preview Streaming**:
   - Streams authentic 30-second high-fidelity master recordings directly in the browser (Arijit Singh, Sushin Shyam, Dabzee, The Weeknd, Harry Styles, Dua Lipa, Vijay, Anirudh, etc.).
   - Displays revolving vinyl album artwork for every playing track.

2. **Multi-Language Regional Soundtrack Engine**:
   - **Malayalam**: *Illuminati*, *Jaada*, *Pala Palli Thiruppalli*, *Manavalan Thug*, *Darshana*, *Malare*, *Aadharanjali*, *Kuthanthram*, *Nee Himamazhayayi*.
   - **Hindi**: *Badtameez Dil*, *Kabira*, *Ghungroo*, *Tauba Tauba*, *Kesariya*, *Chaleya*, *Apna Bana Le*, *Tum Hi Ho*, *Mirchi*, *Iktara*.
   - **English / Global**: *Starboy*, *As It Was*, *Levitating*, *Big Dawgs*, *FE!N*, *golden hour*, *Until I Found You*, *Not Like Us*, *Seven*, *Cheques*, *Space Song*.
   - **Tamil**: *Naa Ready*, *Arabic Kuthu*, *Munbe Vaa*, *Thee Thalapathy*, *Enjoy Enjaami*, *Hayyoda*.

3. **T-Shirt Text & Slogan OCR**:
   - Client-side Tesseract OCR recognizes words on clothing (`"JAADA"`, `"AAVESHAM"`, `"PALA PALLI"`, `"BADTAMEEZ DIL"`, `"KABIRA"`, `"STARBOY"`, `"KESARIYA"`, etc.) and instantly pairs with the exact track.

4. **Multi-Person Social Mode Detection**:
   - **Solo Subject**: Direct personal aesthetic matching.
   - **Duo Friends**: Synchronized swagger collab tracks.
   - **Romantic Couple**: Soulful romantic melodies and love duets.
   - **Trio Squad**: 3-person high-tempo crew flows.
   - **Friend Group (4+ People)**: Dynamic squad detection with an automated **Aux Cord Winner** algorithm.

5. **Design System**:
   - Minimalist Teenage Engineering / Spotify DJ dual-deck layout with collapsible visual DNA analysis and Dark/Light mode.

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build for production
npm run build
```

---

## Privacy & Security
- All computer vision and OCR run 100% locally in your browser.
- No camera footage or personal photos leave your device.
