// OCR & Semantic Text-to-Music Analysis Engine
import type { TextCue } from './types';

export interface SongWordMatch {
  trackId: string;
  songTitle: string;
  artist: string;
  exactWords: string[];
  semanticKeywords: string[];
  firstLetter: string;
}

export interface EmojiMatch {
  emojis: string[];
  trackId: string;
  songTitle: string;
  artist: string;
  themeDescription: string;
}

// 1. Emoji, Diagram & Symbol Registry (Sleep, Drinks, Cars, Fire, Money, Beast, Romance, etc.)
export const EMOJI_SYMBOL_REGISTRY: EmojiMatch[] = [
  {
    emojis: ['😴', '💤', '🌙', '🛌', '🥱', '🦉'],
    trackId: 'nonstop',
    songTitle: 'Nonstop',
    artist: 'Drake',
    themeDescription: 'Sleep & late night grind ("No sleep, 24/7 on the grind")',
  },
  {
    emojis: ['☕', '🥤', '🧋', '🍵', '🍺', '🍻', '🍹', '🍷', '🍸', '🍾', '🥂', '🥃'],
    trackId: 'darshana',
    songTitle: 'Darshana',
    artist: 'Hesham Abdul Wahab',
    themeDescription: 'Beverages & cafe coffee vibes',
  },
  {
    emojis: ['🏎️', '🚗', '💨', '🏁', '🏃', '👟'],
    trackId: 'sprinter',
    songTitle: 'Sprinter',
    artist: 'Central Cee, Dave',
    themeDescription: 'Speed, racing & fast-lane adrenaline',
  },
  {
    emojis: ['🔥', '💥', '⚡', '🌩️', '👹', '🤘'],
    trackId: 'fein',
    songTitle: 'FE!N',
    artist: 'Travis Scott, Playboi Carti',
    themeDescription: 'Fire, rage & moshpit chaos',
  },
  {
    emojis: ['💵', '💸', '💰', '💎', '💳', '🤑', '🪙', '💶', '💷'],
    trackId: 'cheques',
    songTitle: 'Cheques',
    artist: 'Shubh',
    themeDescription: 'Cash, wealth & luxury drip',
  },
  {
    emojis: ['🐺', '🐶', '🥊', '💪', '🦍'],
    trackId: 'big-dawgs',
    songTitle: 'Big Dawgs',
    artist: 'Hanumankind, Kalmi',
    themeDescription: 'Beast mode, raw power & gym intensity',
  },
  {
    emojis: ['❤️', '💖', '💕', '🌹', '💍', '💌', '👩‍❤️‍👨'],
    trackId: 'until-i-found-you',
    songTitle: 'Until I Found You',
    artist: 'Stephen Sanchez',
    themeDescription: 'Pure romance & true love',
  },
  {
    emojis: ['🌶️', '🥘', '🍲', '🍛', '🧨'],
    trackId: 'mirchi',
    songTitle: 'Mirchi',
    artist: 'DIVINE, MC Altaf',
    themeDescription: 'Hot spicy gully rap flow',
  },
  {
    emojis: ['🕺', '🎉', '😎', '🤪', '🤡', '🌈'],
    trackId: 'manavalan-thug',
    songTitle: 'Manavalan Thug',
    artist: 'Dabzee, SA',
    themeDescription: 'Funky party & playful swagger',
  },
  {
    emojis: ['🏖️', '🌴', '☀️', '🌊', '🥥', '⛵'],
    trackId: 'ghazali',
    songTitle: 'Ghazali',
    artist: 'DYSTINCT',
    themeDescription: 'Summer beach & holiday vacation',
  },
  {
    emojis: ['🌌', '🪐', '🚀', '🛸', '🌠', '🔭'],
    trackId: 'space-song',
    songTitle: 'Space Song',
    artist: 'Beach House',
    themeDescription: 'Deep space & cosmic drifting',
  },
  {
    emojis: ['🌸', '🌺', '🌷', '🌻', '🦋', '🌿'],
    trackId: 'malare',
    songTitle: 'Malare',
    artist: 'Vijay Yesudas',
    themeDescription: 'Gentle flower & nostalgic romance',
  },
  {
    emojis: ['🦁', '🐯', '🔫', '👑', '⚔️'],
    trackId: 'naa-ready',
    songTitle: 'Naa Ready',
    artist: 'Anirudh, Thalapathy Vijay',
    themeDescription: 'Boss entry & mass leader roar',
  },
  {
    emojis: ['🧡', '🪔', '🕉️', '🪷', '✨'],
    trackId: 'kesariya',
    songTitle: 'Kesariya',
    artist: 'Arijit Singh, Pritam',
    themeDescription: 'Saffron romance & sacred love',
  },
  {
    emojis: ['🕶️', '🕺', '💃', '🔥', '👟'],
    trackId: 'tauba-tauba',
    songTitle: 'Tauba Tauba',
    artist: 'Karan Aujla',
    themeDescription: 'Slick party moves & viral Punjabi dance groove',
  },
  {
    emojis: ['🌴', '🏖️', '💃', '🏝️', '🍹'],
    trackId: 'arabic-kuthu',
    songTitle: 'Arabic Kuthu',
    artist: 'Anirudh, Jonita Gandhi',
    themeDescription: 'Beach dance festival & Arabic kuthu party',
  },
  {
    emojis: ['🌸', '💖', '🕊️', '🌧️', '🎻'],
    trackId: 'munbe-vaa',
    songTitle: 'Munbe Vaa',
    artist: 'A.R. Rahman, Shreya Ghoshal',
    themeDescription: 'Soulful Rahman romance & eternal harmony',
  },
  {
    emojis: ['💫', '💘', '🎡', '🌷'],
    trackId: 'chaleya',
    songTitle: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao',
    themeDescription: 'Breezy Bollywood romance & joyful couple stroll',
  },
  {
    emojis: ['👻', '🕯️', '🤪', '🤡'],
    trackId: 'aadharanjali',
    songTitle: 'Aadharanjali',
    artist: 'Sushin Shyam',
    themeDescription: 'Romancham quirky squad ghost vibe',
  },
];

