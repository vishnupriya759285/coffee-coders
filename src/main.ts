import '../styles.css';
import type {
  AccessoryCue,
  ColorCue,
  DuoAnalysis,
  GraphicCue,
  GroupAnalysis,
  MusicTrack,
  ObjectCue,
  PatternCue,
  PeopleMode,
  PersonAnalysis,
  SongExplanation,
  TextCue,
  VibeHistoryEntry,
  VibeVector,
} from './types';
import { vibeEngine } from './vibe-engine';
import { musicEngine, VERIFIED_TRACK_CATALOG } from './music-engine';
import { audioPlayer } from './audio-player';
import {
  interpretTextSemantics,
  extractTextRegionHeuristics,
  preloadOCRWorker,
  recognizeTextFromShirtCanvas,
  detectClothingDesignAndPatterns,
} from './ocr-engine';

export type SongItem = MusicTrack;

interface SpotifyEmbedController {
  loadUri(uri: string): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  addListener(event: string, callback: (data: any) => void): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
    SpotifyIFrameAPI?: any;
  }
}

// DOM Helper
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// Elements
const video = $('camera') as HTMLVideoElement;
const image = $('uploadedImage') as HTMLImageElement;
const canvas = $('captureCanvas') as HTMLCanvasElement;

// App State
let stream: MediaStream | undefined;
let facing: 'user' | 'environment' = 'user';
let locked = false;
let workerReady = false;
let modelLoading = false;
let queuedScan = false;
let scanId = 0;
let loadingTimer: number | undefined;

let embedController: SpotifyEmbedController | null = null;
let currentSong: MusicTrack | null = null;
let currentPlaylist: MusicTrack[] = [...VERIFIED_TRACK_CATALOG];
let userApiKey = '';
let autoPlayEnabled = true;
let isRouletteActive = false;
let currentLanguageFilter: string = 'all';

let latestVibeVector: VibeVector = {
  energy: 89,
  edge: 82,
  playful: 64,
  dreamy: 31,
  classy: 52,
  street: 88,
  dominantVibe: 'STREET',
  secondaryVibes: ['EDGY', 'HIGH ENERGY'],
};

let previousVibeVector: VibeVector | null = null;
let currentPeopleMode: PeopleMode = 'one';
let latestDetectedText: TextCue | null = null;
let latestDetailedResult: any = null;
let latestColorAnalysis: ColorCue[] = [
  { name: 'Black', tone: 'Dark Monochrome', hex: '#111815', isDark: true, isBright: false, isWarm: false, isCool: false, vibeSignal: 'dark / edgy' },
  { name: 'White', tone: 'Clean Minimal', hex: '#e2e8e4', isDark: false, isBright: true, isWarm: false, isCool: false, vibeSignal: 'clean / minimal' },
  { name: 'Red', tone: 'Bold Energy', hex: '#e63946', isDark: false, isBright: true, isWarm: true, isCool: false, vibeSignal: 'intense / energetic' },
];

let vibeHistory: VibeHistoryEntry[] = [];
let autoStreamInterval: number | null = null;
let lastChangeTimestamp = Date.now();
let isScanning = false;
let scanSafetyTimeoutId: number | null = null;

// Vision Worker instance
const worker = new Worker(new URL('./vision-worker.ts', import.meta.url), { type: 'module' });

// =========================================================
// UI HELPERS & NOTIFICATIONS
// =========================================================

function showToast(message: string) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toast.dataset.timer ? parseInt(toast.dataset.timer, 10) : undefined);
  const timer = window.setTimeout(() => toast.classList.remove('show'), 2800);
  toast.dataset.timer = timer.toString();
}

function setStatus(text: string, detail = 'Sampling colors, silhouette, accessories & energy') {
  $('scanTitle').textContent = text;
  $('scanText').textContent = detail;
  $('scanToast').hidden = false;
  $('cameraFrame')?.classList.add('is-sampling');
}

function hideStatus() {
  $('scanToast').hidden = true;
  $('cameraFrame')?.classList.remove('is-sampling');
}

// Direct Canvas Pixel Color Extraction
function extractDominantColorsFromCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): ColorCue[] {
  try {
    const startX = Math.floor(width * 0.22);
    const startY = Math.floor(height * 0.35);
    const sampleW = Math.max(10, Math.floor(width * 0.56));
    const sampleH = Math.max(10, Math.floor(height * 0.5));

    const imgData = ctx.getImageData(startX, startY, sampleW, sampleH);
    const data = imgData.data;

    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    const colorBuckets = { dark: 0, light: 0, warm: 0, cool: 0, total: 0 };

    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      rSum += r;
      gSum += g;
      bSum += b;
      count++;

      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      if (brightness < 60) colorBuckets.dark++;
      else if (brightness > 190) colorBuckets.light++;
      else if (r > b + 25) colorBuckets.warm++;
      else colorBuckets.cool++;
      colorBuckets.total++;
    }

    const rAvg = Math.round(rSum / Math.max(1, count));
    const gAvg = Math.round(gSum / Math.max(1, count));
    const bAvg = Math.round(bSum / Math.max(1, count));
    const avgHex = `#${((1 << 24) + (rAvg << 16) + (gAvg << 8) + bAvg).toString(16).slice(1)}`;

    const darkPct = Math.round((colorBuckets.dark / Math.max(1, colorBuckets.total)) * 100);
    const lightPct = Math.round((colorBuckets.light / Math.max(1, colorBuckets.total)) * 100);
    const accentPct = Math.max(10, 100 - darkPct - lightPct);

    return [
      {
        name: darkPct > 35 ? 'Pitch Black' : 'Deep Forest Tone',
        tone: 'Dark Monochrome',
        hex: avgHex,
        percentage: darkPct,
        isDark: true,
        isBright: false,
        isWarm: false,
        isCool: false,
        vibeSignal: 'dark / edgy',
      },
      {
        name: lightPct > 20 ? 'Crisp White' : 'Neutral Light',
        tone: 'Clean Accent',
        hex: '#e5ece7',
        percentage: lightPct,
        isDark: false,
        isBright: true,
        isWarm: false,
        isCool: false,
        vibeSignal: 'clean / minimal',
      },
      {
        name: 'Vibrant Accent',
        tone: 'Street Energy',
        hex: '#e63946',
        percentage: accentPct,
        isDark: false,
        isBright: true,
        isWarm: true,
        isCool: false,
        vibeSignal: 'intense / energetic',
      },
    ];
  } catch {
    return latestColorAnalysis;
  }
}

function detectSceneCompositionHeuristics(ctx: CanvasRenderingContext2D, width: number, height: number): PeopleMode {
  try {
    const midY = Math.floor(height * 0.22);
    const sampleH = Math.max(10, Math.floor(height * 0.5));
    const sampleW = Math.max(10, Math.floor(width * 0.16));

    // 5 Horizontal Zones across the camera frame to measure scene spread
    const zones = [
      ctx.getImageData(Math.floor(width * 0.04), midY, sampleW, sampleH).data,
      ctx.getImageData(Math.floor(width * 0.24), midY, sampleW, sampleH).data,
      ctx.getImageData(Math.floor(width * 0.42), midY, sampleW, sampleH).data,
      ctx.getImageData(Math.floor(width * 0.60), midY, sampleW, sampleH).data,
      ctx.getImageData(Math.floor(width * 0.80), midY, sampleW, sampleH).data,
    ];

    const activeZones = zones.map((data) => {
      let edges = 0;
      let humanLuma = 0;
      for (let i = 0; i < data.length - 4; i += 24) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (Math.abs(r - data[i + 4]) > 26) edges++;
        // Human skin tone / clothing luminance check
        if (r > 55 && g > 35 && b > 20 && r > b && (r - g) >= 8 && (r - g) <= 95) {
          humanLuma++;
        }
      }
      return edges > 16 || humanLuma > 14;
    });

    const activeCount = activeZones.filter(Boolean).length;
    const centerActive = activeZones[2];
    const leftWing = activeZones[0] || activeZones[1];
    const rightWing = activeZones[3] || activeZones[4];

    // Single Person: Center zone is active, side wings are clear
    if (centerActive && !activeZones[0] && !activeZones[4] && activeCount <= 2) {
      return 'one';
    }

    // Large Friend Group / Squad / Gang: 4 or 5 zones active across wide frame
    if (activeCount >= 4) {
      return 'group';
    }

    // Trio Squad: Exactly 3 active zones with spacing
    if (activeCount === 3) {
      return 'trio';
    }

    // Couple: Two subjects close together in the center zone
    if (activeZones[1] && activeZones[3] && !activeZones[0] && !activeZones[4]) {
      return 'couple';
    }

    // Duo Friends: Left and Right distinct presences
    if (leftWing && rightWing) {
      return 'duo';
    }

    return 'one';
  } catch {
    return 'one';
  }
}

