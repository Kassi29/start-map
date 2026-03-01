import {Star} from './start.interface';

export interface ProjectedElement extends Star {
  altitude: number;
  azimuth: number;
  x: number;
  y: number;
}