// 2. Comprehensive Song Words & Themes Registry
export const SONG_WORD_REGISTRY: SongWordMatch[] = [
  {
    trackId: 'nonstop',
    songTitle: 'Nonstop',
    artist: 'Drake',
    exactWords: ['nonstop', 'non stop', 'drake', 'october', 'no sleep', 'sleepless', 'sleep', 'insomnia'],
    semanticKeywords: [
      'sleep', 'no sleep', 'sleepless', 'insomnia', 'all night', 'night shift',
      '3am', 'late night', 'midnight', 'tired', 'awake', 'rest', 'bed',
      'snooze', 'sleeping', 'night owl', 'grind', 'nocturnal', 'awake'
    ],
    firstLetter: 'n',
  },
  {
    trackId: 'darshana',
    songTitle: 'Darshana',
    artist: 'Hesham Abdul Wahab',
    exactWords: ['darshana', 'coffee', 'drinks', 'drink', 'beverage', 'cafe', 'tea', 'latte', 'espresso', 'hridayam', 'hesham'],
    semanticKeywords: [
      'coffee', 'drinks', 'drink', 'beverage', 'tea', 'latte', 'cappuccino',
      'espresso', 'starbucks', 'cafe', 'canteen', 'college', 'campus', 'study',
      'crush', 'cute', 'sweet', 'first love', 'acoustic', 'specs', 'romantic', 'mug', 'cup', 'caffeine'
    ],
    firstLetter: 'd',
  },
  {
    trackId: 'cheques',
    songTitle: 'Cheques',
    artist: 'Shubh',
    exactWords: ['cheques', 'cheque', 'check', 'checks', 'drip', 'cash', 'money', 'rich', 'wealth'],
    semanticKeywords: [
      'money', 'cash', 'dollars', 'rich', 'wealth', 'bank', 'pesos', 'crypto',
      'luxury', 'flex', 'gucci', 'prada', 'rolex', 'bills', 'profit', 'bag',
      'hustler', 'billionaire', 'millionaire', 'paid', 'income'
    ],
    firstLetter: 'c',
  },
  {
    trackId: 'fein',
    songTitle: 'FE!N',
    artist: 'Travis Scott, Playboi Carti',
    exactWords: ['fein', 'fe!n', 'feining', 'fiend', 'rage', 'fire', 'flame'],
    semanticKeywords: [
      'rage', 'travis', 'carnival', 'wild', 'mosh', 'fire', 'flame', 'chaos',
      'psycho', 'screaming', 'utopia', 'lit', 'turn up', 'burn', 'blaze',
      'furious', 'rockstar', 'hype', 'heat'
    ],
    firstLetter: 'f',
  },
  {
    trackId: 'big-dawgs',
    songTitle: 'Big Dawgs',
    artist: 'Hanumankind, Kalmi',
    exactWords: ['big dawgs', 'dawg', 'dawgs', 'big', 'hanumankind', 'beast', 'wolf'],
    semanticKeywords: [
      'beast', 'monster', 'pitbull', 'wolf', 'heavy', 'hardcore', 'raw',
      'warrior', 'power', 'danger', 'gym', 'muscle', 'workout', 'fight',
      'strength', 'iron', 'boxing', 'bully', 'alpha'
    ],
    firstLetter: 'b',
  },
  {
    trackId: 'sprinter',
    songTitle: 'Sprinter',
    artist: 'Central Cee, Dave',
    exactWords: ['sprinter', 'sprint', 'central cee', 'dave', 'speed', 'racing', 'race', 'fast', 'just do it', 'nike', 'athletic', 'athletics'],
    semanticKeywords: [
      'fast', 'speed', 'run', 'runner', 'race', 'racing', 'dash', 'quick',
      'velocity', 'pace', 'van', 'nike', 'track', 'turbo', 'boost', 'marathon',
      'sport', 'athletic', 'acceleration', 'motor', 'cars'
    ],
    firstLetter: 's',
  },
  {
    trackId: 'band4band',
    songTitle: 'BAND4BAND',
    artist: 'Central Cee, Lil Baby',
    exactWords: ['band4band', 'band 4 band', 'band', 'bands', 'balenciaga', 'supreme', 'essentials', 'stussy', 'drip', 'luxury'],
    semanticKeywords: ['bread', 'millions', 'stacks', 'pounds', 'drill', 'duo', 'twins', 'brothers', 'syndicate', 'designer'],
    firstLetter: 'b',
  },
  {
    trackId: 'not-like-us',
    songTitle: 'Not Like Us',
    artist: 'Kendrick Lamar',
    exactWords: ['not like us', 'kendrick', 'lamar', 'kdot'],
    semanticKeywords: ['compton', 'west coast', 'anthem', 'truth', 'real', 'authentic', 'crown', 'king', 'rebel', 'legend', 'goat'],
    firstLetter: 'n',
  },
  {
    trackId: 'illuminati',
    songTitle: 'Illuminati',
    artist: 'Sushin Shyam, Dabzee',
    exactWords: ['illuminati', 'sushin', 'dabzee', 'avesham', 'aavesham'],
    semanticKeywords: ['gang', 'squad', 'gangster', 'party', 'club', 'trap', 'aura', 'trippy', 'secret', 'vip', 'brotherhood', 'crew', 'party drinks', 'shots', 'cocktail', 'cheers', 'nightlife'],
    firstLetter: 'i',
  },
  {
    trackId: 'manavalan-thug',
    songTitle: 'Manavalan Thug',
    artist: 'Dabzee, SA',
    exactWords: ['manavalan', 'thug', 'thug life', 'manavalan thug', 'funky', 'swag'],
    semanticKeywords: ['swag', 'funky', 'colourful', 'smile', 'funny', 'crazy', 'unhinged', 'homies', 'laugh', 'vibes', 'comedy', 'joke', 'meme', 'prank', 'groovy', 'clown'],
    firstLetter: 'm',
  },
  {
    trackId: 'hukum',
    songTitle: 'Naa Ready',
    artist: 'Anirudh Ravichander, Thalapathy Vijay',
    exactWords: ['naa ready', 'ready', 'hukum', 'leo', 'thalapathy', 'vijay'],
    semanticKeywords: ['boss', 'mass', 'leader', 'danger', 'gun', 'badass', 'don', 'tiger', 'lion', 'strike', 'hero', 'rowdy', 'roar'],
    firstLetter: 'h',
  },
  {
    trackId: 'golden-hour',
    songTitle: 'golden hour',
    artist: 'JVKE',
    exactWords: ['golden hour', 'golden', 'jvke'],
    semanticKeywords: ['sunset', 'sunrise', 'sunshine', 'glow', 'gold', 'light', 'angel', 'beauty', 'pretty', 'sky', 'warmth', 'sunlight', 'radiant'],
    firstLetter: 'g',
  },
  {
    trackId: 'space-song',
    songTitle: 'Space Song',
    artist: 'Beach House',
    exactWords: ['space song', 'space', 'beach house', 'galaxy', 'stars'],
    semanticKeywords: ['stars', 'galaxy', 'universe', 'planet', 'cosmic', 'floating', 'lonely', 'sad', 'melancholy', 'dream', 'night sky', 'moon', 'astronaut'],
    firstLetter: 's',
  },
  {
    trackId: 'until-i-found-you',
    songTitle: 'Until I Found You',
    artist: 'Stephen Sanchez',
    exactWords: ['until i found you', 'found you', 'stephen sanchez', 'love', 'romance', 'lover'],
    semanticKeywords: ['love', 'forever', 'together', 'couple', 'marry', 'romance', 'lover', 'vintage', 'classic', 'heart', 'retro', 'valentine', 'soulmate', 'kiss', 'kissing', 'affection', 'beloved'],
    firstLetter: 'u',
  },
  {
    trackId: 'seven',
    songTitle: 'Seven',
    artist: 'Jung Kook, Latto',
    exactWords: ['seven', 'jung kook', 'jungkook', 'latto'],
    semanticKeywords: ['monday', 'tuesday', 'weekend', 'kiss', 'crush', 'pop', 'viral', 'dance', 'happy', 'good vibes only', 'good vibes', '7'],
    firstLetter: 's',
  },
  {
    trackId: 'malare',
    songTitle: 'Malare',
    artist: 'Vijay Yesudas',
    exactWords: ['malare', 'premam', 'malar'],
    semanticKeywords: ['flower', 'rose', 'blossom', 'sweetheart', 'nostalgia', 'butterfly', 'pure', 'gentle', 'grace', 'garden', 'bloom'],
    firstLetter: 'm',
  },
  {
    trackId: 'mirchi',
    songTitle: 'Mirchi',
    artist: 'DIVINE, MC Altaf',
    exactWords: ['mirchi', 'divine', 'altaf', 'chilli', 'spicy', 'pepper'],
    semanticKeywords: ['spicy', 'chilli', 'hot', 'pepper', 'gully', 'mumbai', 'street', 'trio', 'spicy food', 'desi', 'spice', 'jalapeno', 'fire food'],
    firstLetter: 'm',
  },
  {
    trackId: 'ghazali',
    songTitle: 'Ghazali',
    artist: 'DYSTINCT',
    exactWords: ['ghazali', 'dystinct'],
    semanticKeywords: ['summer', 'beach', 'vacation', 'trip', 'island', 'sun', 'habibi', 'aloha', 'morocco', 'holiday', 'resort', 'ocean'],
    firstLetter: 'g',
  },
  {
    trackId: 'kuthanthram',
    songTitle: 'Kuthanthram',
    artist: 'Sushin Shyam, Vedan',
    exactWords: ['kuthanthram', 'vedan'],
    semanticKeywords: ['raw', 'underground', 'truth', 'darkness', 'fight', 'power', 'voice', 'fist', 'rebel', 'revolution'],
    firstLetter: 'k',
  },
  {
    trackId: 'thee-thalapathy',
    songTitle: 'Thee Thalapathy',
    artist: 'Silambarasan TR, Thaman S',
    exactWords: ['thee thalapathy', 'thee', 'thaman'],
    semanticKeywords: ['entrance', 'fire', 'flames', 'boss', 'power', 'thumping', 'blast', 'explosion'],
    firstLetter: 't',
  },
  {
    trackId: 'kesariya',
    songTitle: 'Kesariya',
    artist: 'Arijit Singh, Pritam',
    exactWords: ['kesariya', 'kesar', 'saffron', 'brahmastra', 'arijit', 'ishq', 'pyar'],
    semanticKeywords: ['saffron', 'orange', 'love', 'romance', 'forever', 'sunshine', 'sacred', 'couple', 'warmth', 'blessing'],
    firstLetter: 'k',
  },
  {
    trackId: 'tauba-tauba',
    songTitle: 'Tauba Tauba',
    artist: 'Karan Aujla',
    exactWords: ['tauba tauba', 'tauba', 'aujla', 'karan aujla', 'husan', 'nakhra'],
    semanticKeywords: ['dance', 'moves', 'punjabi', 'desi', 'slick', 'swagger', 'sunglasses', 'banger', 'party', 'shoes', 'stylish'],
    firstLetter: 't',
  },
  {
    trackId: 'arabic-kuthu',
    songTitle: 'Arabic Kuthu (Halamithi Habibo)',
    artist: 'Anirudh Ravichander, Jonita Gandhi',
    exactWords: ['arabic kuthu', 'halamithi', 'habibo', 'beast', 'kuthu'],
    semanticKeywords: ['beach', 'dance', 'party', 'vacation', 'resort', 'tropical', 'fun', 'upbeat', 'celebration'],
    firstLetter: 'a',
  },
  {
    trackId: 'munbe-vaa',
    songTitle: 'Munbe Vaa',
    artist: 'A.R. Rahman, Shreya Ghoshal',
    exactWords: ['munbe vaa', 'munbe', 'rahman', 'ar rahman', 'shreya ghoshal', 'anbe'],
    semanticKeywords: ['monsoon', 'rain', 'pure love', 'eternal', 'classical', 'soulful', 'devotion', 'saree', 'silk', 'harmony'],
    firstLetter: 'm',
  },
  {
    trackId: 'chaleya',
    songTitle: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao, Anirudh',
    exactWords: ['chaleya', 'jawan', 'ishq jawan', 'srk', 'shahrukh'],
    semanticKeywords: ['breezy', 'couple', 'stroll', 'duet', 'heart', 'butterflies', 'smiles', 'romance', 'bollywood'],
    firstLetter: 'c',
  },
  {
    trackId: 'apna-bana-le',
    songTitle: 'Apna Bana Le',
    artist: 'Arijit Singh, Sachin-Jigar',
    exactWords: ['apna bana le', 'apna', 'bhediya', 'tujhko'],
    semanticKeywords: ['belong', 'soulmate', 'cozy', 'hoodie', 'winter', 'forever', 'soft gaze', 'intimate', 'warmth'],
    firstLetter: 'a',
  },
  {
    trackId: 'tum-hi-ho',
    songTitle: 'Tum Hi Ho',
    artist: 'Arijit Singh, Mithoon',
    exactWords: ['tum hi ho', 'aashiqui', 'aashiqui 2', 'mithoon'],
    semanticKeywords: ['rain', 'umbrella', 'formal', 'black suit', 'deep romance', 'forever love', 'devotion', 'soul'],
    firstLetter: 't',
  },
  {
    trackId: 'aadharanjali',
    songTitle: 'Aadharanjali',
    artist: 'Sushin Shyam',
    exactWords: ['aadharanjali', 'romancham', 'athanje'],
    semanticKeywords: ['ghost', 'squad', 'bachelor', 'quirky', 'unhinged', 'fun', 'group dance', 'retro', 'chaos'],
    firstLetter: 'a',
  },
  {
    trackId: 'nee-himamazhayayi',
    songTitle: 'Nee Himamazhayayi',
    artist: 'KS Harisankar, Nithya Mammen',
    exactWords: ['nee himamazhayayi', 'himamazha', 'snow', 'winter love'],
    semanticKeywords: ['mountain', 'snow', 'breeze', 'sweater', 'dew', 'mist', 'fog', 'sweet duet', 'gentle'],
    firstLetter: 'n',
  },
  {
    trackId: 'enjoy-enjaami',
    songTitle: 'Enjoy Enjaami',
    artist: 'Dhee, Arivu, Santhosh Narayanan',
    exactWords: ['enjoy enjaami', 'enjaami', 'dhee', 'arivu'],
    semanticKeywords: ['nature', 'earth', 'organic', 'roots', 'ancestors', 'greenery', 'culture', 'folk art', 'trees'],
    firstLetter: 'e',
  },
  {
    trackId: 'hayyoda',
    songTitle: 'Hayyoda',
    artist: 'Anirudh Ravichander, Priya Mali',
    exactWords: ['hayyoda', 'anirudh jawan', 'priya mali'],
    semanticKeywords: ['cheerful', 'happy', 'bright', 'pastels', 'chic', 'sweet love', 'smile', 'couple goals'],
    firstLetter: 'h',
  },
  {
    trackId: 'iktara',
    songTitle: 'Iktara',
    artist: 'Amit Trivedi, Kavita Seth',
    exactWords: ['iktara', 'wake up sid', 'amit trivedi'],
    semanticKeywords: ['guitar', 'youth', 'carefree', 'morning', 'acoustic', 'chillout', 'peaceful', 'dreamer', 'baggy'],
    firstLetter: 'i',
  },
  {
    trackId: 'jaada',
    songTitle: 'Jaada',
    artist: 'Sushin Shyam',
    exactWords: ['jaada', 'aavesham', 'fafa', 'fahadh', 'renga'],
    semanticKeywords: ['shades', 'swagger', 'gang', 'boss', 'gold', 'energy', 'cool', 'attitude', 'club'],
    firstLetter: 'j',
  },
  {
    trackId: 'pala-palli',
    songTitle: 'Pala Palli Thiruppalli',
    artist: 'Jakes Bejoy, Atul Narukara',
    exactWords: ['pala palli', 'thiruppalli', 'kaduva', 'jakes bejoy'],
    semanticKeywords: ['festival', 'traditional', 'celebration', 'mundu', 'dholak', 'percussion', 'kerala', 'dance'],
    firstLetter: 'p',
  },
  {
    trackId: 'badtameez-dil',
    songTitle: 'Badtameez Dil',
    artist: 'Benny Dayal, Pritam',
    exactWords: ['badtameez dil', 'badtameez', 'yjhd', 'benny dayal', 'bunny'],
    semanticKeywords: ['party', 'dance', 'champagne', 'celebration', 'wild', 'club', 'bollywood', 'energy'],
    firstLetter: 'b',
  },
  {
    trackId: 'kabira',
    songTitle: 'Kabira',
    artist: 'Tochi Raina, Rekha Bhardwaj, Pritam',
    exactWords: ['kabira', 'tochi raina', 're kabira'],
    semanticKeywords: ['acoustic', 'guitar', 'friends', 'warmth', 'soulful', 'journey', 'earthy', 'nostalgia'],
    firstLetter: 'k',
  },
  {
    trackId: 'ghungroo',
    songTitle: 'Ghungroo',
    artist: 'Arijit Singh, Shilpa Rao',
    exactWords: ['ghungroo', 'war', 'hrithik', 'shilpa rao'],
    semanticKeywords: ['beach', 'linen', 'cocktail', 'resort', 'vacation', 'sunglasses', 'breezy', 'chic'],
    firstLetter: 'g',
  },
  {
    trackId: 'starboy',
    songTitle: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    exactWords: ['starboy', 'the weeknd', 'weeknd', 'daft punk'],
    semanticKeywords: ['leather', 'night', 'cross', 'dark', 'synth', 'sports car', 'drive', 'sleek'],
    firstLetter: 's',
  },
  {
    trackId: 'as-it-was',
    songTitle: 'As It Was',
    artist: 'Harry Styles',
    exactWords: ['as it was', 'harry styles', 'harry'],
    semanticKeywords: ['retro', 'colorful', 'knitwear', 'dancing', 'playful', 'bright', 'vintage', 'bounce'],
    firstLetter: 'a',
  },
  {
    trackId: 'levitating',
    songTitle: 'Levitating',
    artist: 'Dua Lipa',
    exactWords: ['levitating', 'dua lipa', 'future nostalgia'],
    semanticKeywords: ['disco', 'sparkle', 'glitter', 'party', 'stars', 'cosmic', 'dance', 'glamour'],
    firstLetter: 'l',
  },
];