// =========================================================
// UI RENDERERS: VIBE MIRROR, PIPELINE, EXPLAINABILITY, SONGS
// =========================================================

function updateVibeMirror(vibe: VibeVector, colors: ColorCue[]) {
  // Update Meters
  $('meterEnergy').style.width = `${vibe.energy}%`;
  $('pctEnergy').textContent = `${vibe.energy}%`;

  $('meterEdge').style.width = `${vibe.edge}%`;
  $('pctEdge').textContent = `${vibe.edge}%`;

  $('meterPlayful').style.width = `${vibe.playful}%`;
  $('pctPlayful').textContent = `${vibe.playful}%`;

  $('meterDreamy').style.width = `${vibe.dreamy}%`;
  $('pctDreamy').textContent = `${vibe.dreamy}%`;

  $('meterClassy').style.width = `${vibe.classy}%`;
  $('pctClassy').textContent = `${vibe.classy}%`;

  $('meterStreet').style.width = `${vibe.street}%`;
  $('pctStreet').textContent = `${vibe.street}%`;

  $('dnaDominantTag').textContent = vibe.dominantVibe;

  // Update Color Swatches
  const swatchesEl = $('paletteSwatches');
  if (swatchesEl) {
    swatchesEl.innerHTML = colors
      .map(
        (c) =>
          `<span class="swatch-item"><i style="background: ${c.hex};"></i> ${c.name.toUpperCase()} ${c.percentage || 30}%</span>`
      )
      .join('');
  }
}

function updateVisualCuePipeline(
  colorText: string,
  patternText: string,
  graphicText: string,
  ocrText: string,
  accText: string,
  objText: string,
  vibeText: string,
  musicText: string
) {
  $('pipeColorVal').textContent = colorText;
  $('pipePatternVal').textContent = patternText;
  $('pipeGraphicVal').textContent = graphicText;
  $('pipeTextVal').textContent = ocrText ? `"${ocrText}"` : 'NONE';
  $('pipeAccVal').textContent = accText;
  $('pipeObjVal').textContent = objText;
  $('pipeVibeVal').textContent = vibeText;
  $('pipeMusicVal').textContent = musicText;
}

function renderExplainability(explanation: SongExplanation) {
  const container = $('explainItemsList');
  if (container) {
    container.innerHTML = explanation.items
      .map(
        (item) => `
        <div class="explain-item">
          <span class="exp-bullet">◈</span>
          <div class="exp-text">
            <strong>${item.title}</strong>
            <small>${item.detail}</small>
          </div>
          <span class="exp-influence">${item.influence}</span>
        </div>
      `
      )
      .join('');
  }
  $('finalVibeFormula').textContent = explanation.finalVibe;
  $('matchScoreBadge').textContent = `${explanation.matchScore}% MATCH`;
  const analysisPill = $('analysisPill');
  if (analysisPill) {
    analysisPill.textContent = `${explanation.matchScore}% MATCH`;
  }
}

function renderOutfitAsSongCard(track: MusicTrack, vibe: VibeVector) {
  const outfit = musicEngine.generateOutfitAsSongCard(track, vibe);
  $('outfitSongTitle').textContent = outfit.songTitle;
  $('outfitSongGenre').textContent = `Genre: ${outfit.genre}`;
  $('outfitVibeFormula').textContent = outfit.vibeFormula;
}

function showItemChangedToast(itemName: string, classinessDelta: number, energyDelta: number) {
  const banner = $('itemChangedBanner');
  if (!banner) return;
  $('itemChangedTitle').textContent = `NEW ITEM DETECTED: ${itemName.toUpperCase()}`;
  $('itemChangedDeltas').textContent = `CLASSINESS ${classinessDelta >= 0 ? '+' : ''}${classinessDelta}% · ENERGY ${energyDelta >= 0 ? '+' : ''}${energyDelta}% · SOUNDTRACK UPDATED`;
  banner.hidden = false;

  window.clearTimeout(banner.dataset.timer ? parseInt(banner.dataset.timer, 10) : undefined);
  const timer = window.setTimeout(() => (banner.hidden = true), 5500);
  banner.dataset.timer = timer.toString();
}

$('dismissItemBanner').onclick = () => {
  $('itemChangedBanner').hidden = true;
};

// Collapsible Analysis Dropdown Menu Toggle
const analysisDropdownBtn = $('analysisDropdownBtn');
const analysisDropdownMenu = $('analysisDropdownMenu');
const analysisDropdownSubtitle = $('analysisDropdownSubtitle');

if (analysisDropdownBtn && analysisDropdownMenu) {
  analysisDropdownBtn.onclick = () => {
    const isClosed = analysisDropdownMenu.hidden;
    analysisDropdownMenu.hidden = !isClosed;
    analysisDropdownBtn.classList.toggle('is-open', isClosed);
    analysisDropdownBtn.setAttribute('aria-expanded', String(isClosed));
    if (analysisDropdownSubtitle) {
      analysisDropdownSubtitle.textContent = isClosed
        ? 'Press to collapse detailed breakdown'
        : 'Press to view full breakdown · Vibe Mirror & Match explanation';
    }
  };
}

// =========================================================
// REAL AUDIO PLAYER SYNCHRONIZATION
// =========================================================

const PLAY_SVG = `<svg class="play-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const PAUSE_SVG = `<svg class="pause-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;

function playSongInSite(song: MusicTrack, autoPlay = true) {
  currentSong = song;
  musicEngine.recordPlayed(song.id);

  // Update Active Track Showcase Card
  const titleEl = $('nowPlayingTitle');
  if (titleEl) titleEl.textContent = song.title;

  const artistEl = $('nowPlayingArtist');
  if (artistEl) artistEl.textContent = song.artist;

  const genreEl = $('nowPlayingGenre');
  if (genreEl) genreEl.textContent = song.genre.toUpperCase();

  const langEl = $('nowPlayingLang');
  if (langEl) langEl.textContent = song.language;

  const emojiEl = $('activeEmoji');
  const activeCover = $('activeCover');
  if (activeCover) {
    if (autoPlay) activeCover.classList.add('is-spinning');
    else activeCover.classList.remove('is-spinning');

    if (song.artworkUrl) {
      activeCover.style.backgroundImage = `url('${song.artworkUrl}')`;
      activeCover.style.backgroundSize = 'cover';
      activeCover.style.backgroundPosition = 'center';
      if (emojiEl) emojiEl.style.display = 'none';
    } else {
      activeCover.style.backgroundImage = '';
      if (emojiEl) {
        emojiEl.style.display = '';
        emojiEl.textContent = song.emoji || '✦';
      }
    }
  }

  const playBtn = $('mainPlayPauseBtn');
  if (playBtn) {
    playBtn.innerHTML = autoPlay ? PAUSE_SVG : PLAY_SVG;
  }

  const spotifyLink = $('activeSpotifyLink') as HTMLAnchorElement;
  if (spotifyLink) {
    spotifyLink.href = `https://open.spotify.com/track/${song.spotifyId}`;
    spotifyLink.title = `Listen to "${song.title}" on Spotify`;
  }

  $('playerStatusText').textContent = autoPlay ? 'Streaming In-Site' : 'Ready In-Site';
  $('playerLiveDot').className = autoPlay ? 'live-dot active' : 'live-dot';

  const visualizer = $('audioVisualizer');
  if (visualizer) {
    if (autoPlay) visualizer.classList.add('playing');
    else visualizer.classList.remove('playing');
  }

  // Load into Spotify embed if API controller is active
  const spotifyUri = `spotify:track:${song.spotifyId}`;
  if (embedController) {
    try {
      embedController.loadUri(spotifyUri);
      if (autoPlay) embedController.play();
    } catch {}
  }

  // Play procedural synth audio loop for offline / royalty-free real playback
  audioPlayer.playTrack(song, autoPlay);

  updateSongListActive();
  if (autoPlay) {
    showToast(`Now Streaming: ${song.title} · ${song.genre}`);
    // Record timeline entry for major changes
    addTimelineEntry(song, latestVibeVector);
  }
}

