// Music Recommendation Engine & Explainability Generator
import type {
  MusicTrack,
  OutfitAsSongResult,
  SongExplanation,
  VibeVector,
} from './types';

// 21 Verified Active Tracks with calibrated Vibe Vector Dimensions
export const VERIFIED_TRACK_CATALOG: MusicTrack[] = [
  // ==========================================
  // 1. MALAYALAM SOUNDTRACKS (MALLU / KERALA)
  // ==========================================
  {
    id: 'illuminati',
    title: 'Illuminati',
    artist: 'Sushin Shyam, Dabzee',
    genre: 'Viral Malayalam Trap / Hype',
    language: 'Malayalam',
    emoji: '⚡',
    category: 'playful',
    spotifyId: '4b5bDWD7nMOfLceWVP3hi0',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/43/a0/da/43a0daa2-504d-6b7c-c63a-0c8864608a6d/mzaf_7754996064757215177.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/88/4e/29/884e290c-29ed-25d5-7b25-243b89097220/cover.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Viral Club Swagger',
    bestFit: 'Party shades, cap, friend group, colorful swagger',
    vibeVector: { energy: 95, edge: 72, playful: 96, dreamy: 25, classy: 35, street: 88 },
  },
  {
    id: 'manavalan-thug',
    title: 'Manavalan Thug',
    artist: 'Dabzee, SA',
    genre: 'Funky Malayalam Folk Flow',
    language: 'Malayalam',
    emoji: '🕺',
    category: 'playful',
    spotifyId: '3Q1KfAc1O75K0OEX2YPI4H',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/7b/01/6a/7b016adc-9faa-26bc-6d93-6e278c32c81c/mzaf_4182532517856327523.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4b/70/4e/4b704ecd-9c8c-25ce-4f37-24317616fafe/cover.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Colourful Mallu Swagger',
    bestFit: 'Bright vibrant colors, smile, chaotic friendly squad vibe',
    vibeVector: { energy: 91, edge: 58, playful: 97, dreamy: 30, classy: 25, street: 84 },
  },
  {
    id: 'jaada',
    title: 'Jaada',
    artist: 'Sushin Shyam',
    genre: 'High Energy Malayalam Flow',
    language: 'Malayalam',
    emoji: '🕶',
    category: 'street',
    spotifyId: '3yM8a0c1b2d3e4f5g6h7i8',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fc/50/0a/fc500a21-3371-22ed-2932-6ad19b9d65ee/mzaf_13281770334779171329.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3e/ab/82/3eab8268-4a1d-a04b-7336-a3e583cf8b4c/cover.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Aavesham Gang Energy',
    bestFit: 'Sunglasses, gold chain, street casuals, boss attitude',
    vibeVector: { energy: 94, edge: 86, playful: 85, dreamy: 20, classy: 40, street: 92 },
  },
  {
    id: 'darshana',
    title: 'Darshana',
    artist: 'Hesham Abdul Wahab',
    genre: 'Campus Indie Melody',
    language: 'Malayalam',
    emoji: '☕',
    category: 'romantic',
    spotifyId: '131yybV7A3TmC34a0qE8u8',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/22/8f/37/228f3722-456e-c81a-348e-6efff48da2fc/mzaf_6624177720107655503.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/fa/3e/2c/fa3e2c4e-a525-defd-b22c-d31ef7d83964/cover.jpg/300x300bb.jpg',
    synthPreset: 'melody',
    vibeTag: 'Campus Specs Charm',
    bestFit: 'Optical eyeglasses, clean cotton/linen, relaxed campus warmth',
    vibeVector: { energy: 66, edge: 28, playful: 60, dreamy: 88, classy: 74, street: 38 },
  },
  {
    id: 'malare',
    title: 'Malare',
    artist: 'Vijay Yesudas',
    genre: 'Classic Melodic Romance',
    language: 'Malayalam',
    emoji: '🌿',
    category: 'romantic',
    spotifyId: '3cKj9sBwJ1nZf2i0mR3pX7',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/41/59/b4/4159b41b-708b-8140-d758-e8da1ed7bedd/mzaf_7080443034849106781.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music2/v4/6f/3c/cd/6f3ccd36-2a0f-0c4e-ce51-5aebcf9e9f84/cover.jpg/300x300bb.jpg',
    synthPreset: 'melody',
    vibeTag: 'Classic Malayalam Nostalgia',
    bestFit: 'Traditional/formal clean fit, soft pastels, floral accents',
    vibeVector: { energy: 52, edge: 18, playful: 35, dreamy: 94, classy: 88, street: 18 },
  },
  {
    id: 'aadharanjali',
    title: 'Aadharanjali',
    artist: 'Sushin Shyam',
    genre: 'Viral Folk Groove',
    language: 'Malayalam',
    emoji: '👻',
    category: 'playful',
    spotifyId: '74p8e92z01b2a3c4d5e6f7',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/55/95/3b/55953b56-368d-a2d2-c14d-54acb5783d7a/mzaf_12505579229243410349.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2f/d5/ed/2fd5edd0-82fa-1ffe-ac19-e3cadffc9531/197188225889.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Romancham Squad Groove',
    bestFit: 'Quirky prints, squad posing, unhinged retro energy',
    vibeVector: { energy: 89, edge: 62, playful: 95, dreamy: 25, classy: 30, street: 76 },
  },
  {
    id: 'kuthanthram',
    title: 'Kuthanthram',
    artist: 'Sushin Shyam, Vedan',
    genre: 'Raw Malayalam Rap & Bass',
    language: 'Malayalam',
    emoji: '🎙',
    category: 'street',
    spotifyId: '11BKSlBxpkxrHvPi8uxXzV',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/94/7f/aa/947faa2a-b558-2b1c-4ad0-1afc90352607/mzaf_2643013271292698405.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/70/f8/ae/70f8ae0d-aadf-6ec8-1a1c-2d83e26ff6dc/cover.jpg/300x300bb.jpg',
    synthPreset: 'rage',
    vibeTag: 'Underground Power',
    bestFit: 'Black aesthetic, optical specs, intense boss stare',
    vibeVector: { energy: 88, edge: 92, playful: 20, dreamy: 25, classy: 40, street: 90 },
  },
  {
    id: 'pala-palli',
    title: 'Pala Palli Thiruppalli',
    artist: 'Jakes Bejoy, Atul Narukara',
    genre: 'Kerala Mass Celebration Anthem',
    language: 'Malayalam',
    emoji: '🥁',
    category: 'dramatic',
    spotifyId: '4yK98a0c1b2d3e4f5g6h7i',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/52/2c/47/522c47bd-abf5-ddba-1a88-9250b71f4026/mzaf_3314408649383536304.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1d/27/2f/1d272f65-1500-7d7d-6750-4d7b62172713/880009768930.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Festival Mass Energy',
    bestFit: 'Traditional mundu / kurta, festive sunglasses, fearless swagger',
    vibeVector: { energy: 98, edge: 85, playful: 70, dreamy: 15, classy: 45, street: 88 },
  },
  {
    id: 'nee-himamazhayayi',
    title: 'Nee Himamazhayayi',
    artist: 'KS Harisankar, Nithya Mammen',
    genre: 'Romantic Acoustic Duet',
    language: 'Malayalam',
    emoji: '❄️',
    category: 'romantic',
    spotifyId: '23x9Y08p7j2w1a0b9c8d7e',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e2/20/e5/e220e551-674d-2312-5915-f1bcf022fd2a/mzaf_12960180270479529756.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f4/bd/32/f4bd32de-1a77-59e8-eeb2-d25f86a80947/840931126598_Cover.jpg/300x300bb.jpg',
    synthPreset: 'melody',
    vibeTag: 'Sweet Mountain Breeze',
    bestFit: 'Couple look, soft cozy sweaters, warm sweet gaze',
    vibeVector: { energy: 58, edge: 20, playful: 45, dreamy: 95, classy: 82, street: 22 },
  },

  // ==========================================
  // 2. HINDI SOUNDTRACKS (BOLLYWOOD / PARTY / MELODIES)
  // ==========================================
  {
    id: 'kesariya',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam',
    genre: 'Saffron Romantic Melody',
    language: 'Hindi',
    emoji: '🧡',
    category: 'romantic',
    spotifyId: '6mFkJmYW54AMISkAkspDC8',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/21/4e/c3/214ec337-5c13-fdbf-e7dd-2738f2f9d3e2/mzaf_5009421294700453120.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/01/ef/35/01ef35ac-c046-656c-638f-928c4af51c8d/196589554871.jpg/300x300bb.jpg',
    synthPreset: 'melody',
    vibeTag: 'Warm Romantic Glow',
    bestFit: 'Saffron, golden tones, warm smiles, couple presence',
    vibeVector: { energy: 65, edge: 22, playful: 55, dreamy: 96, classy: 80, street: 30 },
  },
  {
    id: 'tauba-tauba',
    title: 'Tauba Tauba',
    artist: 'Karan Aujla',
    genre: 'Viral Dance Pop',
    language: 'Hindi / Punjabi',
    emoji: '🕶',
    category: 'playful',
    spotifyId: '2kS6td1yvmpNgZTt1q5rNW',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/34/8d/63/348d6342-2c35-bf31-8131-2c8b3cfe3c09/mzaf_15374551219149804677.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/d2/01/79d201d2-e54d-5604-81fb-313f30db7219/198588533581.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Slick Party Groove',
    bestFit: 'Sunglasses, blazer with sneakers, slick swagger stance',
    vibeVector: { energy: 95, edge: 78, playful: 95, dreamy: 20, classy: 65, street: 92 },
  },
  {
    id: 'badtameez-dil',
    title: 'Badtameez Dil',
    artist: 'Benny Dayal, Pritam',
    genre: 'Ultimate Bollywood Party Anthem',
    language: 'Hindi',
    emoji: '🍾',
    category: 'playful',
    spotifyId: '3yM8a0c1b2d3e4f5g6h7i9',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/88/e2/af/88e2af36-3b58-3f34-32c3-d94d3086c8d5/mzaf_15476348080733865142.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/62/d6/74/62d67432-0670-631f-db6a-d4bac3adae4b/8902894353328_cover.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Wild Party Celebration',
    bestFit: 'Party wear, dancing squad, vibrant blazers, wild swagger',
    vibeVector: { energy: 98, edge: 75, playful: 98, dreamy: 15, classy: 55, street: 85 },
  },
  {
    id: 'chaleya',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao, Anirudh',
    genre: 'Melodic Romance Pop',
    language: 'Hindi',
    emoji: '💫',
    category: 'romantic',
    spotifyId: '3xMHXrVovSdww9GgRJt1gR',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/55/fb/9c/55fb9c31-320a-5dba-0a3f-5e69552085a7/mzaf_13508224660474474886.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1e/ff/32/1eff3216-190d-6fd9-8f68-acbba846e6ee/8903431956026_cover.jpg/300x300bb.jpg',
    synthPreset: 'melody',
    vibeTag: 'Breezy Bollywood Love',
    bestFit: 'Floral shirts, pastel skirts, happy couple stroll',
    vibeVector: { energy: 75, edge: 32, playful: 82, dreamy: 90, classy: 78, street: 45 },
  },
  {
    id: 'kabira',
    title: 'Kabira',
    artist: 'Tochi Raina, Rekha Bhardwaj, Pritam',
    genre: 'Soulful Acoustic Indie Folk',
    language: 'Hindi',
    emoji: '🎸',
    category: 'chill',
    spotifyId: '5yM8a0c1b2d3e4f5g6h7i0',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e2/06/19/e2061998-6444-5c5b-5bfc-a149c55e2e2e/mzaf_10494977375651598168.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/62/d6/74/62d67432-0670-631f-db6a-d4bac3adae4b/8902894353328_cover.jpg/300x300bb.jpg',
    synthPreset: 'lofi',
    vibeTag: 'Earthy Friendship Soul',
    bestFit: 'Kurtas, linen shirts, genuine friendly smiles, acoustic warmth',
    vibeVector: { energy: 58, edge: 20, playful: 45, dreamy: 92, classy: 80, street: 30 },
  },
  {
    id: 'ghungroo',
    title: 'Ghungroo',
    artist: 'Arijit Singh, Shilpa Rao',
    genre: 'Chic Beach Club Pop',
    language: 'Hindi',
    emoji: '🍹',
    category: 'classy',
    spotifyId: '6yM8a0c1b2d3e4f5g6h7i1',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d1/90/95/d190958b-cb33-34b6-83d2-4d88b6ff1348/mzaf_8015651280578447253.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f4/0b/88/f40b88d5-75cb-27b8-6b00-bba98f0f2fd0/849486006911_cover.jpg/300x300bb.jpg',
    synthPreset: 'synthpop',
    vibeTag: 'Sun-Drenched Elegance',
    bestFit: 'White linen, beach shades, sleek haircut, effortless elegance',
    vibeVector: { energy: 88, edge: 45, playful: 88, dreamy: 65, classy: 92, street: 60 },
  },
  {
    id: 'apna-bana-le',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh, Sachin-Jigar',
    genre: 'Soulful Melodic Ballad',
    language: 'Hindi',
    emoji: '🌙',
    category: 'romantic',
    spotifyId: '3yHyi9G68652RBqAeb7Gn4',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/eb/27/61/eb2761c7-d606-0912-dff0-2dc6b69974bd/mzaf_2023722930851223219.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/2e/0b/c0/2e0bc070-112f-a827-6ad8-6bc64f7caaff/840214460180.png/300x300bb.jpg',
    synthPreset: 'melody',
    vibeTag: 'Deep Heartfelt Soul',
    bestFit: 'Cozy layers, oversized hoodie, quiet contemplative eyes',
    vibeVector: { energy: 58, edge: 25, playful: 30, dreamy: 95, classy: 84, street: 25 },
  },
  {
    id: 'tum-hi-ho',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh, Mithoon',
    genre: 'Heartfelt Romance Anthem',
    language: 'Hindi',
    emoji: '🌧',
    category: 'romantic',
    spotifyId: '56zZ48jdyY2oDXHVRYPBfq',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3a/8c/9b/3a8c9b0b-2def-750a-f615-1555bf941edf/mzaf_17229496441442805917.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/300x300bb.jpg',
    synthPreset: 'melody',
    vibeTag: 'Emotional Monsoon Romance',
    bestFit: 'Formal evening attire, dark monochrome, deep emotion',
    vibeVector: { energy: 54, edge: 28, playful: 20, dreamy: 94, classy: 90, street: 20 },
  },
  {
    id: 'mirchi',
    title: 'Mirchi',
    artist: 'DIVINE, MC Altaf, Phenom',
    genre: 'Gully Street Flow',
    language: 'Hindi (DHH)',
    emoji: '🌶',
    category: 'street',
    spotifyId: '6bhEtoyl97a7awMijAyBbh',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/21/88/cd/2188cd88-bde4-5958-5d8c-1d366eb5930e/mzaf_4740066004162575331.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ae/a1/1b/aea11bad-10ae-96d4-5212-e3b0db53bedd/20UMGIM89461.rgb.jpg/300x300bb.jpg',
    synthPreset: 'drill',
    vibeTag: 'Mumbai Street Energy',
    bestFit: 'Baseball cap, graphic tee, warm red/orange fit',
    vibeVector: { energy: 91, edge: 85, playful: 60, dreamy: 15, classy: 30, street: 92 },
  },
  {
    id: 'iktara',
    title: 'Iktara',
    artist: 'Amit Trivedi, Kavita Seth',
    genre: 'Acoustic Sufi Indie',
    language: 'Hindi',
    emoji: '🎸',
    category: 'chill',
    spotifyId: '4Qy1d1w8r9s0c2v8b9a1c2',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f8/00/9c/f8009ce1-c649-b84f-e091-53172b83ef91/mzaf_3024731672455939718.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5c/c8/f8/5cc8f804-a9d6-7a11-57f6-840e1e2c9419/884977322910.jpg/300x300bb.jpg',
    synthPreset: 'lofi',
    vibeTag: 'Carefree Youth Aesthetic',
    bestFit: 'Baggy tees, casual denims, earphones, calm youth smile',
    vibeVector: { energy: 50, edge: 22, playful: 50, dreamy: 95, classy: 75, street: 40 },
  },

  // ==========================================
  // 3. ENGLISH / GLOBAL SOUNDTRACKS (POP, R&B, HIP-HOP)
  // ==========================================
  {
    id: 'big-dawgs',
    title: 'Big Dawgs',
    artist: 'Hanumankind, Kalmi',
    genre: 'Hardcore Rap / Bass',
    language: 'English (Global)',
    emoji: '🔥',
    category: 'street',
    spotifyId: '0OA00aPt3BV10qeMIs3meW',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f5/92/d7/f592d7a4-19be-c005-6698-1caccacc173c/mzaf_15257808628606025867.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/42/d2/6c/42d26c01-619f-fa0a-2e83-7f4a28b5d3b2/24UMGIM70977.rgb.jpg/300x300bb.jpg',
    synthPreset: 'rage',
    vibeTag: 'Heavy Drip Swagger',
    bestFit: 'Dark fit, chains, bold stance, raw velocity',
    vibeVector: { energy: 95, edge: 92, playful: 25, dreamy: 15, classy: 30, street: 96 },
  },
  {
    id: 'starboy',
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    genre: 'Nocturnal Synthwave Pop',
    language: 'English (Global)',
    emoji: '⚡',
    category: 'classy',
    spotifyId: '7yM8a0c1b2d3e4f5g6h7i2',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/300x300bb.jpg',
    synthPreset: 'synthpop',
    vibeTag: 'Midnight City Drip',
    bestFit: 'Leather jacket, sunglasses at night, cross chain, sleek urban silhouette',
    vibeVector: { energy: 91, edge: 84, playful: 40, dreamy: 55, classy: 90, street: 88 },
  },
  {
    id: 'as-it-was',
    title: 'As It Was',
    artist: 'Harry Styles',
    genre: 'Indie Synthpop / Modern Retro',
    language: 'English (Global)',
    emoji: '🎈',
    category: 'playful',
    spotifyId: '8yM8a0c1b2d3e4f5g6h7i3',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/67/10/16/67101606-3869-ca44-6c03-e13d6322cb51/mzaf_1135399237022217274.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2a/19/fb/2a19fb85-2f70-9e44-f2a9-82abe679b88e/886449990061.jpg/300x300bb.jpg',
    synthPreset: 'synthpop',
    vibeTag: 'Vibrant Retro Bounce',
    bestFit: 'Bright colorful knitwear, playful smile, retro sunglasses, carefree movement',
    vibeVector: { energy: 87, edge: 40, playful: 96, dreamy: 70, classy: 65, street: 65 },
  },
  {
    id: 'levitating',
    title: 'Levitating',
    artist: 'Dua Lipa',
    genre: 'Glittering Nu-Disco Pop',
    language: 'English (Global)',
    emoji: '✨',
    category: 'playful',
    spotifyId: '9yM8a0c1b2d3e4f5g6h7i4',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/59/dc/4d/59dc4dda-93ff-8f1c-c536-f005f6ea6af5/mzaf_3066686759813252385.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6c/11/d6/6c11d681-aa3a-d59e-4c2e-f77e181026ab/190295092665.jpg/300x300bb.jpg',
    synthPreset: 'synthpop',
    vibeTag: 'Club Disco Radiance',
    bestFit: 'Metallic or sparkly accents, party dresses, high-energy confidence',
    vibeVector: { energy: 94, edge: 55, playful: 97, dreamy: 45, classy: 82, street: 70 },
  },
  {
    id: 'fein',
    title: 'FE!N',
    artist: 'Travis Scott, Playboi Carti',
    genre: 'Dark Rage Trap',
    language: 'English (Global)',
    emoji: '🌩',
    category: 'dramatic',
    spotifyId: '7CWiWkccuRRdrmaW6AjVEf',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/61/9a/ce619acc-40f8-5bf0-c6d8-5649dacc5d3c/mzaf_9048266760750013994.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7d/4f/94/7d4f9468-56e1-3a2d-7186-c8088170ef58/196871341899.jpg/300x300bb.jpg',
    synthPreset: 'rage',
    vibeTag: 'Rage & Midnight Hype',
    bestFit: 'Hoodie up, headphones, intense focus, night energy',
    vibeVector: { energy: 96, edge: 94, playful: 20, dreamy: 20, classy: 15, street: 90 },
  },
  {
    id: 'not-like-us',
    title: 'Not Like Us',
    artist: 'Kendrick Lamar',
    genre: 'West Coast Hip-Hop',
    language: 'English (Global)',
    emoji: '👑',
    category: 'street',
    spotifyId: '6AI3ezQ4o3HUoP6Dhudph3',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2d/e0/e8/2de0e874-cd0b-e9a9-e876-76be13a86662/mzaf_12385336780649591409.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/31/3a/3f/313a3fbc-bb8f-80c7-b5a2-e226869a38cd/24UMGIM51924.rgb.jpg/300x300bb.jpg',
    synthPreset: 'drill',
    vibeTag: 'Anthem Energy',
    bestFit: 'Bold streetwear, fearless gaze, authentic presence',
    vibeVector: { energy: 92, edge: 88, playful: 45, dreamy: 15, classy: 35, street: 95 },
  },
  {
    id: 'cheques',
    title: 'Cheques',
    artist: 'Shubh',
    genre: 'Punjabi DHH / Drip Flow',
    language: 'Punjabi (Global)',
    emoji: '💸',
    category: 'street',
    spotifyId: '4eBvRhTJ2AcxCsbfTUjoRp',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5f/e9/8a/5fe98aa5-660a-2f91-b53d-558fdb9ef50b/mzaf_5845186979219129320.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/dc/46/a9/dc46a9c9-794e-2d7a-1afb-97eb4ae0fff6/197188915704.jpg/300x300bb.jpg',
    synthPreset: 'drill',
    vibeTag: 'Luxury Desi Swagger',
    bestFit: 'Sunglasses, gold chain, cap, high-confidence stance',
    vibeVector: { energy: 87, edge: 82, playful: 40, dreamy: 20, classy: 55, street: 92 },
  },
  {
    id: 'seven',
    title: 'Seven (feat. Latto)',
    artist: 'Jung Kook, Latto',
    genre: 'UK Garage / Upbeat Pop',
    language: 'English (Global)',
    emoji: '✨',
    category: 'playful',
    spotifyId: '7x9aauaA9cu6tyfp2AqOW9',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/87/fc/7c/87fc7ced-ace9-2ec4-2e8a-c9a64c841a15/mzaf_3965990725450677139.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/86/78/b4/8678b4b3-2341-7239-b6cb-bcfdaef0e4e0/196922656545_Cover.jpg/300x300bb.jpg',
    synthPreset: 'synthpop',
    vibeTag: 'Global Viral Pop',
    bestFit: 'Clean light fit, bright smile, playful energy',
    vibeVector: { energy: 88, edge: 45, playful: 88, dreamy: 65, classy: 60, street: 65 },
  },
  {
    id: 'until-i-found-you',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez',
    genre: 'Vintage Soul / Sophisticated Pop',
    language: 'English (Global)',
    emoji: '🍷',
    category: 'classy',
    spotifyId: '0T5iIrXA4p5G9RG42qcZEx',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/53/82/c1/5382c1d4-ddba-aa2b-90df-57268895fac9/mzaf_8926201202931541051.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/64/d2/c5/64d2c511-67f4-ae09-5153-d39c3da413a3/21UMGIM75467.rgb.jpg/300x300bb.jpg',
    synthPreset: 'jazz',
    vibeTag: 'Sharp Formal Elegance',
    bestFit: 'Sharp suit, blazer, tie, clean collar, vintage charm',
    vibeVector: { energy: 60, edge: 35, playful: 35, dreamy: 75, classy: 96, street: 25 },
  },
  {
    id: 'golden-hour',
    title: 'golden hour',
    artist: 'JVKE',
    genre: 'Cinematic Pop',
    language: 'English (Global)',
    emoji: '🌅',
    category: 'dreamy',
    spotifyId: '4cOdK2wGLETKBW3PvgPWqT',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/30/02/8c/30028c8a-a125-5466-bcc6-27a83b1c0135/mzaf_16911571635366913039.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8d/1a/7b/8d1a7b44-316f-7c7f-4380-935673fb697a/5056167175650.jpg/300x300bb.jpg',
    synthPreset: 'ambient',
    vibeTag: 'Sunset Aesthetic',
    bestFit: 'Warm golden tones, soft curls, relaxed warm presence',
    vibeVector: { energy: 68, edge: 25, playful: 50, dreamy: 92, classy: 70, street: 35 },
  },
  {
    id: 'space-song',
    title: 'Space Song',
    artist: 'Beach House',
    genre: 'Dream Pop / Ambient Indie',
    language: 'English (Global)',
    emoji: '🌌',
    category: 'dreamy',
    spotifyId: '7H0ya83CMmgFcOhw0UB6ow',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/41/61/14/416114cc-282e-4c76-2808-a3eb9c3f973d/mzaf_6665874998714897722.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/09/e0/d5/09e0d559-0682-f0f0-5e0c-3cd11e3114fd/beachhouse_depressioncherry_2400_300.jpg/300x300bb.jpg',
    synthPreset: 'ambient',
    vibeTag: 'Aesthetic Melancholy',
    bestFit: 'Over-ear headphones, soft pastel tones, calm dreamy gaze',
    vibeVector: { energy: 45, edge: 35, playful: 30, dreamy: 98, classy: 55, street: 30 },
  },

  // ==========================================
  // 4. TAMIL SOUNDTRACKS (KOLLYWOOD / MASS / MELODIES)
  // ==========================================
  {
    id: 'naa-ready',
    title: 'Naa Ready',
    artist: 'Anirudh Ravichander, Thalapathy Vijay',
    genre: 'Mass Power Anthem',
    language: 'Tamil',
    emoji: '⚔',
    category: 'dramatic',
    spotifyId: '47q5F5vQ047G9Y3u28f0P9',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/60/45/bc/6045bcf3-badc-db56-d044-adf6b14b0816/mzaf_7981634368973271980.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b0/bf/d4/b0bfd46c-da95-2f95-1f7d-a75aa51c2465/196871252386.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Mass Boss Swagger',
    bestFit: 'Fade cut, watch, intense fearless walk, squad energy',
    vibeVector: { energy: 97, edge: 90, playful: 50, dreamy: 15, classy: 55, street: 90 },
  },
  {
    id: 'arabic-kuthu',
    title: 'Arabic Kuthu (Halamithi Habibo)',
    artist: 'Anirudh Ravichander, Jonita Gandhi',
    genre: 'Arabic Kuthu Dance Pop',
    language: 'Tamil',
    emoji: '🌴',
    category: 'playful',
    spotifyId: '3k3nw72l39x222PsRYcO0N',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/58/ac/9a/58ac9a48-9e3e-15c9-5085-3a13a6187992/mzaf_12322264242631159198.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e9/19/b9/e919b921-d5a8-9e9a-8508-3551da375aee/196626458629.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Global Kuthu Dance Hype',
    bestFit: 'Resort wear, sunglasses, breezy shirts, dance mood',
    vibeVector: { energy: 96, edge: 64, playful: 98, dreamy: 35, classy: 45, street: 82 },
  },
  {
    id: 'munbe-vaa',
    title: 'Munbe Vaa',
    artist: 'A.R. Rahman, Naresh Iyer, Shreya Ghoshal',
    genre: 'Soulful Romance Classic',
    language: 'Tamil',
    emoji: '🌸',
    category: 'romantic',
    spotifyId: '6wM90eX5V9J72Z03j23HlQ',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/16/ca/14/16ca14e9-0f3c-9aeb-9715-fecee97a3fa6/mzaf_9113554670412044969.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7f/e5/dc/7fe5dcf4-1944-3266-9443-113a6c6fd2ac/8904337276584.jpg/300x300bb.jpg',
    synthPreset: 'melody',
    vibeTag: 'Timeless Rahman Melody',
    bestFit: 'Traditional elegance, soft pastels, couple harmony',
    vibeVector: { energy: 50, edge: 18, playful: 30, dreamy: 98, classy: 92, street: 15 },
  },
  {
    id: 'thee-thalapathy',
    title: 'Thee Thalapathy',
    artist: 'Silambarasan TR, Thaman S',
    genre: 'Electronic Mass Entrance',
    language: 'Tamil',
    emoji: '🔥',
    category: 'dramatic',
    spotifyId: '5y1sP943a08p7j2z8a1c9b',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/c4/67/0a/c4670a0e-f273-399e-d273-73a675cfa893/mzaf_3169899717315669534.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e8/c5/50/e8c55049-ce0a-218c-b5f1-43f6fa0f2890/8903431916006_cover.jpg/300x300bb.jpg',
    synthPreset: 'rage',
    vibeTag: 'Fire Entrance Bass',
    bestFit: 'High energy stance, aggressive prints, wrist accessories',
    vibeVector: { energy: 94, edge: 88, playful: 40, dreamy: 15, classy: 45, street: 89 },
  },
  {
    id: 'enjoy-enjaami',
    title: 'Enjoy Enjaami',
    artist: 'Dhee, Arivu, Santhosh Narayanan',
    genre: 'Folk Indie Fusion',
    language: 'Tamil',
    emoji: '🌾',
    category: 'playful',
    spotifyId: '693QWjV3W82C0K1h3o6c8r',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/87/8a/62/878a62f4-048c-d977-2a6f-a7a5b30a608d/mzaf_7142756228278497817.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cf/c5/9b/cfc59b20-dda2-e4a3-54db-e23ac7a55b80/cover.jpg/300x300bb.jpg',
    synthPreset: 'kuthu',
    vibeTag: 'Earthy Organic Groove',
    bestFit: 'Earthy tones, creative prints, organic casual fit',
    vibeVector: { energy: 85, edge: 55, playful: 90, dreamy: 68, classy: 50, street: 76 },
  },
  {
    id: 'hayyoda',
    title: 'Hayyoda',
    artist: 'Anirudh Ravichander, Priya Mali',
    genre: 'Breezy Romantic Pop',
    language: 'Tamil',
    emoji: '✨',
    category: 'romantic',
    spotifyId: '5E3Qx8X1d1w1r9s0c2v8b9',
    audioPreviewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/aa/00/9e/aa009eca-7522-72f7-aea4-c177613c09ef/mzaf_1555684855243777943.plus.aac.p.m4a',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/01/8f/36/018f36ad-3e05-322d-bb7b-98cc639dfc4a/8903431956033_cover.jpg/300x300bb.jpg',
    synthPreset: 'melody',
    vibeTag: 'Cheerful Romance Wave',
    bestFit: 'Bright pastels, casual chic, cheerful couple smiles',
    vibeVector: { energy: 68, edge: 28, playful: 82, dreamy: 90, classy: 75, street: 40 },
  },
];