// 3. Complete A-Z Starts-With Alphabet Registry
export const ALPHABET_STARTS_WITH: Record<string, { trackId: string; songTitle: string; artist: string }> = {
  a: { trackId: 'as-it-was', songTitle: 'As It Was', artist: 'Harry Styles' },
  b: { trackId: 'badtameez-dil', songTitle: 'Badtameez Dil', artist: 'Benny Dayal' },
  c: { trackId: 'chaleya', songTitle: 'Chaleya', artist: 'Arijit Singh' },
  d: { trackId: 'darshana', songTitle: 'Darshana', artist: 'Hesham Abdul Wahab' },
  e: { trackId: 'enjoy-enjaami', songTitle: 'Enjoy Enjaami', artist: 'Dhee, Arivu' },
  f: { trackId: 'fein', songTitle: 'FE!N', artist: 'Travis Scott' },
  g: { trackId: 'ghungroo', songTitle: 'Ghungroo', artist: 'Arijit Singh, Shilpa Rao' },
  h: { trackId: 'naa-ready', songTitle: 'Naa Ready', artist: 'Anirudh, Vijay' },
  i: { trackId: 'illuminati', songTitle: 'Illuminati', artist: 'Sushin Shyam' },
  j: { trackId: 'jaada', songTitle: 'Jaada', artist: 'Sushin Shyam' },
  k: { trackId: 'kesariya', songTitle: 'Kesariya', artist: 'Arijit Singh' },
  l: { trackId: 'levitating', songTitle: 'Levitating', artist: 'Dua Lipa' },
  m: { trackId: 'malare', songTitle: 'Malare', artist: 'Vijay Yesudas' },
  n: { trackId: 'nee-himamazhayayi', songTitle: 'Nee Himamazhayayi', artist: 'KS Harisankar' },
  o: { trackId: 'big-dawgs', songTitle: 'Big Dawgs', artist: 'Hanumankind' },
  p: { trackId: 'pala-palli', songTitle: 'Pala Palli', artist: 'Jakes Bejoy' },
  q: { trackId: 'cheques', songTitle: 'Cheques', artist: 'Shubh' },
  r: { trackId: 'naa-ready', songTitle: 'Naa Ready', artist: 'Anirudh' },
  s: { trackId: 'starboy', songTitle: 'Starboy', artist: 'The Weeknd' },
  t: { trackId: 'tauba-tauba', songTitle: 'Tauba Tauba', artist: 'Karan Aujla' },
  u: { trackId: 'until-i-found-you', songTitle: 'Until I Found You', artist: 'Stephen Sanchez' },
  v: { trackId: 'thee-thalapathy', songTitle: 'Thee Thalapathy', artist: 'Silambarasan TR' },
  w: { trackId: 'space-song', songTitle: 'Space Song', artist: 'Beach House' },
  x: { trackId: 'fein', songTitle: 'FE!N', artist: 'Travis Scott' },
  y: { trackId: 'seven', songTitle: 'Seven', artist: 'Jung Kook' },
  z: { trackId: 'mirchi', songTitle: 'Mirchi', artist: 'DIVINE' },
};

