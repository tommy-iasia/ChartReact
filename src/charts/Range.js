export class Range {
  constructor(minimum, maximum) {
    this.minimum = minimum;
    this.maximum = maximum;
  }

  equals(range) {
    return this.minimum?.equals?.(range?.minimum) && this.maximum?.equals?.(range?.maximum);
  }
}
