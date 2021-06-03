import { Point } from "./Point";

export class Rectangle {
  constructor(left, top, width, height) {
    this.left = (left?.left !== undefined ? left.left : left) || 0;
    this.top = (top !== undefined ? top : left?.top) || 0;

    this.width = (width !== undefined ? width : left?.width) || 0;
    this.height = (height !== undefined ? height : left?.height) || 0;

    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  center() {
    return new Point((this.left + this.right) / 2, (this.top + this.bottom) / 2);
  }

  contains(point) {
    return (
      point.x >= this.left && point.x <= this.right && point.y >= this.top && point.y <= this.bottom
    );
  }

  collide(rectangle) {
    return (
      rectangle.left < this.left + this.width &&
      rectangle.left + rectangle.width > this.left &&
      rectangle.top < this.top + this.height &&
      rectangle.top + rectangle.height > this.top
    );
  }
}