/**
 * Match a word, slogan, diagram, or emoji from a t-shirt directly to a song:
 * 1. Diagram / Emoji symbol match (☕, 😴, 🏎️, 🔥, 💵, 🐺, ❤️, 🌶️, 🕺)
 * 2. Exact song title / artist phrase match
 * 3. Theme & semantic keyword match (sleep, drinks, speed, fire, money, love, etc.)
 * 4. Starts-with letter or word match (A-Z)
 */
export function matchTShirtWordToSong(rawText: string): {
  trackId: string;
  songTitle: string;
  reason: string;
  matchType: 'emoji' | 'exact' | 'theme' | 'startswith' | 'default';
} {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { trackId: 'big-dawgs', songTitle: 'Big Dawgs', reason: 'Default high-energy streetwear match', matchType: 'default' };
  }

  // 1. Emoji / Diagram / Symbol check
  for (const item of EMOJI_SYMBOL_REGISTRY) {
    for (const em of item.emojis) {
      if (trimmed.includes(em)) {
        return {
          trackId: item.trackId,
          songTitle: item.songTitle,
          reason: `Emoji / graphic match: "${em}" matches theme "${item.themeDescription}" → triggers "${item.songTitle}" by ${item.artist}`,
          matchType: 'emoji',
        };
      }
    }
  }

  const clean = trimmed.toLowerCase().replace(/[^a-z0-9\s!]/g, '');
  if (!clean) {
    return { trackId: 'big-dawgs', songTitle: 'Big Dawgs', reason: 'Streetwear graphic match', matchType: 'default' };
  }

  // 2. Exact Title / Artist Phrase matching
  for (const song of SONG_WORD_REGISTRY) {
    if (song.exactWords.some((w) => clean === w || clean.includes(w) || (clean.length >= 4 && w.includes(clean)))) {
      return {
        trackId: song.trackId,
        songTitle: song.songTitle,
        reason: `Direct title match: T-shirt text "${trimmed.toUpperCase()}" matches song "${song.songTitle}"`,
        matchType: 'exact',
      };
    }
  }

  // 3. Theme & Semantic Keywords (Sleep, Drinks, Coffee, Speed, Fire, Cash, Dawg, Love, Spicy, Funky, etc.)
  const tokens = clean.split(/\s+/).filter(Boolean);
  for (const song of SONG_WORD_REGISTRY) {
    for (const kw of song.semanticKeywords) {
      if (clean.includes(kw) || tokens.includes(kw)) {
        return {
          trackId: song.trackId,
          songTitle: song.songTitle,
          reason: `Theme match: T-shirt text "${trimmed.toUpperCase()}" suits "${song.songTitle}" by ${song.artist}`,
          matchType: 'theme',
        };
      }
    }
  }

  // 4. Starts-with letter matching (Song begins with the same letter or first letter of word)
  const matchLetter = clean.match(/[a-z]/);
  if (matchLetter) {
    const firstLetter = matchLetter[0];
    const startsWithMatch = ALPHABET_STARTS_WITH[firstLetter];
    if (startsWithMatch) {
      return {
        trackId: startsWithMatch.trackId,
        songTitle: startsWithMatch.songTitle,
        reason: `Starts-with match: "${trimmed.toUpperCase()}" starts with "${firstLetter.toUpperCase()}" → triggers "${startsWithMatch.songTitle}"`,
        matchType: 'startswith',
      };
    }
  }

  // 5. Default fallback to top streetwear banger
  return {
    trackId: 'big-dawgs',
    songTitle: 'Big Dawgs',
    reason: `Text statement "${trimmed.toUpperCase()}" matched to signature track "Big Dawgs"`,
    matchType: 'default',
  };
}