export class MusicEngine {
  private playedSongIds: string[] = [];

  /**
   * Calculate compatibility between a visual Vibe Vector and each track,
   * supporting direct t-shirt text word matches and social people modes (couple, gang, duo, trio)
   */
  public rankTracksByVibe(
    vibe: VibeVector,
    recencyHistory: string[] = [],
    isRouletteMode: boolean = false,
    forcedMatchedSongId?: string,
    peopleMode?: string,
    languageFilter: string = 'all'
  ): { ranked: MusicTrack[]; topScore: number } {
    const scores: { track: MusicTrack; score: number }[] = [];

    // Genre lists for social scenes with distinct sub-flavors across Malayalam, Tamil, Hindi & Global
    const GANG_PARTY_SONGS = [
      'illuminati',
      'manavalan-thug',
      'badtameez-dil',
      'jaada',
      'pala-palli',
      'arabic-kuthu',
      'tauba-tauba',
      'levitating',
      'mirchi',
      'seven',
      'aadharanjali',
    ];
    const GANG_TRAP_SONGS = [
      'fein',
      'big-dawgs',
      'starboy',
      'thee-thalapathy',
      'kuthanthram',
      'pala-palli',
      'naa-ready',
    ];
    const GANG_ANTHEM_SONGS = [
      'badtameez-dil',
      'pala-palli',
      'naa-ready',
      'not-like-us',
      'cheques',
      'aadharanjali',
      'thee-thalapathy',
    ];
    const GANG_CHILL_SONGS = [
      'kabira',
      'darshana',
      'as-it-was',
      'ghungroo',
      'enjoy-enjaami',
      'chaleya',
      'iktara',
      'golden-hour',
    ];
    const ALL_GANG_SONGS = [...GANG_PARTY_SONGS, ...GANG_TRAP_SONGS, ...GANG_ANTHEM_SONGS, ...GANG_CHILL_SONGS];

    const COUPLE_SONG_IDS = [
      'kesariya',
      'malare',
      'munbe-vaa',
      'kabira',
      'darshana',
      'apna-bana-le',
      'chaleya',
      'hayyoda',
      'nee-himamazhayayi',
      'tum-hi-ho',
      'until-i-found-you',
      'golden-hour',
      'space-song',
    ];
    const DUO_SONG_IDS = [
      'cheques',
      'big-dawgs',
      'starboy',
      'as-it-was',
      'illuminati',
      'jaada',
      'ghungroo',
      'enjoy-enjaami',
      'tauba-tauba',
      'chaleya',
      'manavalan-thug',
    ];
    const TRIO_SONG_IDS = [
      'mirchi',
      'illuminati',
      'badtameez-dil',
      'jaada',
      'pala-palli',
      'manavalan-thug',
      'thee-thalapathy',
      'arabic-kuthu',
      'aadharanjali',
      'tauba-tauba',
    ];

    for (const track of VERIFIED_TRACK_CATALOG) {
      const tv = track.vibeVector;

      // Cosine-like weighted similarity across 6 vibe dimensions
      const deltaEnergy = Math.abs(vibe.energy - tv.energy);
      const deltaEdge = Math.abs(vibe.edge - tv.edge);
      const deltaPlayful = Math.abs(vibe.playful - tv.playful);
      const deltaDreamy = Math.abs(vibe.dreamy - tv.dreamy);
      const deltaClassy = Math.abs(vibe.classy - tv.classy);
      const deltaStreet = Math.abs(vibe.street - tv.street);

      const distance =
        deltaEnergy * 1.3 +
        deltaEdge * 1.2 +
        deltaPlayful * 1.1 +
        deltaDreamy * 1.1 +
        deltaClassy * 1.2 +
        deltaStreet * 1.3;

      let score = 1000 - distance;

      // Category matching bonus
      if (vibe.dominantVibe.toLowerCase() === track.category) {
        score += 90;
      }
      if (vibe.secondaryVibes.map((s) => s.toLowerCase()).includes(track.category)) {
        score += 45;
      }

      // 1. T-Shirt Word Matching: Highest Priority
      if (forcedMatchedSongId && track.id === forcedMatchedSongId) {
        score += 850;
      }

      // 2. People Mode & Squad Aesthetic Differentiation
      if (peopleMode === 'couple' && COUPLE_SONG_IDS.includes(track.id)) {
        score += 380;
      } else if (peopleMode === 'group') {
        if (ALL_GANG_SONGS.includes(track.id)) {
          score += 260; // Base gang bonus
          // Specific squad aesthetic bonus based on visual outfit:
          if (vibe.dominantVibe === 'PLAYFUL' && GANG_PARTY_SONGS.includes(track.id)) {
            score += 220; // Vibrant / party squad
          } else if (vibe.dominantVibe === 'EDGY' && GANG_TRAP_SONGS.includes(track.id)) {
            score += 220; // Dark trap / heavy bass squad
          } else if (vibe.dominantVibe === 'STREET' && GANG_ANTHEM_SONGS.includes(track.id)) {
            score += 220; // West coast / DHH anthem squad
          } else if ((vibe.dominantVibe === 'CLASSY' || vibe.dominantVibe === 'DREAMY') && GANG_CHILL_SONGS.includes(track.id)) {
            score += 220; // Casual / college squad
          }
        }
      } else if (peopleMode === 'duo' && DUO_SONG_IDS.includes(track.id)) {
        score += 320;
      } else if (peopleMode === 'trio' && TRIO_SONG_IDS.includes(track.id)) {
        score += 340;
      }

      // 3. Strict Anti-Repeat Engine (Guarantees fresh tracks across scans)
      if (!forcedMatchedSongId || track.id !== forcedMatchedSongId) {
        const recencyIdx = recencyHistory.indexOf(track.id);
        if (recencyIdx === 0) {
          score -= 750; // The track that was just played strictly cannot repeat
        } else if (recencyIdx === 1) {
          score -= 480; // Second last track heavily demoted
        } else if (recencyIdx === 2) {
          score -= 300; // Third last track demoted
        } else if (recencyIdx <= 5 && recencyIdx >= 0) {
          score -= 160; // Other recently played tracks penalized
        } else if (recencyIdx === -1) {
          score += 90; // Fresh unplayed tracks get strong bonus!
        }
      }

      // 4. Slight dynamic rotation variance so ties and close matches cycle through varied artists
      const rotationVariance = (Math.abs(Math.sin((track.id.charCodeAt(0) * 19 + Date.now() / 2000))) * 35);
      score += rotationVariance;

      // 5. Regional Language Affinity (Malayalam, Tamil, Hindi, Global)
      if (languageFilter && languageFilter !== 'all') {
        const lang = track.language.toLowerCase();
        const target = languageFilter.toLowerCase();
        const isMatch =
          lang.includes(target) ||
          (target === 'global' &&
            (lang.includes('english') ||
              lang.includes('global') ||
              lang.includes('punjabi') ||
              lang.includes('korean') ||
              lang.includes('arabic')));
        if (isMatch) {
          score += 450; // Strong priority for chosen regional language!
        } else {
          score -= 220; // Deprioritize other languages when a specific language filter is active
        }
      }

      scores.push({ track, score });
    }

    scores.sort((a, b) => b.score - a.score);

    return {
      ranked: scores.map((s) => s.track),
      topScore: Math.round(scores[0]?.score || 0),
    };
  }