function pauseCurrentPlayback() {
  audioPlayer.pause();
  if (embedController) {
    try {
      embedController.pause();
    } catch (e) {
      console.warn(e);
    }
  }

  const activeCover = $('activeCover');
  if (activeCover) activeCover.classList.remove('is-spinning');

  const visualizer = $('audioVisualizer');
  if (visualizer) visualizer.classList.remove('playing');
  $('playerLiveDot').className = 'live-dot';
  $('playerStatusText').textContent = 'Playback stopped';
  $('mainPlayPauseBtn').innerHTML = PLAY_SVG;

  document.querySelectorAll<HTMLElement>('.song').forEach((el) => {
    el.classList.remove('playing');
    const playBtn = el.querySelector<HTMLButtonElement>('.play-in-site-btn');
    if (playBtn) playBtn.textContent = '▶ Play';
  });
}

function updateSongListActive() {
  if (!currentSong) return;
  const isAudioActuallyPlaying = audioPlayer.getIsPlaying();
  document.querySelectorAll<HTMLElement>('.song').forEach((el) => {
    const isMatch = el.dataset.songId === currentSong?.spotifyId;
    el.classList.toggle('playing', isMatch && isAudioActuallyPlaying);
    const playBtn = el.querySelector<HTMLButtonElement>('.play-in-site-btn');
    if (playBtn) {
      playBtn.textContent = (isMatch && isAudioActuallyPlaying) ? '❚❚ Playing' : '▶ Play';
    }
  });
}

// Subscribe AudioPlayer controller to update UI progress & state
audioPlayer.subscribe((isPlaying, curTime, duration) => {
  $('mainPlayPauseBtn').innerHTML = isPlaying ? PAUSE_SVG : PLAY_SVG;
  const activeCover = $('activeCover');
  if (activeCover) activeCover.classList.toggle('is-spinning', isPlaying);
  updateSongListActive();

  const progressPct = duration > 0 ? (curTime / duration) * 100 : 0;
  $('progressFill').style.width = `${progressPct}%`;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  $('currentTimeStamp').textContent = formatTime(curTime);
  $('totalDurationStamp').textContent = formatTime(duration);

  const visualizer = $('audioVisualizer');
  if (isPlaying) visualizer.classList.add('playing');
  else visualizer.classList.remove('playing');
});

// Real Player Buttons
$('mainPlayPauseBtn').onclick = () => {
  const isPlaying = audioPlayer.togglePlay();
  if (embedController) {
    if (isPlaying) embedController.play();
    else embedController.pause();
  }
  $('mainPlayPauseBtn').innerHTML = isPlaying ? PAUSE_SVG : PLAY_SVG;
  $('activeCover')?.classList.toggle('is-spinning', isPlaying);
};

$('prevTrackBtn').onclick = () => {
  if (currentPlaylist.length === 0) return;
  const currentIdx = currentPlaylist.findIndex((s) => s.id === currentSong?.id);
  const prevIdx = (currentIdx - 1 + currentPlaylist.length) % currentPlaylist.length;
  playSongInSite(currentPlaylist[prevIdx], true);
};

$('nextTrackBtn').onclick = () => {
  if (currentPlaylist.length === 0) return;
  const currentIdx = currentPlaylist.findIndex((s) => s.id === currentSong?.id);
  const nextIdx = (currentIdx + 1) % currentPlaylist.length;
  playSongInSite(currentPlaylist[nextIdx], true);
};

// Seek Bar
$('progressTrack').onclick = (e: MouseEvent) => {
  const rect = $('progressTrack').getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = Math.max(0, Math.min(1, clickX / rect.width));
  audioPlayer.seek(pct * 174);
};

// Volume Slider
$('volumeSlider').oninput = (e) => {
  const val = parseInt((e.target as HTMLInputElement).value, 10) / 100;
  audioPlayer.setVolume(val);
  $('volIcon').textContent = val === 0 ? '🔇' : val < 0.5 ? '🔉' : '🔊';
};

// =========================================================
// SOUNDTRACK RENDERER & QUEUE
// =========================================================

function renderSoundtrack(
  vibeTitle: string,
  vibeDesc: string,
  vibeOrb: string,
  cues: string[],
  songList: MusicTrack[],
  detectedText?: string
) {
  currentPlaylist = songList;
  if ($('vibeName')) $('vibeName').textContent = vibeTitle;
  if ($('vibeDescription')) $('vibeDescription').textContent = vibeDesc;
  if ($('vibeOrb')) $('vibeOrb').textContent = vibeOrb;
  if ($('cueChips')) $('cueChips').innerHTML = cues.map((cue) => `<span>${cue}</span>`).join('');
  if ($('songIntro')) $('songIntro').textContent = `${vibeTitle} — tailored soundtrack across Malayalam, Tamil, Hindi & Global music streaming on-page.`;

  const topSong = songList[0];

  // Render "Why This Song?" explainability
  if (topSong) {
    const explanation = musicEngine.generateExplanation(latestVibeVector, topSong, cues, detectedText);
    renderExplainability(explanation);
    renderOutfitAsSongCard(topSong, latestVibeVector);
  }

  // Render song cards
  $('songList').innerHTML = songList
    .slice(0, 7)
    .map((song, index) => {
      const isPlaying = currentSong?.spotifyId === song.spotifyId;
      const coverStyle = song.artworkUrl
        ? `background-image: url('${song.artworkUrl}'); background-size: cover; background-position: center; border: 1px solid rgba(255,255,255,0.15);`
        : '';
      const coverContent = song.artworkUrl ? '' : song.emoji;
      return `
        <article class="song ${isPlaying ? 'playing' : ''}" data-song-id="${song.spotifyId}" data-index="${index}">
          <div class="cover ${song.category}" style="${coverStyle}">${coverContent}</div>
          <div class="song-info">
            <strong>${song.title} <span class="genre-badge">${song.genre}</span></strong>
            <small>${song.artist} · <span class="lang-tag">${song.language}</span> · ${index === 0 ? '★ #1 priority match' : song.vibeTag}</small>
          </div>
          <div class="song-actions">
            <button type="button" class="play-in-site-btn" data-play-index="${index}" aria-label="Play ${song.title}">
              ${isPlaying ? '❚❚ Playing' : '▶ Play'}
            </button>
            <a class="spotify-app-link" target="_blank" rel="noopener" href="https://open.spotify.com/track/${song.spotifyId}" title="Open track in Spotify app">↗</a>
          </div>
        </article>
      `;
    })
    .join('');

  // Wire click handlers on song list
  document.querySelectorAll<HTMLElement>('.song').forEach((el) => {
    el.onclick = (e) => {
      if ((e.target as HTMLElement).closest('.spotify-app-link')) return;
      const idx = parseInt(el.dataset.index || '0', 10);
      playSongInSite(currentPlaylist[idx], true);
    };
  });
}

// =========================================================
// CAMERA & INFERENCE SCANNER
// =========================================================

async function startCamera() {
  try {
    stopCamera();
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facing, width: { ideal: 1080 }, height: { ideal: 1440 } },
      audio: false,
    });
    video.srcObject = stream;
    await video.play();
    $('cameraEmpty').hidden = true;
    $('cameraHud').hidden = false;
    $('cameraStatus').innerHTML = '<i></i> Live';
    ($('stopCamera') as HTMLButtonElement).disabled = false;
    image.hidden = true;

    // Start subtle periodic sampling (every 3.5s) to detect significant changes
    startPeriodicSampling();

    // Warm up Tesseract OCR engine in the background
    preloadOCRWorker().catch(() => {});
  } catch {
    showToast('Camera access is needed — or use a photo instead.');
  }
}

function stopCamera() {
  stream?.getTracks().forEach((track) => track.stop());
  stream = undefined;
  video.srcObject = null;
  $('cameraHud').hidden = true;
  $('cameraStatus').innerHTML = '<i></i> Ready';
  ($('stopCamera') as HTMLButtonElement).disabled = true;
  stopPeriodicSampling();
}

function startPeriodicSampling() {
  stopPeriodicSampling();
  autoStreamInterval = window.setInterval(() => {
    // Only sample if camera is active, not locked, not currently scanning, and music is not actively playing
    if (!locked && !isScanning && stream && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      if (!audioPlayer.getIsPlaying()) {
        const now = Date.now();
        if (now - lastChangeTimestamp > 10000) {
          scan(false, false);
        }
      }
    }
  }, 5000);
}

function stopPeriodicSampling() {
  if (autoStreamInterval !== null) {
    clearInterval(autoStreamInterval);
    autoStreamInterval = null;
  }
}

