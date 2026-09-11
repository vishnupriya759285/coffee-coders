import { env, pipeline } from '@huggingface/transformers';

type WorkerRequest =
  | { type: 'load' }
  | { type: 'classify'; id: number; image: string };

type Cue = { label: string; score: number };

type BrowserClassifier = (image: string, labels: string[]) => Promise<Cue[]>;
let classifier: BrowserClassifier | null = null;

const labels = [
  'a person wearing dark streetwear or a graphic t-shirt',
  'a person wearing pastel or soft coloured clothing',
  'a person wearing bright colourful clothing',
  'a person wearing elegant romantic clothing',
  'a person wearing black dramatic clothing',
  'a relaxed casual outfit',
  'a person wearing sunglasses or eyeglasses',
  'a person wearing jewellery or accessories',
  'a person holding a phone',
  'a person holding food or a snack',
  'a person holding a book',
  'a person with a happy smile',
  'a person with a calm expression',
  'a patterned or printed outfit',
] as const;

async function load() {
  if (classifier) return;
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  const loaded = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32', {
    progress_callback: (progress: { status?: string; file?: string; progress?: number }) => {
      postMessage({ type: 'progress', status: progress.status, file: progress.file, progress: progress.progress });
    },
  });
  classifier = loaded as unknown as BrowserClassifier;
  postMessage({ type: 'ready' });
}

self.onmessage = async ({ data }: MessageEvent<WorkerRequest>) => {
  try {
    if (data.type === 'load') {
      await load();
      return;
    }
    await load();
    const results = await classifier!(data.image, [...labels]);
    const cues: Cue[] = results.filter((result) => result.score >= 0.14).map((result) => ({ label: result.label, score: result.score }));
    postMessage({ type: 'result', id: data.id, cues });
  } catch (error) {
    postMessage({ type: 'error', message: error instanceof Error ? error.message : 'The visual model could not start.' });
  }
};
