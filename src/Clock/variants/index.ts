import type { ClockComponentProps } from '../types';
import { BlockyClock } from './BlockyClock';
import { AnalogPixelsClock } from './AnalogPixelsClock';
import { ScrollingClock } from './ScrollingClock';

export const variants: React.FC<ClockComponentProps>[] = [ScrollingClock, AnalogPixelsClock, BlockyClock];
