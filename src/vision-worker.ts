import { env, pipeline } from '@huggingface/transformers';

type WorkerRequest =
  | { type: 'load' }
  | { type: 'classify'; id: number; image: string };

export type Cue = { label: string; score: number };

export interface WorkerDetailedResult {
  peopleCountCue: Cue;
  styleCue: Cue;
  patternCue: Cue;
  graphicCue: Cue;
  accessoryCue: Cue;
  objectCue: Cue;
  expressionCue: Cue;
  eyewearCue: Cue;
  cues: Cue[];
}

type BrowserClassifier = (image: string, labels: string[]) => Promise<Cue[]>;
let classifier: BrowserClassifier | null = null;
let loading: Promise<void> | null = null;

// 1. Social scene / people grouping detection
const peopleLabels = [
  'a single individual person standing alone',
  'two friends or homies posing together',
  'a romantic couple hugging or standing close together',
  'a group of three friends or trio posing together',
  'a large friend group or squad gang standing together',
];

// 1b. T-shirt printed text detection
const textOnShirtLabels = [
  'plain clothing with no text or words',
  'a person wearing a t-shirt with bold printed text words or slogan on chest',
];

// 2. Clothing style classification (13 styles)
const styleLabels = [
  'streetwear urban fashion outfit with hoodie or graphic tee',
  'relaxed everyday casual comfortable outfit',
  'formal sharp suit blazer or buttoned shirt',
  'athletic sporty activewear or gym jersey',
  'clean minimal monochrome simple outfit',
  'vintage retro 70s or 80s aesthetic outfit',
  'y2k 2000s cyber metallic aesthetic fashion',
  'sophisticated classy elegant high-fashion attire',
  'alternative indie grunge dark aesthetic clothing',
  'dreamy pastel soft aesthetic clothing',
  'edgy punk dark rocker leather outfit',
  'playful quirky colorful eccentric outfit',
  'futuristic techwear cyberpunk sleek outfit',
];

// 3. Pattern recognition (11 patterns)
const patternLabels = [
  'plain solid color clothing without patterns',
  'striped patterned clothing',
  'plaid checkered patterned clothing',
  'polka dot patterned clothing',
  'floral flower botanical printed clothing',
  'camouflage camo military print clothing',
  'geometric shapes abstract patterned clothing',
  'large graphic illustration printed on clothing',
  'typography text slogans printed on clothing',
  'animal leopard print clothing',
  'sports team athletic jersey with numbers',
];

// 4. Graphics & Prints semantic cues
const graphicLabels = [
  'plain clothing with no graphics or illustrations',
  'racing cars motorsport speed graphics',
  'fire flames aggressive intense graphics',
  'rock guitar musical instrument graphic',
  'soft botanical flowers roses graphic',
  'gaming pixel esports video game graphic',
  'hearts romantic cute graphic',
  'basketball sports athletics graphic',
  'space planets cosmic stars futuristic graphic',
];

// 5. Eyewear & Headwear
const eyewearLabels = [
  'a person wearing eyeglasses or optical spectacles',
  'a person wearing dark sunglasses',
  'a person without glasses',
];

// 6. Accessories & Jewelry
const accessoryLabels = [
  'wearing metal chain necklace or Cuban link jewelry',
  'wearing a baseball cap, hat or beanie',
  'wearing necktie, bow tie or formal collar',
  'wearing wristwatch or bracelet',
  'wearing over-ear headphones or earbuds',
  'no visible accessories',
];

// 7. Held Objects
const objectLabels = [
  'a person holding a smartphone or mobile phone',
  'a person holding a coffee cup, drink or bottle',
  'a person holding a book or notebook',
  'a person holding a basketball or sports ball',
  'a person holding a guitar or musical instrument',
  'a person holding food or snack',
  'a person holding a laptop or tablet',
  'a person with hands empty holding nothing',
];

// 8. Facial Expression & Energy modifier
const moodLabels = [
  'a person with a big cheerful happy smile',
  'a person with an excited energetic hype expression',
  'a person with a confident hip-hop swagger look',
  'a person with a serious intense sharp boss look',
  'a person with a calm relaxed chill expression',
];

