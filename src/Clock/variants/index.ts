import type { ClockComponentProps } from '../types';
import { Blocky } from './Blocky';
import { Pixels } from './Pixels';
import { Slider } from './Slider';

export const variants: React.FC<ClockComponentProps>[] = [Slider, Pixels, Blocky];
