import { range, shuffle } from 'es-toolkit';
import * as np from 'numpy-ts';
import { useEffect } from 'react';

export function drawGreyscaleImage(canvas: HTMLCanvasElement, img: np.NDArray<'uint8'>) {
  const [height, width] = img.shape;

  [canvas.height, canvas.width] = img.shape;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.createImageData(width, height);

  const flat = img.flatten().data as Uint8Array;
  for (let i = 0; i < flat.length; ++i) {
    const v = flat[i];
    const idx = i * 4;

    imageData.data[idx + 0] = v;
    imageData.data[idx + 1] = v;
    imageData.data[idx + 2] = v;
    imageData.data[idx + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

export function drawRGBAImage(canvas: HTMLCanvasElement, img: np.NDArray<'uint8'>) {
  const [height, width, channels] = img.shape;

  if (channels !== 4) throw new Error('Expected 4 channels in RGBA image');

  [canvas.height, canvas.width] = img.shape;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.createImageData(width, height);

  const flat = img.flatten().data as Uint8Array;
  for (let idx = 0; idx < flat.length; idx += 4) {
    imageData.data[idx + 0] = flat[idx + 0];
    imageData.data[idx + 1] = flat[idx + 1];
    imageData.data[idx + 2] = flat[idx + 2];
    imageData.data[idx + 3] = flat[idx + 3];
  }

  ctx.putImageData(imageData, 0, 0);
}

export function useSortAnimation({
  algorithm,
  draw,
  n,
}: {
  algorithm: (arr: number[]) => Generator<number[]>;
  n: number;
  draw: (idx: number[]) => void;
}) {
  useEffect(() => {
    const arr = shuffle(range(n));
    const sortGenerator = algorithm(arr);

    function drawCallback() {
      const res = sortGenerator.next();

      if (res.done) {
        return;
      }

      draw(res.value);
    }

    const interval = setInterval(drawCallback, 10);

    return () => {
      clearInterval(interval);
    };
  }, [algorithm, draw, n]);
}