function finishScanWithVisualAnalysis(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  showToastFeedback: boolean = true,
  autoPlay: boolean = true
) {
  if (scanSafetyTimeoutId) {
    window.clearTimeout(scanSafetyTimeoutId);
    scanSafetyTimeoutId = null;
  }
  isScanning = false;
  hideStatus();

  // 1. Direct canvas color analysis
  latestColorAnalysis = extractDominantColorsFromCanvas(ctx, width, height);

  // 2. Direct dress, clothing design, pattern, and graphic analysis from real canvas pixels
  const dressDesign = detectClothingDesignAndPatterns(ctx, width, height);

  // 3. Multi-person heuristic detection
  const detectedMode = detectSceneCompositionHeuristics(ctx, width, height);
  currentPeopleMode = detectedMode;

  // 4. Style heuristic based on clothing design, color palette and social mode
  const dominantColor = latestColorAnalysis[0];
  const isDarkDominant = dominantColor?.isDark || (dominantColor?.name.toLowerCase().includes('black') || dominantColor?.name.toLowerCase().includes('dark'));
  const isWarmAccent = latestColorAnalysis.some((c) => c.isWarm && (c.percentage || 0) > 12);
  const isBrightAccent = latestColorAnalysis.some((c) => c.isBright && (c.percentage || 0) > 22);
  const isColorful = latestColorAnalysis.filter((c) => c.isBright || c.isWarm).length >= 2;

  let styleLabel = dressDesign.hasDistinctDesign
    ? dressDesign.styleLabel
    : 'streetwear urban fashion outfit with hoodie or graphic tee';

  if (detectedMode === 'couple') {
    styleLabel = 'dreamy pastel soft aesthetic clothing';
  } else if (detectedMode === 'group') {
    // Dynamic squad flavor based on actual group attire:
    if (isColorful || (isWarmAccent && isBrightAccent)) {
      styleLabel = 'playful quirky colorful eccentric outfit'; // Party / Viral Squad
    } else if (isDarkDominant && !isWarmAccent) {
      styleLabel = 'edgy punk dark rocker leather outfit'; // Dark Trap / Heavy Bass Squad
    } else if (isBrightAccent) {
      styleLabel = 'clean minimal monochrome simple outfit'; // Clean / College Squad
    } else {
      styleLabel = 'streetwear urban fashion outfit with hoodie or graphic tee'; // West Coast / DHH Squad
    }
  } else if (!dressDesign.hasDistinctDesign) {
    if (isDarkDominant && !isWarmAccent) {
      styleLabel = 'alternative indie grunge dark aesthetic clothing';
    } else if (isBrightAccent && !isDarkDominant) {
      styleLabel = 'clean minimal monochrome simple outfit';
    } else if (isWarmAccent) {
      styleLabel = 'streetwear urban fashion outfit with hoodie or graphic tee';
    }
  }

  const detailedResult = {
    peopleCountCue: {
      label:
        detectedMode === 'couple'
          ? 'a romantic couple hugging or standing close together'
          : detectedMode === 'group'
          ? 'a large friend group or squad gang standing together'
          : detectedMode === 'trio'
          ? 'a group of three friends or trio posing together'
          : detectedMode === 'duo'
          ? 'two friends or homies posing together'
          : 'a single individual person standing alone',
      score: 0.92,
    },
    styleCue: { label: styleLabel, score: dressDesign.confidence || 0.89 },
    patternCue: {
      label: latestDetectedText
        ? 'typography text slogans printed on clothing'
        : dressDesign.patternLabel,
      score: 0.90,
    },
    graphicCue: {
      label: latestDetectedText
        ? 'racing cars motorsport speed graphics'
        : dressDesign.graphicLabel,
      score: 0.91,
    },
    eyewearCue: { label: isDarkDominant ? 'a person wearing dark sunglasses' : 'a person without glasses', score: 0.85 },
    accessoryCue: { label: isDarkDominant ? 'wearing metal chain necklace or Cuban link jewelry' : 'wearing a baseball cap, hat or beanie', score: 0.8 },
    objectCue: { label: 'a person holding a smartphone or mobile phone', score: 0.8 },
    expressionCue: { label: detectedMode === 'couple' ? 'a person with a big cheerful happy smile' : isColorful ? 'a person with an excited energetic hype expression' : 'a person with a confident hip-hop swagger look', score: 0.88 },
    shirtTextCue: { label: latestDetectedText ? 'a person wearing a t-shirt with bold printed text words or slogan on chest' : 'plain clothing', score: 0.85 },
  };

  // If a distinct dress design/print was detected and no text is overriding, show banner
  if (dressDesign.hasDistinctDesign && !latestDetectedText) {
    const banner = $('tshirtMatchBanner');
    if (banner) {
      $('tshirtMatchTitle').textContent = `🎨 DESIGN DETECTED: ${dressDesign.designName.toUpperCase()}`;
      $('tshirtMatchDeltas').textContent = `${dressDesign.designDescription} · Matching vibe & soundtrack`;
      banner.hidden = false;
    }
  }

  latestDetailedResult = detailedResult;
  processAnalysisResults(detailedResult, detectedMode, latestDetectedText, autoPlay);
  if (showToastFeedback) {
    const detail = latestDetectedText
      ? `Text "${latestDetectedText.rawText}"`
      : dressDesign.hasDistinctDesign
      ? dressDesign.designName
      : `${detectedMode.toUpperCase()} MODE`;
    showToast(
      autoPlay
        ? `✦ Scan Complete: ${detail} · Playing Soundtrack`
        : `✦ Scan Complete: ${detail}`
    );
  }
}

async function scan(showProgressToast = true, autoPlayOnComplete = true) {
  if (locked) return showToast('Vibe is locked. Unlock it to scan again.');
  if (isScanning) return;

  const source = image.hidden ? video : image;
  if (source === video && (!stream || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA)) {
    return showToast('Start the camera first.');
  }

  isScanning = true;

  if (showProgressToast) {
    setStatus('Analyzing Outfit & Style...', 'Scanning garment geometry, color palette & typography');
  }

  latestDetectedText = null;
  const staleTshirtBanner = $('tshirtMatchBanner');
  if (staleTshirtBanner) staleTshirtBanner.hidden = true;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = source === video ? video.videoWidth : image.naturalWidth;
  canvas.height = source === video ? video.videoHeight : image.naturalHeight;
  if (!context || !canvas.width || !canvas.height) {
    isScanning = false;
    hideStatus();
    return;
  }
  context.drawImage(source, 0, 0, canvas.width, canvas.height);

  if (scanSafetyTimeoutId) {
    window.clearTimeout(scanSafetyTimeoutId);
    scanSafetyTimeoutId = null;
  }

  // Smooth viewfinder scan duration (minimum 650ms) so user perceives deliberate telemetry scan
  const minScanDurationPromise = new Promise((resolve) => window.setTimeout(resolve, 650));

  // Run Real Camera T-Shirt OCR with graceful timeout (up to 1200ms)
  const ocrPromise = Promise.race([
    recognizeTextFromShirtCanvas(context, canvas.width, canvas.height).catch((err) => {
      console.warn('Background OCR scan:', err);
      return null;
    }),
    new Promise<{ text: string; cleanWord: string; cue: TextCue } | null>((resolve) =>
      window.setTimeout(() => resolve(null), 1200)
    ),
  ]);

  try {
    // Wait for both the scan animation and OCR analysis to be 100% finished
    const [_, ocrResult] = await Promise.all([minScanDurationPromise, ocrPromise]);

    if (ocrResult && ocrResult.cue) {
      console.log('👕 Camera OCR detected t-shirt text:', ocrResult.cleanWord, ocrResult.cue.matchReason);
      latestDetectedText = ocrResult.cue;

      const tshirtInput = $('tshirtInput') as HTMLInputElement;
      if (tshirtInput) tshirtInput.value = ocrResult.cleanWord;

      const detText = $('detText');
      if (detText) detText.textContent = `"${ocrResult.cleanWord}"`;

      const banner = $('tshirtMatchBanner');
      if (banner) {
        $('tshirtMatchTitle').textContent = `EXTRACTED: "${ocrResult.cleanWord}"`;
        $('tshirtMatchDeltas').textContent = ocrResult.cue.matchReason || '';
        banner.hidden = false;
      }
    }

    // Now finish scan and trigger music ONLY AFTER 100% completion
    finishScanWithVisualAnalysis(
      context,
      canvas.width,
      canvas.height,
      showProgressToast,
      autoPlayOnComplete
    );

    // Non-blocking background worker classification for deep feature refinement
    if (workerReady) {
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 384;
      thumbCanvas.height = 384;
      const thumbCtx = thumbCanvas.getContext('2d');
      if (thumbCtx) {
        thumbCtx.drawImage(canvas, 0, 0, 384, 384);
        const thumbData = thumbCanvas.toDataURL('image/jpeg', 0.82);
        worker.postMessage({ type: 'classify', id: ++scanId, image: thumbData });
      }
    } else if (!modelLoading) {
      modelLoading = true;
      worker.postMessage({ type: 'load' });
    }
  } catch (err) {
    console.warn('Scan execution error:', err);
    finishScanWithVisualAnalysis(
      context,
      canvas.width,
      canvas.height,
      showProgressToast,
      autoPlayOnComplete
    );
  }
}

