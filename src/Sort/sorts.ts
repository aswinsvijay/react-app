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

export const algorithms = ['bubble'] as const;
export const algorithmFunctions: Record<(typeof algorithms)[number], (arr: number[]) => Generator<number[]>> = {
  bubble,
};