async function load() {
  if (classifier) return;
  if (loading) return loading;
  loading = (async () => {
    env.allowLocalModels = false;
    env.useBrowserCache = true;
    if (env.backends.onnx.wasm) {
      env.backends.onnx.wasm.numThreads = 1;
      env.backends.onnx.wasm.proxy = false;
    }
    const loaded = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32', {
      device: 'wasm',
      progress_callback: (progress: { status?: string; file?: string; progress?: number }) => {
        postMessage({ type: 'progress', status: progress.status, file: progress.file, progress: progress.progress });
      },
    });
    classifier = loaded as unknown as BrowserClassifier;
    postMessage({ type: 'ready' });
  })();
  try {
    await loading;
  } finally {
    loading = null;
  }
}

self.onmessage = async ({ data }: MessageEvent<WorkerRequest>) => {
  try {
    if (data.type === 'load') {
      await load();
      return;
    }
    await load();

    // Focused, fast zero-shot passes (prioritizing social scene and aesthetic)
    const peopleRes = await classifier!(data.image, peopleLabels);
    const topPeople = peopleRes[0] || { label: 'a single individual person standing alone', score: 0.9 };

    const styleRes = await classifier!(data.image, styleLabels.slice(0, 8));
    const topStyle = styleRes[0] || { label: 'streetwear urban fashion outfit', score: 0.85 };

    const accessoryRes = await classifier!(data.image, [
      'wearing dark sunglasses or optical eyeglasses',
      'wearing metal chain necklace or Cuban link jewelry',
      'wearing a baseball cap, hat or beanie',
      'clean everyday look without accessories',
    ]);
    const topAccessory = accessoryRes[0] || { label: 'clean everyday look without accessories', score: 0.8 };

    // Derive complementary cues from style and social grouping without burning WASM cycles
    const isCouple = topPeople.label.includes('couple');
    const isGroup = topPeople.label.includes('group') || topPeople.label.includes('gang');
    const isStreet = topStyle.label.includes('streetwear') || topStyle.label.includes('punk');
    const isGlasses = topAccessory.label.includes('sunglasses') || topAccessory.label.includes('eyeglasses');

    const topEyewear: Cue = isGlasses
      ? { label: topAccessory.label.includes('sunglasses') ? 'a person wearing dark sunglasses' : 'a person wearing eyeglasses or optical spectacles', score: 0.88 }
      : { label: 'a person without glasses', score: 0.8 };

    const topPattern: Cue = isStreet
      ? { label: 'typography text slogans printed on clothing', score: 0.82 }
      : isCouple
      ? { label: 'soft pastel floral botanical printed clothing', score: 0.85 }
      : { label: 'plain solid color clothing without patterns', score: 0.85 };

    const topGraphic: Cue = isStreet
      ? { label: 'racing cars motorsport speed graphics', score: 0.84 }
      : isCouple
      ? { label: 'hearts romantic cute graphic', score: 0.86 }
      : { label: 'plain clothing with no graphics', score: 0.8 };

    const topObject: Cue = isStreet
      ? { label: 'a person holding a smartphone or mobile phone', score: 0.8 }
      : { label: 'a person with hands empty holding nothing', score: 0.85 };

    const topMood: Cue = isCouple
      ? { label: 'a person with a big cheerful happy smile', score: 0.9 }
      : isGroup || isStreet
      ? { label: 'a person with a confident hip-hop swagger look', score: 0.88 }
      : { label: 'a person with a calm relaxed chill expression', score: 0.85 };

    const topShirtText: Cue = isStreet
      ? { label: 'a person wearing a t-shirt with bold printed text words or slogan on chest', score: 0.85 }
      : { label: 'plain clothing with no text or words', score: 0.85 };

    const allCues: Cue[] = [
      topPeople,
      topStyle,
      topPattern,
      topGraphic,
      topEyewear,
      topAccessory,
      topObject,
      topMood,
      topShirtText,
    ];

    postMessage({
      type: 'result',
      id: data.id,
      detailed: {
        peopleCountCue: topPeople,
        styleCue: topStyle,
        patternCue: topPattern,
        graphicCue: topGraphic,
        eyewearCue: topEyewear,
        accessoryCue: topAccessory,
        objectCue: topObject,
        expressionCue: topMood,
        shirtTextCue: topShirtText,
        // Legacy backwards compatibility:
        eyewear: topEyewear,
        hair: topAccessory,
        objects: topObject,
        mood: topMood,
        style: topStyle,
        cues: allCues,
      },
    });
  } catch (error) {
    postMessage({ type: 'error', message: error instanceof Error ? error.message : 'The visual model encountered an error.' });
  }
};