// Worker message handling
worker.onmessage = ({ data }) => {
  if (data.type === 'progress') {
    return;
  }
  if (data.type === 'ready') {
    workerReady = true;
    modelLoading = false;
    if (loadingTimer) window.clearTimeout(loadingTimer);
    hideStatus();
    showToast('Vibe brain ready ✦');
    if (queuedScan) {
      queuedScan = false;
      scan();
    }
    return;
  }
  if (data.type === 'result') {
    isScanning = false;
    hideStatus();

    const d = data.detailed;

    // Refine people composition if detected
    const peopleLabel = d.peopleCountCue?.label?.toLowerCase() || '';
    if (peopleLabel.includes('couple')) currentPeopleMode = 'couple';
    else if (peopleLabel.includes('three') || peopleLabel.includes('trio')) currentPeopleMode = 'trio';
    else if (peopleLabel.includes('large') || peopleLabel.includes('gang') || peopleLabel.includes('group')) currentPeopleMode = 'group';
    else if (peopleLabel.includes('two') || peopleLabel.includes('duo')) currentPeopleMode = 'duo';

    // Seamlessly apply deep CLIP visual classification results to refine dress design, pattern, and vibe
    processAnalysisResults(d, currentPeopleMode, latestDetectedText, false);

    updateVisualCuePipeline(
      latestColorAnalysis[0]?.name || 'Dark',
      d.patternCue?.label || 'Graphic',
      d.graphicCue?.label || 'Clean',
      latestDetectedText?.rawText || 'None',
      d.accessoryCue?.label || 'Clean',
      d.objectCue?.label || 'Hands free',
      latestVibeVector.dominantVibe,
      currentSong?.title || 'Soundtrack'
    );
  }
  if (data.type === 'error') {
    isScanning = false;
    hideStatus();
  }
};

worker.onerror = () => {
  isScanning = false;
  hideStatus();
};

// =========================================================
// PROCESSING ANALYSIS RESULTS ACROSS MODES
// =========================================================

