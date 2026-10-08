import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as np from 'numpy-ts';
import { range } from 'es-toolkit';

function* bubble(arr: number[]) {
  const N = arr.length;

  for (let i = 0; i < N; ++i) {
    for (let j = 0; j < N - i - 1; ++j) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }

    yield arr;
  }
}

const Vertical: React.FC<{ columns: number; rows: number }> = ({ columns }) => {
  const img = useMemo(() => {
    const arr = np.zeros([columns, columns], 'uint8');

    for (const i of range(columns)) {
      arr
        .col(i)
        .slice(`${-i - 1}:`)
        .fill(255);
    }

    return arr;
  }, [columns]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const [height, width] = img.shape;
    [canvas.height, canvas.width] = [height, width];

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Extract numpy-ts NDArray data to flat array
    // img.data returns TypedArray for most dtypes
    const flat = img.data as Uint8Array;

    // Create ImageData buffer (RGBA)
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < flat.length; ++i) {
      const v = flat[i]; // grayscale value 0-255
      imageData.data[i * 4 + 0] = v;
      imageData.data[i * 4 + 1] = v;
      imageData.data[i * 4 + 2] = v;
      imageData.data[i * 4 + 3] = 255; // opaque
    }
    ctx.putImageData(imageData, 0, 0);
  }, [img]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        imageRendering: 'pixelated',
      }}
    />
  );
};

const Image: React.FC<{ columns: number; rows: number }> = ({ columns, rows }) => {
  const [file, setFile] = useState<File | null>(null);
  const [imgArray, setImgArray] = useState<np.NDArray<'uint8'> | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new window.Image();

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const [height, width] = [img.height, img.width];
        [canvas.height, canvas.width] = [img.height, img.width];

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, width, height);
        using imgArray = np.zeros([height, width, 4], 'uint8');
        const flat = imgArray.data as Uint8Array;

        for (let idx = 0; idx < flat.length; idx += 4) {
          flat[idx + 0] = imageData.data[idx + 0]; // R
          flat[idx + 1] = imageData.data[idx + 1]; // G
          flat[idx + 2] = imageData.data[idx + 2]; // B
          flat[idx + 3] = imageData.data[idx + 3]; // A
        }

        const [extraHeight, extraWidth] = [height % rows, width % columns];
        const top = Math.floor(extraHeight / 2);
        const bottom = extraHeight - top;
        const left = Math.floor(extraWidth / 2);
        const right = extraWidth - left;

        using croppedImgArray = imgArray.slice(`${top}:${height - bottom}`, `${left}:${width - right}`);

        setImgArray(croppedImgArray.copy());
      };

      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }, [file, columns, rows]);

  useEffect(() => {
    if (!imgArray) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const [height, width] = imgArray.shape;
    [canvas.height, canvas.width] = imgArray.shape;
    const flat = imgArray.data as Uint8Array;
    const imageData = ctx.getImageData(0, 0, width, height);

    for (let idx = 0; idx < flat.length; idx += 4) {
      imageData.data[idx + 0] = flat[idx + 0];
      imageData.data[idx + 1] = flat[idx + 1];
      imageData.data[idx + 2] = flat[idx + 2];
      imageData.data[idx + 3] = flat[idx + 3];
    }
    ctx.putImageData(imageData, 0, 0);
  }, [imgArray]);

  if (!file) {
    return (
      <div style={{ padding: 32 }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <div style={{ marginTop: 16, color: 'gray' }}>Please select an image</div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        imageRendering: 'smooth',
        border: '1px solid black',
      }}
    />
  );
};

const visualizationTypes = ['Vertical', 'Image'] as const;
const visualizationTypeComponents: Record<
  (typeof visualizationTypes)[number],
  React.FC<{ columns: number; rows: number }>
> = {
  Vertical,
  Image,
};

const algorithms = ['bubble'] as const;
const algorithmFunctions: Record<(typeof algorithms)[number], (arr: number[]) => Generator<number[]>> = {
  bubble,
};

const App: React.FC<NonNullable<unknown>> = () => {
  const [algorithm, setAlgorithm] = useState<keyof typeof algorithmFunctions>('bubble');
  const [type, setType] = useState<keyof typeof visualizationTypeComponents>('Vertical');

  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(100);

  const algorithmFunction = algorithmFunctions[algorithm];
  const VisualizationComponent = visualizationTypeComponents[type];

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div style={{ flex: 4, border: '10px solid grey', boxSizing: 'border-box' }}>
        <VisualizationComponent columns={columns} rows={rows} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        Algorithm:
        <select
          onChange={(e) => {
            setAlgorithm(e.target.value as typeof algorithm);
          }}
        >
          {algorithms.map((value) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
        {algorithm}
        Type:
        <select
          onChange={(e) => {
            setType(e.target.value as typeof type);
          }}
        >
          {visualizationTypes.map((value) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
        {type}
        Rows:
        <input type="number" value={rows} onChange={(e) => setRows(e.target.valueAsNumber)} />
        Columns:
        <input type="number" value={columns} onChange={(e) => setColumns(e.target.valueAsNumber)} />
      </div>
    </div>
  );
};

export default App;
