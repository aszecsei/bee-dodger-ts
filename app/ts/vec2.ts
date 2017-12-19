export class Vector2 {
  constructor(public x: number, public y: number) { }

  public get inverseNorm(): number {
    return 1.0 / Math.sqrt(this.x * this.x + this.y * this.y);
  }
}