export function interpretTextSemantics(rawText: string): TextCue | null {
  const trimmed = rawText.trim();
  if (!trimmed || trimmed.length < 1) return null;

  const match = matchTShirtWordToSong(trimmed);

  return {
    rawText: trimmed.toUpperCase(),
    semanticSignal: match.reason,
    genreAffinity: match.songTitle,
    confidence: match.matchType === 'exact' ? 0.99 : match.matchType === 'emoji' ? 0.98 : match.matchType === 'theme' ? 0.95 : 0.9,
    matchedSongId: match.trackId,
    matchReason: match.reason,
  };
}

// =========================================================
// CAMERA T-SHIRT OCR PIPELINE (Tesseract.js)
// =========================================================

let ocrWorkerPromise: Promise<any> | null = null;

/**
 * Preloads the OCR worker lazily in the background using local Vite static assets
 */
export async function preloadOCRWorker(): Promise<any> {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = (async () => {
      try {
        const { createWorker } = await import('tesseract.js');
        const isBrowser = typeof window !== 'undefined';
        let worker: any = null;

        if (isBrowser) {
          try {
            worker = await createWorker('eng', 1, {
              workerPath: '/tessdata/worker.min.js',
              corePath: '/tessdata/tesseract-core.wasm.js',
              langPath: '/tessdata',
              gzip: false,
              cachePath: '/tessdata',
            });
            console.log('⚡ Tesseract OCR worker loaded successfully from local assets (/tessdata)');
          } catch (localErr) {
            console.warn('Local tessdata worker load failed, falling back to GitHub mirror:', localErr);
            worker = await createWorker('eng', 1, {
              langPath: 'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0',
              gzip: true,
            });
          }
        } else {
          worker = await createWorker('eng', 1, {
            langPath: './public/tessdata',
            gzip: false,
          });
        }
        return worker;
      } catch (err) {
        console.warn('Tesseract worker initialization deferred:', err);
        ocrWorkerPromise = null;
        return null;
      }
    })();
  }
  return ocrWorkerPromise;
}