function processAnalysisResults(
  d: any,
  mode: PeopleMode,
  customText?: TextCue | null,
  forcePlay: boolean = false
) {
  previousVibeVector = { ...latestVibeVector };

  // Parse cues
  const styleLabel = d.styleCue?.label || 'streetwear urban fashion outfit';
  const patternLabel = d.patternCue?.label || 'plain solid color';
  const graphicLabel = d.graphicCue?.label || 'plain clothing';
  const accLabel = d.accessoryCue?.label || 'no visible accessories';
  const objLabel = d.objectCue?.label || 'hands empty';
  const moodLabel = d.expressionCue?.label || 'confident swagger';
  const eyewearLabel = d.eyewearCue?.label || 'without glasses';

  const patternCue: PatternCue = {
    name: patternLabel.split(' ')[0],
    score: 0.85,
    energyBonus: patternLabel.includes('striped') ? 8 : patternLabel.includes('camo') ? 14 : 0,
    vibeBonus: {
      dim: patternLabel.includes('floral') ? 'dreamy' : patternLabel.includes('camo') ? 'edge' : 'energy',
      value: patternLabel.includes('floral') ? 12 : 10,
    },
  };

  const graphicCue: GraphicCue = {
    name: graphicLabel.includes('racing') ? 'Racing Graphic' : graphicLabel.includes('flame') ? 'Flames Graphic' : graphicLabel.includes('guitar') ? 'Guitar Graphic' : 'Street Graphic',
    semanticMeaning: 'Speed & adrenaline',
    genreInfluence: 'Hardcore Rap / Drill',
    score: 0.88,
  };

  const accessories: AccessoryCue[] = [];
  if (eyewearLabel.includes('sunglasses')) {
    accessories.push({ name: 'Sunglasses', score: 0.9, vibeInfluence: '+14 EDGE', bonus: { dim: 'edge', value: 16 } });
  } else if (eyewearLabel.includes('eyeglasses')) {
    accessories.push({ name: 'Eyeglasses', score: 0.9, vibeInfluence: '+18 SPECS CHARM', bonus: { dim: 'classy', value: 15 } });
  }
  if (accLabel.includes('chain')) {
    accessories.push({ name: 'Chain necklace', score: 0.85, vibeInfluence: '+16 STREET', bonus: { dim: 'street', value: 20 } });
  }
  if (accLabel.includes('cap') || accLabel.includes('beanie')) {
    accessories.push({ name: 'Cap', score: 0.8, vibeInfluence: '+12 URBAN', bonus: { dim: 'street', value: 15 } });
  }

  const objects: ObjectCue[] = [];
  if (objLabel.includes('phone')) {
    objects.push({ name: 'Smartphone', score: 0.85, context: 'Urban', genreInfluence: 'Drill' });
  } else if (objLabel.includes('coffee') || objLabel.includes('drink')) {
    objects.push({ name: 'Coffee Cup', score: 0.88, context: 'Chill', genreInfluence: 'Lo-Fi' });
  } else if (objLabel.includes('book')) {
    objects.push({ name: 'Book', score: 0.9, context: 'Focus', genreInfluence: 'Lo-Fi' });
  } else if (objLabel.includes('basketball')) {
    objects.push({ name: 'Basketball', score: 0.92, context: 'Hype', genreInfluence: 'Electronic Hype' });
  } else if (objLabel.includes('guitar')) {
    objects.push({ name: 'Guitar', score: 0.93, context: 'Rock', genreInfluence: 'Rock' });
  }

  const textToUse = customText !== undefined ? customText : latestDetectedText;

  // T-Shirt Word Matching Priority Check
  let forcedSongId: string | undefined = undefined;
  if (textToUse?.matchedSongId) {
    forcedSongId = textToUse.matchedSongId;
    const matchBanner = $('tshirtMatchBanner');
    if (matchBanner) {
      $('tshirtMatchTitle').textContent = `T-SHIRT TEXT READ: "${textToUse.rawText}"`;
      $('tshirtMatchDeltas').textContent = `${textToUse.matchReason}`;
      matchBanner.hidden = false;
    }
  }

  // Single person visual analysis
  const computedVibe = vibeEngine.computePersonVibeVector(
    styleLabel,
    latestColorAnalysis,
    patternCue,
    graphicCue,
    textToUse || undefined,
    accessories,
    objects,
    moodLabel
  );

  latestVibeVector = computedVibe;

  // Update Multi-Person UI Banners
  const modePill = $('peopleModePill');
  const multiPersonBanner = $('multiPersonBanner');
  const auxCard = $('auxWinnerCard');

  if (mode === 'couple') {
    modePill.textContent = 'COUPLE DETECTED';
    multiPersonBanner.hidden = false;
    auxCard.hidden = true;

    $('groupModeTitle').textContent = 'COUPLE PRESENCE · ROMANTIC HARMONY';
    $('groupEnergyTag').textContent = 'ROMANTIC HARMONY';
    $('groupDetailsText').textContent = 'Romantic couple presence detected in frame · Automatically selecting matching romantic soundtrack';
  } else if (mode === 'group') {
    modePill.textContent = 'FRIEND GROUP';
    multiPersonBanner.hidden = false;
    auxCard.hidden = false;

    // Differentiate group metadata and vibe based on the squad's dominant aesthetic
    const squadAesthetic = computedVibe.dominantVibe;
    if (squadAesthetic === 'PLAYFUL') {
      latestVibeVector = { energy: 94, edge: 65, playful: 96, dreamy: 25, classy: 30, street: 86, dominantVibe: 'PLAYFUL', secondaryVibes: ['VIRAL HYPE', 'PARTY SWAGGER'] };
      $('groupModeTitle').textContent = 'FRIEND GROUP · PARTY ENSEMBLE';
      $('groupEnergyTag').textContent = 'PARTY SWAGGER (94% ENERGY)';
      $('groupDetailsText').textContent = 'Vibrant & colorful squad detected · Playing viral party bangers (Illuminati, Badtameez Dil, Tauba Tauba, Manavalan Thug)';
    } else if (squadAesthetic === 'EDGY') {
      latestVibeVector = { energy: 97, edge: 95, playful: 20, dreamy: 15, classy: 25, street: 96, dominantVibe: 'EDGY', secondaryVibes: ['DARK RAGE', 'MASS POWER'] };
      $('groupModeTitle').textContent = 'FRIEND GROUP · MASS POWER & RAGE';
      $('groupEnergyTag').textContent = 'RAW MASS VELOCITY (97% ENERGY)';
      $('groupDetailsText').textContent = 'Intense dark drip squad detected · Playing mass power & bass anthems (Big Dawgs, Kuthanthram, Starboy, FE!N, Thee Thalapathy)';
    } else if (squadAesthetic === 'CLASSY' || squadAesthetic === 'DREAMY') {
      latestVibeVector = { energy: 78, edge: 45, playful: 60, dreamy: 75, classy: 82, street: 52, dominantVibe: 'CLASSY', secondaryVibes: ['COLLEGE FLOW', 'CHILL SQUAD'] };
      $('groupModeTitle').textContent = 'FRIEND GROUP · COLLEGE CREW & CHILL';
      $('groupEnergyTag').textContent = 'CAMPUS VIBE (78% ENERGY)';
      $('groupDetailsText').textContent = 'Casual friend group detected · Playing college campus melodies & soulful chill beats (Darshana, Kabira, Ghungroo, Kesariya)';
    } else {
      latestVibeVector = { energy: 93, edge: 86, playful: 50, dreamy: 20, classy: 35, street: 95, dominantVibe: 'STREET', secondaryVibes: ['ANTHEM FLOW', 'STREET FLEX'] };
      $('groupModeTitle').textContent = 'FRIEND GROUP · STREET ENSEMBLE';
      $('groupEnergyTag').textContent = 'STREET ANTHEM ENERGY (93%)';
      $('groupDetailsText').textContent = 'Urban streetwear gang detected · Playing high-swagger anthems (Not Like Us, Pala Palli, Cheques, Aadharanjali)';
    }

    // Compute group metrics & AUX winner
    const dummyPeople: PersonAnalysis[] = [
      { id: 1, clothingType: 'Street Tee', clothingStyle: squadAesthetic, clothingPattern: 'Graphic', clothingColors: latestColorAnalysis, graphics: [graphicCue], hairstyle: 'Fade', glasses: 'Shades', accessories, heldObjects: objects, expression: 'Hype', aesthetic: squadAesthetic, vibeDimensions: { ...latestVibeVector, energy: 96 } },
      { id: 2, clothingType: 'Casual Hoodie', clothingStyle: 'Playful', clothingPattern: 'Plain', clothingColors: latestColorAnalysis, graphics: [], hairstyle: 'Curls', glasses: 'None', accessories: [], heldObjects: [], expression: 'Smile', aesthetic: 'PLAYFUL', vibeDimensions: { ...latestVibeVector, energy: 88 } },
      { id: 3, clothingType: 'Puffer & Chains', clothingStyle: 'Edgy', clothingPattern: 'Graphic', clothingColors: latestColorAnalysis, graphics: [graphicCue], hairstyle: 'Cap', glasses: 'Shades', accessories, heldObjects: objects, expression: 'Swagger', aesthetic: 'RAW EDGY', vibeDimensions: { ...latestVibeVector, energy: 98 } },
    ];

    const groupResult = vibeEngine.computeGroupAnalysis(dummyPeople);
    $('auxWinnerPerson').textContent = `${groupResult.auxWinner.personLabel} (Energy: ${groupResult.auxWinner.energyScore}%)`;
    $('auxWinnerReason').textContent = groupResult.auxWinner.reason;
  } else if (mode === 'trio') {
    modePill.textContent = 'TRIO SQUAD';
    multiPersonBanner.hidden = false;
    auxCard.hidden = true;
    latestVibeVector = { ...computedVibe, energy: 92, street: 92, dominantVibe: 'STREET', secondaryVibes: ['TRIO CREW'] };

    $('groupModeTitle').textContent = 'TRIO SQUAD DETECTED';
    $('groupEnergyTag').textContent = 'TRIO CREW FLOW';
    $('groupDetailsText').textContent = 'Three friends posing together · Queuing trio banger flow (Jaada, Illuminati, Mirchi, Pala Palli)';
  } else if (mode === 'duo') {
    modePill.textContent = 'DUO DETECTED';
    multiPersonBanner.hidden = false;
    auxCard.hidden = true;
    latestVibeVector = { ...computedVibe, energy: 90, street: 94, dominantVibe: 'STREET', secondaryVibes: ['DUO COLLAB'] };

    $('groupModeTitle').textContent = 'DUO FRIENDS DETECTED';
    $('groupEnergyTag').textContent = 'DUO COLLAB FLOW';
    $('groupDetailsText').textContent = 'Two friends detected · Playing synchronized collab tracks & viral beats (Jaada, Tauba Tauba, Starboy, Cheques)';
  } else {
    modePill.textContent = 'SOLO SUBJECT';
    multiPersonBanner.hidden = true;
    auxCard.hidden = true;
  }

  // Update Vibe Mirror meters
  updateVibeMirror(latestVibeVector, latestColorAnalysis);

  // Update Live Detectors Strip
  const detMode = $('detMode');
  if (detMode) detMode.textContent = mode === 'couple' ? 'Couple' : mode === 'group' ? 'Squad Group' : mode === 'trio' ? 'Trio Friends' : mode === 'duo' ? 'Duo Friends' : 'Solo Subject';
  const detStyle = $('detStyle');
  if (detStyle) detStyle.textContent = computedVibe.dominantVibe;
  const detColors = $('detColors');
  if (detColors) detColors.textContent = latestColorAnalysis[0]?.name || 'Dark Mono';
  const detText = $('detText');
  if (detText) {
    if (textToUse) {
      detText.textContent = `"${textToUse.rawText}"`;
    } else if (patternLabel.includes('floral')) {
      detText.textContent = 'Floral Motif';
    } else if (patternLabel.includes('check') || patternLabel.includes('plaid')) {
      detText.textContent = 'Plaid Check';
    } else if (patternLabel.includes('strip')) {
      detText.textContent = 'Striped Motif';
    } else if (graphicLabel.includes('flame')) {
      detText.textContent = 'Flame Graphic';
    } else if (graphicLabel.includes('racing')) {
      detText.textContent = 'Racing Motif';
    } else if (patternLabel.includes('embroidery') || graphicLabel.includes('traditional')) {
      detText.textContent = 'Embroidery';
    } else if (patternLabel.includes('graphic')) {
      detText.textContent = 'Graphic Art';
    } else {
      detText.textContent = 'Clean Fit';
    }
  }
  const detAcc = $('detAcc');
  if (detAcc) detAcc.textContent = accessories[0]?.name || 'Clean Stance';
  const detVibe = $('detVibe');
  if (detVibe) detVibe.textContent = `${computedVibe.energy}% Velocity`;

  // Rank songs according to vibe compatibility and social mode / t-shirt word & language filter
  const { ranked } = musicEngine.rankTracksByVibe(
    latestVibeVector,
    musicEngine.getHistory(),
    isRouletteActive,
    forcedSongId,
    mode,
    currentLanguageFilter
  );
  const topSong = ranked[0];

  // Badges list for UI
  const cueBadges: string[] = [
    `◈ Social Mode: ${mode.toUpperCase()}`,
    `◈ Style: ${computedVibe.dominantVibe}`,
    `◌ Colors: ${latestColorAnalysis.map((c) => c.name).join(', ')}`,
    `▦ Pattern: ${patternCue.name}`,
    `⌁ Specs: ${eyewearLabel.includes('sunglasses') ? 'Sunglasses' : eyewearLabel.includes('eyeglasses') ? 'Glasses' : 'Natural Look'}`,
    `⌚ Acc: ${accessories.map((a) => a.name).join(', ') || 'Clean'}`,
  ];

  if (textToUse) {
    cueBadges.push(`📝 "${textToUse.rawText}" [${textToUse.semanticSignal}]`);
  }

  const vibeTitle = mode === 'couple'
    ? 'Couple Romantic Harmony'
    : mode === 'group'
    ? 'Friend Group / Squad Ensemble'
    : mode === 'trio'
    ? 'Trio Squad Flow'
    : mode === 'duo'
    ? 'Duo Friends Collab'
    : `${topSong.genre} · ${computedVibe.dominantVibe}`;

  const vibeDesc = mode === 'couple'
    ? `Romantic aesthetic detected. Pairing with romantic melodies across Malayalam, Tamil, Hindi & Global sounds.`
    : mode === 'group'
    ? `Squad presence detected. High-energy anthems & party bangers matching your group vibe.`
    : mode === 'trio'
    ? `Three friends detected. Playing hard-hitting squad bangers & upbeat tracks.`
    : mode === 'duo'
    ? `Two friends detected. Playing synchronized collab tracks & viral beats.`
    : `Tailored soundtrack based on ${latestColorAnalysis[0]?.name} fit, observed accessories & ${computedVibe.energy}% energy score.`;

  renderSoundtrack(vibeTitle, vibeDesc, topSong.emoji, cueBadges, ranked, textToUse?.rawText);

  // Auto-play top matched song ONLY after scan is 100% finished (when forcePlay is explicitly true)
  if (topSong) {
    if (forcePlay && autoPlayEnabled) {
      playSongInSite(topSong, true);
    } else {
      // Keep track primed in ready state if not playing
      if (!audioPlayer.getIsPlaying() && !currentSong) {
        playSongInSite(topSong, false);
      }
    }
  }

  lastChangeTimestamp = Date.now();
}