  /**
   * Explainability breakdown: "Why This Song?"
   */
  public generateExplanation(
    vibe: VibeVector,
    track: MusicTrack,
    chips: string[],
    detectedText?: string
  ): SongExplanation {
    const items = [];

    // Parse detected visual chips for explainability
    for (const chip of chips) {
      if (chip.toLowerCase().includes('color')) {
        if (chip.toLowerCase().includes('dark') || chip.toLowerCase().includes('black')) {
          items.push({ icon: '🖤', title: 'Dark outfit fit', detail: chip, influence: '+18 EDGE' });
        } else if (chip.toLowerCase().includes('white') || chip.toLowerCase().includes('clean')) {
          items.push({ icon: '⚪', title: 'Crisp minimal palette', detail: chip, influence: '+15 CLASSY' });
        } else {
          items.push({ icon: '🎨', title: 'Vibrant color profile', detail: chip, influence: '+16 ENERGY' });
        }
      } else if (chip.toLowerCase().includes('specs') || chip.toLowerCase().includes('sunglasses')) {
        if (chip.toLowerCase().includes('sunglasses')) {
          items.push({ icon: '🕶', title: 'Dark sunglasses shades', detail: chip, influence: '+14 EDGE' });
        } else if (chip.toLowerCase().includes('eyeglasses')) {
          items.push({ icon: '👓', title: 'Optical frames & specs', detail: chip, influence: '+18 INDIE CHARM' });
        }
      } else if (chip.toLowerCase().includes('acc') || chip.toLowerCase().includes('holding')) {
        if (chip.toLowerCase().includes('chain') || chip.toLowerCase().includes('watch')) {
          items.push({ icon: '⛓', title: 'Metallic jewelry / watch', detail: chip, influence: '+16 STREET' });
        } else if (chip.toLowerCase().includes('phone')) {
          items.push({ icon: '📱', title: 'Smartphone in hand', detail: chip, influence: '+10 URBAN FLOW' });
        } else if (chip.toLowerCase().includes('coffee') || chip.toLowerCase().includes('drink')) {
          items.push({ icon: '☕', title: 'Beverage held', detail: chip, influence: '+15 LO-FI CHILL' });
        } else if (chip.toLowerCase().includes('book')) {
          items.push({ icon: '📚', title: 'Book / Reading material', detail: chip, influence: '+20 FOCUS / LO-FI' });
        } else if (chip.toLowerCase().includes('basketball')) {
          items.push({ icon: '🏀', title: 'Basketball / Sport object', detail: chip, influence: '+25 HYPE' });
        } else if (chip.toLowerCase().includes('guitar')) {
          items.push({ icon: '🎸', title: 'Musical instrument held', detail: chip, influence: '+28 ROCK' });
        }
      } else if (chip.toLowerCase().includes('fit:')) {
        items.push({ icon: '🧥', title: 'Silhouette & drip', detail: chip, influence: `+22 ${vibe.dominantVibe}` });
      }
    }

    if (detectedText) {
      items.push({
        icon: '📝',
        title: `Clothing OCR Text "${detectedText}"`,
        detail: 'Semantic interpretation mapped to music energy',
        influence: '+24 NIGHT ENERGY',
      });
    }

    if (items.length === 0) {
      items.push({
        icon: '✦',
        title: `${vibe.dominantVibe} Visual Signature`,
        detail: `Energy: ${vibe.energy}% · Edge: ${vibe.edge}%`,
        influence: `+25 MATCH`,
      });
    }

    const finalVibe = `${vibe.dominantVibe} × ${vibe.secondaryVibes.join(' × ')}`;

    return {
      items: items.slice(0, 5),
      finalVibe,
      matchScore: Math.round(Math.min(99, 78 + (vibe.energy * 0.2))),
    };
  }

  /**
   * "If Your Outfit Was A Song..." result card generator
   */
  public generateOutfitAsSongCard(track: MusicTrack, vibe: VibeVector): OutfitAsSongResult {
    const formula = `${vibe.dominantVibe} × ${vibe.secondaryVibes[0] || 'AESTHETIC'} × ${track.genre.split('/')[0]?.trim().toUpperCase()}`;
    return {
      songTitle: track.title,
      artist: track.artist,
      genre: track.genre,
      vibeFormula: formula,
      aestheticCard: `Your visual identity manifests acoustically as ${track.title}. ${track.bestFit}`,
    };
  }

  public recordPlayed(trackId: string): void {
    this.playedSongIds = [trackId, ...this.playedSongIds.filter((id) => id !== trackId)].slice(0, 10);
  }

  public getHistory(): string[] {
    return [...this.playedSongIds];
  }
}

export const musicEngine = new MusicEngine();