/**
 * Pre-processes clothing crop for high-accuracy OCR:
 * Performs adaptive histogram stretching and edge sharpening so text on t-shirts,
 * hoodies, and dresses is crisp and legible regardless of camera lighting.
 */
export function preprocessCanvasForOCR(
  sourceCanvas: HTMLCanvasElement | CanvasRenderingContext2D,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number,
  mode: 'adaptive' | 'inverted' | 'raw' = 'adaptive'
): HTMLCanvasElement {
  const offscreen = document.createElement('canvas');
  // Scale to ideal OCR resolution (600-1000px wide)
  const targetW = Math.max(500, Math.min(1000, Math.round(cropW * 1.6)));
  const targetH = Math.max(300, Math.min(800, Math.round((cropH / Math.max(1, cropW)) * targetW)));
  offscreen.width = targetW;
  offscreen.height = targetH;

  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) return offscreen;

  const src = sourceCanvas instanceof CanvasRenderingContext2D ? sourceCanvas.canvas : sourceCanvas;
  ctx.drawImage(src, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);

  if (mode === 'raw') return offscreen;

  try {
    const imgData = ctx.getImageData(0, 0, targetW, targetH);
    const data = imgData.data;

    let minLum = 255;
    let maxLum = 0;
    let totalLum = 0;
    const pixelCount = data.length / 4;

    // First pass: compute luminance stats
    for (let i = 0; i < data.length; i += 4) {
      const lum = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
      totalLum += lum;
    }

    const avgLum = totalLum / Math.max(1, pixelCount);
    const lumRange = Math.max(20, maxLum - minLum);
    const shouldInvert = mode === 'inverted' || (mode === 'adaptive' && avgLum < 125);

    // Second pass: contrast stretching & adaptive normalization
    for (let i = 0; i < data.length; i += 4) {
      const lum = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
      let stretched = ((lum - minLum) / lumRange) * 255;
      stretched = Math.max(0, Math.min(255, stretched));

      // S-curve contrast boost to separate text ink from fabric weave
      let enhanced = stretched < 128
        ? (stretched * stretched) / 128
        : 255 - ((255 - stretched) * (255 - stretched)) / 128;

      let finalVal = shouldInvert ? (255 - enhanced) : enhanced;

      data[i] = finalVal;
      data[i + 1] = finalVal;
      data[i + 2] = finalVal;
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // If security origin restriction, proceed with standard drawn canvas
  }

  return offscreen;
}

/**
 * Scan clothing graphic chest region for potential typography presence
 */
export function extractTextRegionHeuristics(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): { hasPotentialText: boolean; confidence: number } {
  try {
    const startX = Math.floor(width * 0.15);
    const startY = Math.floor(height * 0.20);
    const sampleW = Math.max(10, Math.floor(width * 0.70));
    const sampleH = Math.max(10, Math.floor(height * 0.50));

    const imgData = ctx.getImageData(startX, startY, sampleW, sampleH);
    const data = imgData.data;

    let edgeTransitions = 0;
    let prevLuminance = 0;

    for (let i = 0; i < data.length; i += 16) {
      const lum = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
      if (Math.abs(lum - prevLuminance) > 65) {
        edgeTransitions++;
      }
      prevLuminance = lum;
    }

    const totalSamples = data.length / 16;
    const edgeRatio = edgeTransitions / Math.max(1, totalSamples);
    const hasPotentialText = edgeRatio > 0.12;

    return {
      hasPotentialText,
      confidence: Math.min(0.95, edgeRatio * 3.5),
    };
  } catch {
    return { hasPotentialText: false, confidence: 0 };
  }
}

export interface DressDesignAnalysis {
  patternLabel: string;
  graphicLabel: string;
  styleLabel: string;
  designName: string;
  designDescription: string;
  confidence: number;
  hasDistinctDesign: boolean;
}

/**
 * Direct real-time canvas analysis for dress patterns, fabric designs & graphics:
 * Detects floral prints, flames/fire artwork, motorsport speed motifs, stripes, checks, etc.
 */