// =========================================================
// TIMELINE MODAL
// =========================================================

function addTimelineEntry(song: MusicTrack, vibe: VibeVector) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const entry: VibeHistoryEntry = {
    id: `tl-${Date.now()}`,
    timestamp: time,
    vibeTitle: vibe.dominantVibe,
    dominantVibe: vibe.dominantVibe,
    songTitle: song.title,
    songArtist: song.artist,
    mode: currentPeopleMode,
    keyCues: [song.genre, `${vibe.energy}% Energy`],
  };

  vibeHistory = [entry, ...vibeHistory.slice(0, 19)];
}

function renderTimelineModal() {
  const container = $('timelineList');
  if (!container) return;

  if (vibeHistory.length === 0) {
    container.innerHTML = `<p style="color: #92a498; font-size: 13px;">No major vibe transitions logged yet. Scan a look to begin.</p>`;
    return;
  }

  container.innerHTML = vibeHistory
    .map(
      (entry) => `
      <div class="timeline-item">
        <span class="t-time">${entry.timestamp}</span>
        <div class="t-info">
          <strong>${entry.vibeTitle} · ${entry.mode.toUpperCase()} MODE</strong>
          <small>🎵 Soundtrack: ${entry.songTitle} (${entry.songArtist})</small>
        </div>
      </div>
    `
    )
    .join('');
}

$('closeTimelineBtn').onclick = () => ($('timelineModal').hidden = true);

// =========================================================
// T-SHIRT TEXT-TO-MUSIC SCANNER & WORD MATCHING
// =========================================================

// Banner dismiss button
const dismissTShirtBanner = $('dismissTShirtBanner');
if (dismissTShirtBanner) {
  dismissTShirtBanner.onclick = () => {
    const banner = $('tshirtMatchBanner');
    if (banner) banner.hidden = true;
  };
}


// Predefined Scene Presets (for testing & demo scenarios)
function applyDemoPreset(preset: string, autoPlay: boolean = false) {
  switch (preset) {
    case 'couple':
      latestDetectedText = null;
      processAnalysisResults(
        {
          peopleCountCue: { label: 'a romantic couple hugging or standing close together' },
          styleCue: { label: 'dreamy pastel soft aesthetic clothing' },
          patternCue: { label: 'plain solid color' },
          graphicCue: { label: 'soft botanical flowers roses' },
          accessoryCue: { label: 'wearing wristwatch' },
          objectCue: { label: 'hands empty' },
          expressionCue: { label: 'big cheerful happy smile' },
          eyewearCue: { label: 'without glasses' },
        },
        'couple',
        null,
        autoPlay
      );
      break;

    case 'gang':
    case 'group':
      latestDetectedText = null;
      processAnalysisResults(
        {
          peopleCountCue: { label: 'a large friend group or squad gang standing together' },
          styleCue: { label: 'streetwear urban fashion outfit with graphic tee' },
          patternCue: { label: 'large graphic illustration' },
          graphicCue: { label: 'fire flames aggressive intense graphics' },
          accessoryCue: { label: 'wearing metal chain necklace' },
          objectCue: { label: 'holding drink cup' },
          expressionCue: { label: 'confident hip-hop swagger' },
          eyewearCue: { label: 'dark sunglasses' },
        },
        'group',
        null,
        autoPlay
      );
      break;

    case 'trio':
      latestDetectedText = null;
      processAnalysisResults(
        {
          peopleCountCue: { label: 'a group of three friends or trio posing together' },
          styleCue: { label: 'streetwear urban fashion outfit' },
          patternCue: { label: 'typography text slogans' },
          graphicCue: { label: 'racing cars speed graphics' },
          accessoryCue: { label: 'wearing baseball cap' },
          objectCue: { label: 'smartphone' },
          expressionCue: { label: 'excited energetic hype' },
          eyewearCue: { label: 'dark sunglasses' },
        },
        'trio',
        null,
        autoPlay
      );
      break;

    case 'duo':
      latestDetectedText = null;
      processAnalysisResults(
        {
          peopleCountCue: { label: 'two friends or homies posing together' },
          styleCue: { label: 'streetwear urban fashion outfit' },
          patternCue: { label: 'plain solid color' },
          graphicCue: { label: 'plain clothing' },
          accessoryCue: { label: 'wearing dark sunglasses' },
          objectCue: { label: 'smartphone' },
          expressionCue: { label: 'confident hip-hop swagger' },
          eyewearCue: { label: 'dark sunglasses' },
        },
        'duo',
        null,
        autoPlay
      );
      break;

    case 'street':
      latestDetectedText = null;
      processAnalysisResults(
        {
          peopleCountCue: { label: 'a single individual person standing alone' },
          styleCue: { label: 'streetwear urban fashion outfit' },
          patternCue: { label: 'graphic print' },
          graphicCue: { label: 'racing graphics' },
          accessoryCue: { label: 'metal chain necklace' },
          objectCue: { label: 'smartphone' },
          expressionCue: { label: 'confident swagger' },
          eyewearCue: { label: 'dark sunglasses' },
        },
        'one',
        null,
        autoPlay
      );
      break;

    case 'ocr':
      const ocr = interpretTextSemantics('CHEQUES');
      latestDetectedText = ocr;
      processAnalysisResults(
        {
          peopleCountCue: { label: 'a single individual person standing alone' },
          styleCue: { label: 'streetwear urban fashion outfit' },
          patternCue: { label: 'typography text slogans' },
          graphicCue: { label: 'typography slogan' },
          accessoryCue: { label: 'wearing dark sunglasses' },
          objectCue: { label: 'smartphone' },
          expressionCue: { label: 'confident swagger' },
          eyewearCue: { label: 'dark sunglasses' },
        },
        'one',
        ocr,
        autoPlay
      );
      break;

    default:
      latestDetectedText = null;
      processAnalysisResults(
        {
          peopleCountCue: { label: 'a single individual person standing alone' },
          styleCue: { label: 'streetwear urban fashion outfit' },
          patternCue: { label: 'plain solid color' },
          graphicCue: { label: 'plain clothing' },
          accessoryCue: { label: 'no visible accessories' },
          objectCue: { label: 'hands empty' },
          expressionCue: { label: 'confident swagger' },
          eyewearCue: { label: 'without glasses' },
        },
        'one',
        null,
        autoPlay
      );
      break;
  }
}

// Vibe Roulette Button
$('rouletteButton').onclick = () => {
  isRouletteActive = !isRouletteActive;
  $('rouletteButton').classList.toggle('active', isRouletteActive);
  showToast(isRouletteActive ? '🎰 Vibe Roulette ACTIVE: Surprise tracks unlocked!' : '🎰 Vibe Roulette OFF');

  const { ranked } = musicEngine.rankTracksByVibe(
    latestVibeVector,
    musicEngine.getHistory(),
    isRouletteActive,
    undefined,
    currentPeopleMode,
    currentLanguageFilter
  );
  if (ranked[0]) {
    renderSoundtrack(
      $('vibeName').textContent || 'Your Sound',
      $('vibeDescription').textContent || '',
      ranked[0].emoji,
      Array.from(document.querySelectorAll('#cueChips span')).map((s) => s.textContent || ''),
      ranked,
      latestDetectedText?.rawText
    );
    if (autoPlayEnabled) playSongInSite(ranked[0], true);
  }
};

// =========================================================
// RESET & STANDBY LOGIC
// =========================================================

