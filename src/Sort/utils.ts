import * as np from 'numpy-ts';

export function drawGreyscaleImage(canvas: HTMLCanvasElement, img: np.NDArray<'uint8'>) {
  const [height, width] = img.shape;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.createImageData(width, height);

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      // Use .get to ensure proper indexing (in case of transposed/strided NDArray)
      const v = img.get([y, x]);
      const idx = (y * width + x) * 4;
      imageData.data[idx + 0] = v;
      imageData.data[idx + 1] = v;
      imageData.data[idx + 2] = v;
      imageData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function drawRGBAImage(canvas: HTMLCanvasElement, img: np.NDArray<'uint8'>) {
  const [height, width, channels] = img.shape;
  if (channels !== 4) throw new Error('Expected 4 channels in RGBA image');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.createImageData(width, height);

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const idx = (y * width + x) * 4;
      // Use .get(y, x, c) to support any shape/stride
      imageData.data[idx + 0] = img.get([y, x, 0]); // R
      imageData.data[idx + 1] = img.get([y, x, 1]); // G
      imageData.data[idx + 2] = img.get([y, x, 2]); // B
      imageData.data[idx + 3] = img.get([y, x, 3]); // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
