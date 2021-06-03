import { Point } from "./Point";

export const cubicBezier = (t, x1, y1, x2, y2) => {
  const point0 = new Point(0, 0);
  const point1 = new Point(x1, y1);
  const point2 = new Point(x2, y2);
  const point3 = new Point(1, 1);

  const factor0 = point0.multiply((1 - t) * (1 - t) * (1 - t));
  const factor1 = point1.multiply(3 * (1 - t) * (1 - t) * t);
  const factor2 = point2.multiply(3 * (1 - t) * t * t);
  const factor3 = point3.multiply(t * t * t);

  return factor0.y + factor1.y + factor2.y + factor3.y;
};

export const ease = (t) => cubicBezier(t, 0.25, 0.1, 0.25, 1);
export const easeIn = (t) => cubicBezier(t, 0.42, 0, 1, 1);
export const easeOut = (t) => cubicBezier(t, 0, 0, 0.58, 1);
export const easeInOut = (t) => cubicBezier(t, 0.42, 0, 0.58, 1);