export function detectClothingDesignAndPatterns(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): DressDesignAnalysis {
  try {
    const startX = Math.floor(width * 0.15);
    const startY = Math.floor(height * 0.20);
    const sampleW = Math.max(20, Math.floor(width * 0.70));
    const sampleH = Math.max(20, Math.floor(height * 0.65));

    const imgData = ctx.getImageData(startX, startY, sampleW, sampleH);
    const data = imgData.data;

    let horizontalTransitions = 0;
    let verticalTransitions = 0;
    let highContrastEdges = 0;

    // Color distribution counters
    let redWarmCount = 0;
    let greenBotanicalCount = 0;
    let pinkPastelCount = 0;
    let neonElectricCount = 0;
    let goldYellowCount = 0;
    let darkCount = 0;
    let sampleCount = 0;

    const rowStep = Math.max(2, Math.floor(sampleH / 60));
    const colStep = Math.max(2, Math.floor(sampleW / 60));

    let prevLum = 0;

    for (let y = 0; y < sampleH; y += rowStep) {
      for (let x = 0; x < sampleW; x += colStep) {
        const idx = (y * sampleW + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        sampleCount++;

        const lum = (r * 299 + g * 587 + b * 114) / 1000;
        const delta = Math.abs(lum - prevLum);
        if (delta > 55) {
          horizontalTransitions++;
          highContrastEdges++;
        }
        prevLum = lum;

        if (lum < 55) darkCount++;

        // Warm fiery colors (red/orange/crimson)
        if (r > 150 && r > g * 1.25 && r > b * 1.35) redWarmCount++;
        // Botanical / nature greens
        if (g > 95 && g > r * 1.12 && g > b * 1.12) greenBotanicalCount++;
        // Floral pinks / pastels / magenta
        if (r > 160 && b > 130 && g < r * 0.95) pinkPastelCount++;
        // Golden / yellow festive embroidery
        if (r > 175 && g > 150 && b < 100) goldYellowCount++;
        // Neon / electric accents
        if ((r > 190 && g > 190 && b < 100) || (g > 190 && b > 190 && r < 100)) neonElectricCount++;
      }
    }

    // Vertical transitions sampling (for checks, plaid, grids)
    for (let x = 0; x < sampleW; x += colStep * 2) {
      let vPrevLum = 0;
      for (let y = 0; y < sampleH; y += rowStep) {
        const idx = (y * sampleW + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const lum = (r * 299 + g * 587 + b * 114) / 1000;
        if (Math.abs(lum - vPrevLum) > 55) verticalTransitions++;
        vPrevLum = lum;
      }
    }

    const totalSamples = Math.max(1, sampleCount);
    const edgeRatio = highContrastEdges / totalSamples;
    const floralRatio = (pinkPastelCount + greenBotanicalCount) / totalSamples;
    const flameRatio = redWarmCount / totalSamples;
    const neonRatio = neonElectricCount / totalSamples;
    const goldRatio = goldYellowCount / totalSamples;
    const darkRatio = darkCount / totalSamples;

    // 1. Floral / Botanical Printed Dress or Top
    if (
      floralRatio > 0.05 ||
      pinkPastelCount > totalSamples * 0.03 ||
      (greenBotanicalCount > totalSamples * 0.04 && highContrastEdges > totalSamples * 0.08)
    ) {
      return {
        patternLabel: 'floral flower botanical printed clothing',
        graphicLabel: 'soft botanical flowers roses graphic',
        styleLabel: 'dreamy pastel soft aesthetic clothing',
        designName: 'Floral Botanical Dress/Print',
        designDescription: 'Floral botanical flower print & organic color motifs detected on clothing',
        confidence: 0.95,
        hasDistinctDesign: true,
      };
    }

    // 2. Festive Ethnic / Traditional Gold Embroidery
    if (goldRatio > 0.06 && highContrastEdges > totalSamples * 0.10) {
      return {
        patternLabel: 'ethnic traditional embroidery patterns on clothing',
        graphicLabel: 'ornate traditional motif',
        styleLabel: 'elegant classy formal dress or traditional attire',
        designName: 'Festive / Ornate Embroidery Design',
        designDescription: 'Golden border & ornate decorative embroidery detected on dress/outfit',
        confidence: 0.92,
        hasDistinctDesign: true,
      };
    }

    // 3. Fire / Flame / Aggressive Intense Graphic
    if (flameRatio > 0.08 && edgeRatio > 0.10) {
      return {
        patternLabel: 'large graphic illustration printed on clothing',
        graphicLabel: 'fire flames aggressive intense graphics',
        styleLabel: 'edgy punk dark rocker leather outfit',
        designName: 'Flames & Fire Artwork Graphic',
        designDescription: 'High-intensity flame and fire graphic illustration detected on clothing',
        confidence: 0.93,
        hasDistinctDesign: true,
      };
    }

    // 4. Racing / Speed / Sports Graphic
    if ((neonRatio > 0.04 || (flameRatio > 0.04 && edgeRatio > 0.15)) && darkRatio > 0.30) {
      return {
        patternLabel: 'sports team athletic jersey with numbers',
        graphicLabel: 'racing cars motorsport speed graphics',
        styleLabel: 'streetwear urban fashion outfit with hoodie or graphic tee',
        designName: 'Racing & Motorsport Speed Graphic',
        designDescription: 'High-contrast racing speed motifs & dynamic typography on clothing',
        confidence: 0.92,
        hasDistinctDesign: true,
      };
    }

    // 5. Checkered / Plaid Pattern
    if (horizontalTransitions > totalSamples * 0.18 && verticalTransitions > totalSamples * 0.14) {
      return {
        patternLabel: 'checkered plaid patterned clothing',
        graphicLabel: 'plain clothing',
        styleLabel: 'alternative indie grunge dark aesthetic clothing',
        designName: 'Plaid / Checkered Pattern Outfit',
        designDescription: 'Grid / tartan check pattern detected across fabric',
        confidence: 0.90,
        hasDistinctDesign: true,
      };
    }

    // 6. Striped / Linear Pattern
    if (horizontalTransitions > totalSamples * 0.19) {
      return {
        patternLabel: 'striped patterned clothing',
        graphicLabel: 'plain clothing',
        styleLabel: 'relaxed everyday casual comfortable outfit',
        designName: 'Striped Pattern Clothing',
        designDescription: 'Distinct horizontal stripe rhythm detected across fabric',
        confidence: 0.89,
        hasDistinctDesign: true,
      };
    }

    // 7. Graphic Illustration Print on Chest (Artwork, Band Graphic, Slogan)
    if (edgeRatio > 0.12) {
      return {
        patternLabel: 'large graphic illustration printed on clothing',
        graphicLabel: 'large graphic illustration printed on clothing',
        styleLabel: darkRatio > 0.45 ? 'alternative indie grunge dark aesthetic clothing' : 'streetwear urban fashion outfit with hoodie or graphic tee',
        designName: 'Bold Graphic Art Print',
        designDescription: 'Central graphic artwork print detected on clothing chest',
        confidence: 0.91,
        hasDistinctDesign: true,
      };
    }

    // 8. Solid / Minimalist Fabric
    return {
      patternLabel: 'plain solid color clothing without patterns',
      graphicLabel: 'plain clothing',
      styleLabel: darkRatio > 0.5 ? 'alternative indie grunge dark aesthetic clothing' : 'clean minimal monochrome simple outfit',
      designName: 'Clean Minimal Solid Fit',
      designDescription: 'Minimalist solid fabric without heavy prints',
      confidence: 0.85,
      hasDistinctDesign: false,
    };
  } catch {
    return {
      patternLabel: 'plain solid color clothing without patterns',
      graphicLabel: 'plain clothing',
      styleLabel: 'streetwear urban fashion outfit with hoodie or graphic tee',
      designName: 'Street Clothing',
      designDescription: 'Street style clothing',
      confidence: 0.8,
      hasDistinctDesign: false,
    };
  }
}

/**
 * Evaluates raw detected text and maps it to a valid song match:
 * 1. Multi-word slogan phrases (e.g. "JUST DO IT", "BIG DAWGS", "NOT LIKE US", "NO SLEEP")
 * 2. Exact word / artist title match
 * 3. Semantic theme match
 * 4. Starts-with letter match (A through Z)
 */
export function evaluateDetectedTextString(rawText: string): { text: string; cleanWord: string; cue: TextCue } | null {
  if (!rawText) return null;

  // Split and sanitize tokens
  const cleanTokens = rawText
    .split(/[\r\n\t\s]+/)
    .map((w) => w.replace(/[^a-zA-Z0-9!]/g, '').trim())
    .filter((w) => w.length >= 1);

  if (cleanTokens.length === 0) return null;

  // 1. Check whole multi-word phrase (e.g. "JUST DO IT", "NO SLEEP", "BIG DAWGS", "NOT LIKE US", "TRAVIS SCOTT")
  const wholePhrase = cleanTokens.join(' ').trim();
  if (wholePhrase.length >= 3) {
    const phraseMatch = matchTShirtWordToSong(wholePhrase);
    if (phraseMatch.matchType === 'exact' || phraseMatch.matchType === 'theme' || phraseMatch.matchType === 'emoji') {
      const cue = interpretTextSemantics(wholePhrase);
      if (cue) return { text: rawText, cleanWord: wholePhrase.toUpperCase(), cue };
    }
  }

  // 2. Check individual tokens for exact or theme match
  for (const token of cleanTokens) {
    if (token.length >= 2) {
      const match = matchTShirtWordToSong(token);
      if (match.matchType === 'exact' || match.matchType === 'theme' || match.matchType === 'emoji') {
        const cue = interpretTextSemantics(token);
        if (cue) return { text: rawText, cleanWord: token.toUpperCase(), cue };
      }
    }
  }

  // 3. Find the most salient word (length >= 2, alphabetic) for starts-with or category matching
  const alphaTokens = cleanTokens
    .map((t) => t.replace(/[^a-zA-Z]/g, '').trim())
    .filter((t) => t.length >= 2);

  if (alphaTokens.length > 0) {
    // Sort descending by length so prominent words ("BROOKLYN", "ATHLETIC", "CHAMPION", "ESSENTIALS") get evaluated first
    const sortedWords = [...alphaTokens].sort((a, b) => b.length - a.length);
    for (const word of sortedWords) {
      const cue = interpretTextSemantics(word);
      if (cue) {
        return { text: rawText, cleanWord: word.toUpperCase(), cue };
      }
    }
  }

  // 4. Single prominent capital letter (A-Z) (e.g., "N", "F", "C", "S", "B", "M", "T")
  const singleLetter = rawText.replace(/[^a-zA-Z]/g, '').trim();
  if (singleLetter.length === 1) {
    const cue = interpretTextSemantics(singleLetter);
    if (cue) {
      return { text: singleLetter, cleanWord: singleLetter.toUpperCase(), cue };
    }
  }

  return null;
}

/**
 * Recognize text directly from clothing / shirt / dress regions with multi-pass scanning
 */
export async function recognizeTextFromShirtCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): Promise<{ text: string; cleanWord: string; cue: TextCue } | null> {
  try {
    // Step 0: Hardware-accelerated native TextDetector (Available in Chromium browsers)
    if (typeof window !== 'undefined' && 'TextDetector' in window) {
      try {
        const detector = new (window as any).TextDetector();
        const detected = await detector.detect(ctx.canvas);
        if (detected && detected.length > 0) {
          for (const item of detected) {
            const raw = (item.rawValue || '').trim();
            if (raw) {
              const matched = evaluateDetectedTextString(raw);
              if (matched) {
                console.log('⚡ Native TextDetector recognized:', matched.cleanWord);
                return matched;
              }
            }
          }
        }
      } catch {}
    }

    const worker = await preloadOCRWorker();
    if (!worker) return null;

    // Multi-pass scanning across chest, logo, waist, and full clothing regions
    const regions = [
      // 1. Center chest (primary graphic tee text / slogans)
      { x: Math.floor(width * 0.08), y: Math.floor(height * 0.12), w: Math.floor(width * 0.84), h: Math.floor(height * 0.48) },
      // 2. Upper chest & collar (brand badges, pocket logos, sports jerseys)
      { x: Math.floor(width * 0.12), y: Math.floor(height * 0.08), w: Math.floor(width * 0.76), h: Math.floor(height * 0.36) },
      // 3. Mid-torso to dress skirt (hoodie prints, dress texts, long slogans)
      { x: Math.floor(width * 0.10), y: Math.floor(height * 0.28), w: Math.floor(width * 0.80), h: Math.floor(height * 0.52) },
      // 4. Wide clothing frame (all-over typography & full outfit coverage)
      { x: Math.floor(width * 0.05), y: Math.floor(height * 0.08), w: Math.floor(width * 0.90), h: Math.floor(height * 0.82) },
    ];

    const psmModes = ['11', '6'];
    const preprocessModes: Array<'adaptive' | 'inverted' | 'raw'> = ['adaptive', 'inverted', 'raw'];

    for (const reg of regions) {
      for (const prepMode of preprocessModes) {
        const processedCanvas = preprocessCanvasForOCR(ctx, reg.x, reg.y, reg.w, reg.h, prepMode);

        for (const psm of psmModes) {
          try {
            await worker.setParameters({ tessedit_pageseg_mode: psm });
          } catch {}

          const result = await worker.recognize(processedCanvas);
          const rawText = (result?.data?.text || '').trim();
          if (!rawText || rawText.length < 1) continue;

          const matched = evaluateDetectedTextString(rawText);
          if (matched) {
            console.log(`👕 T-Shirt OCR extracted: "${matched.cleanWord}" [mode: ${prepMode}, psm: ${psm}]`);
            return matched;
          }
        }
      }
    }

    return null;
  } catch (err) {
    console.warn('OCR error during camera clothing scan:', err);
    return null;
  }
}