function resetForNewPerson() {
  if (scanSafetyTimeoutId) {
    window.clearTimeout(scanSafetyTimeoutId);
    scanSafetyTimeoutId = null;
  }
  isScanning = false;
  locked = false;
  pauseCurrentPlayback();

  image.hidden = true;
  image.src = '';
  const fileInput = $('imageInput') as HTMLInputElement;
  if (fileInput) fileInput.value = '';

  if (!stream) {
    startCamera();
  } else {
    $('cameraEmpty').hidden = true;
    $('cameraHud').hidden = false;
  }

  currentPeopleMode = 'one';
  $('peopleModePill').textContent = '1 PERSON DETECTED';
  $('multiPersonBanner').hidden = true;
  $('auxWinnerCard').hidden = true;
  $('itemChangedBanner').hidden = true;

  if ($('vibeName')) $('vibeName').textContent = 'Ready for new person';
  if ($('vibeDescription')) $('vibeDescription').textContent = 'Position the new person in front of camera and click Scan this look.';
  if ($('vibeOrb')) $('vibeOrb').textContent = '✦';
  if ($('cueChips')) $('cueChips').innerHTML = '<span>ready to scan</span><span>new person ready</span>';

  $('nowPlayingTitle').textContent = 'Music stopped';
  $('nowPlayingArtist').textContent = 'Scan new person to trigger tailored soundtrack';
  $('playerStatusText').textContent = 'Standby / Ready for scan';
  $('playerLiveDot').className = 'live-dot';
  $('audioVisualizer').classList.remove('playing');

  hideStatus();
  currentSong = null;
  latestDetectedText = null;

  showToast('✦ Song stopped & reset — Ready for new person!');
}

$('resetButton').onclick = resetForNewPerson;
$('resetControlBtn').onclick = resetForNewPerson;

$('startCamera').onclick = startCamera;
$('stopCamera').onclick = () => {
  stopCamera();
  $('cameraEmpty').hidden = false;
};
$('scanButton').onclick = () => scan(true);

$('flipCamera').onclick = () => {
  facing = facing === 'user' ? 'environment' : 'user';
  startCamera();
  showToast(facing === 'user' ? 'Front camera active' : 'Rear camera active');
};

$('imageInput').onchange = (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  stopCamera();
  image.onload = () => {
    image.hidden = false;
    $('cameraEmpty').hidden = true;
    $('cameraHud').hidden = false;
    scan(true);
  };
  image.src = URL.createObjectURL(file);
};

const lockBtn = $('lockVibe');
if (lockBtn) {
  lockBtn.onclick = () => {
    locked = !locked;
    showToast(locked ? 'Vibe locked. Your pattu stays.' : 'Vibe unlocked.');
  };
}

$('anotherSong').onclick = () => {
  if (currentPlaylist.length === 0) return showToast('Scan a look first.');
  currentPlaylist.push(currentPlaylist.shift()!);
  const topSong = currentPlaylist[0];
  renderSoundtrack(
    topSong ? `${topSong.genre} · ${topSong.vibeTag}` : 'Your Sound',
    topSong?.bestFit || '',
    topSong?.emoji || '✦',
    [topSong?.genre || 'Soundtrack', topSong?.language || 'Global', topSong?.vibeTag || 'Vibe'],
    currentPlaylist,
    latestDetectedText?.rawText
  );
  if (autoPlayEnabled && currentPlaylist[0]) {
    playSongInSite(currentPlaylist[0], true);
  }
};

// =========================================================
// NAVIGATION & MODALS
// =========================================================

document.querySelectorAll<HTMLElement>('[data-page]').forEach((button) => {
  button.onclick = () => {
    const page = button.dataset.page;
    document.querySelectorAll<HTMLElement>('[data-page]').forEach((item) => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    if (page === 'gallery') $('imageInput').click();
    if (page === 'timeline') {
      renderTimelineModal();
      $('timelineModal').hidden = false;
    }
    if (page === 'settings') {
      $('settingsModal').hidden = false;
    }
  };
});

// Settings Modal
function setupSettings() {
  const modal = $('settingsModal');
  const apiKeyInput = $('spotifyApiKeyInput') as HTMLInputElement;
  const peekBtn = $('peekApiKey');
  const autoPlayToggle = $('autoPlayToggle') as HTMLInputElement;
  const saveBtn = $('saveSettingsBtn');
  const closeBtn = $('closeSettings');

  const savedKey = localStorage.getItem('spotify_soloist_key') || '';
  const savedAutoPlay = localStorage.getItem('spotify_autoplay') !== 'false';
  apiKeyInput.value = savedKey;
  userApiKey = savedKey;
  autoPlayToggle.checked = savedAutoPlay;
  autoPlayEnabled = savedAutoPlay;

  peekBtn.onclick = () => {
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      peekBtn.textContent = '🔒';
    } else {
      apiKeyInput.type = 'password';
      peekBtn.textContent = '👁';
    }
  };

  saveBtn.onclick = () => {
    userApiKey = apiKeyInput.value.trim();
    autoPlayEnabled = autoPlayToggle.checked;
    localStorage.setItem('spotify_soloist_key', userApiKey);
    localStorage.setItem('spotify_autoplay', String(autoPlayEnabled));
    modal.hidden = true;
    showToast('Settings saved ✦ Spotify Premium ready');
  };

  closeBtn.onclick = () => (modal.hidden = true);
  modal.onclick = (e) => {
    if (e.target === modal) modal.hidden = true;
  };
}

// Spotify IFrame Controller Setup
function setupSpotifyIFrame() {
  const onReady = (IFrameAPI: any) => {
    window.SpotifyIFrameAPI = IFrameAPI;
    const element = document.getElementById('spotifyEmbed');
    if (!element) return;

    const initialTrack = VERIFIED_TRACK_CATALOG[0];
    const options = {
      width: '100%',
      height: '80',
      uri: `spotify:track:${initialTrack.spotifyId}`,
    };

    IFrameAPI.createController(element, options, (controller: SpotifyEmbedController) => {
      embedController = controller;

      controller.addListener('playback_update', (e: any) => {
        const visualizer = $('audioVisualizer');
        const liveDot = $('playerLiveDot');
        if (e.data?.isPaused) {
          visualizer.classList.remove('playing');
          liveDot.classList.remove('active');
          $('playerStatusText').textContent = 'Paused';
        } else {
          visualizer.classList.add('playing');
          liveDot.classList.add('active');
          $('playerStatusText').textContent = 'Streaming';
        }
      });
    });
  };

  if (window.SpotifyIFrameAPI) onReady(window.SpotifyIFrameAPI);
  else window.onSpotifyIframeApiReady = onReady;
}

// Theme Toggle
function setupThemeToggle() {
  const themeBtn = $('themeButton');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('app_theme') || 'dark';

  const applyTheme = (theme: 'light' | 'dark', showNotification = false) => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeBtn.textContent = '🌙';
      themeBtn.setAttribute('title', 'Switch to Dark mode');
      if (showNotification) showToast('✦ Light theme enabled ☼');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeBtn.textContent = '☼';
      themeBtn.setAttribute('title', 'Switch to Light mode');
      if (showNotification) showToast('✦ Dark theme enabled ☾');
    }
    localStorage.setItem('app_theme', theme);
  };

  applyTheme(savedTheme as 'light' | 'dark', false);

  themeBtn.onclick = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    applyTheme(isLight ? 'dark' : 'light', true);
  };
}

// Regional Language Filter Setup
function setupLanguageFilter() {
  const chips = document.querySelectorAll<HTMLElement>('.lang-chip');
  chips.forEach((chip) => {
    chip.onclick = () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentLanguageFilter = chip.dataset.lang || 'all';

      const { ranked } = musicEngine.rankTracksByVibe(
        latestVibeVector,
        musicEngine.getHistory(),
        isRouletteActive,
        undefined,
        currentPeopleMode,
        currentLanguageFilter
      );

      if (ranked[0]) {
        renderSoundtrack(
          $('vibeName')?.textContent || 'Your Sound',
          $('vibeDescription')?.textContent || '',
          ranked[0].emoji,
          Array.from(document.querySelectorAll('#cueChips span')).map((s) => s.textContent || ''),
          ranked,
          latestDetectedText?.rawText
        );
        showToast(`Filtered by ${chip.textContent}: Top match is "${ranked[0].title}" (${ranked[0].language})`);
      }
    };
  });
}

// Initial Boot Sequence
setupThemeToggle();
setupSpotifyIFrame();
setupSettings();
setupLanguageFilter();

// Render initial state silently in ready mode (does not play audio until scan or user play)
applyDemoPreset('street', false);
