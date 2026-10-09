import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as np from 'numpy-ts';
import { range } from 'es-toolkit';
import { drawGreyscaleImage, drawRGBAImage, useSortAnimation } from './utils';
import { algorithmFunctions, algorithms } from './sorts';

type VisualizationComponent = React.FC<{
  columns: number;
  rows: number;
  algorithm: (arr: number[]) => Generator<number[]>;
}>;

const Vertical: VisualizationComponent = ({ columns, algorithm }) => {
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

  useSortAnimation({
    algorithm,
    draw: (idx: number[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      drawGreyscaleImage(canvas, img.iindex(idx, 1));
    },
    n: columns,
  });

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

const Image: VisualizationComponent = ({ columns, rows, algorithm }) => {
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

  useSortAnimation({
    algorithm,
    draw: (idx: number[]) => {
      if (!imgArray) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const [height, width] = imgArray.shape;

      drawRGBAImage(
        canvas,
        imgArray
          .reshape(rows, height / rows, columns, width / columns, 4)
          .transpose([0, 2, 1, 3, 4])
          .reshape(rows * columns, -1)
          .iindex(idx, 0)
          .reshape(rows, columns, height / rows, width / columns, 4)
          .transpose([0, 2, 1, 3, 4])
          .reshape(height, width, 4)
      );
    },
    n: columns * rows,
  });

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
const visualizationTypeComponents: Record<(typeof visualizationTypes)[number], VisualizationComponent> = {
  Vertical,
  Image,
};

const App: React.FC<NonNullable<unknown>> = () => {
  const [algorithm, setAlgorithm] = useState<keyof typeof algorithmFunctions>('bubble');
  const [type, setType] = useState<keyof typeof visualizationTypeComponents>('Vertical');

  const [rows, setRows] = useState(20);
  const [columns, setColumns] = useState(20);

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
        <VisualizationComponent columns={columns} rows={rows} algorithm={algorithmFunction} />
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
        Rows:
        <input type="number" value={rows} onChange={(e) => setRows(e.target.valueAsNumber)} />
        Columns:
        <input type="number" value={columns} onChange={(e) => setColumns(e.target.valueAsNumber)} />
      </div>
    </div>
  );
};

export default App;
