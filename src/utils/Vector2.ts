export type PossibleVector2 =
  | Vector2
  | [number, number]
  | { x: number; y: number };

const RAD2DEG = 180 / Math.PI;

export class Vector2 {
  public x: number;
  public y: number;

  public static wrap(vector: PossibleVector2): Vector2 {
    if (vector instanceof Vector2) {
      return vector;
    }
    return new Vector2(vector);
  }

  public static fromAngle(angle: number) {
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }

  public static fromPolar(angle: number, r: number = 1) {
    return new Vector2(r * Math.cos(angle), r * Math.sin(angle));
  }

  public get angle() {
    return Math.atan2(this.y, this.x);
  }

  public get angleDegrees() {
    return this.angle * RAD2DEG;
  }

  public get slope() {
    return this.y / this.x;
  }

  constructor();
  constructor(x: number, y: number);
  constructor(possibleVector: PossibleVector2);
  constructor(x?: any, y?: any) {
    if (typeof x === "number" && typeof y === "number") {
      this.x = x;
      this.y = y;
    } else if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
    } else if (typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = 0;
      this.y = 0;
    }
  }

  public add(vector: PossibleVector2) {
    const other = Vector2.wrap(vector);
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public sub(vector: PossibleVector2) {
    const other = Vector2.wrap(vector);
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public mul(vector: PossibleVector2) {
    const other = Vector2.wrap(vector);
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  public div(vector: PossibleVector2) {
    const other = new Vector2(vector);
    return new Vector2(this.x / other.x, this.y / other.y);
  }

  public dot(vector: PossibleVector2) {
    const other = new Vector2(vector);
    return this.x * other.x + this.y * other.y;
  }

  public scale(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  public length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalized() {
    return new Vector2(this.x / this.length(), this.y / this.length());
  }

  public negate() {
    return new Vector2(-this.x, -this.y);
  }

  public perpendicular() {
    return new Vector2(this.y, -this.x);
  }

  /**
   * Rotates the vector by the given angle around the origin.
   *
   * @param angle The angle to rotate by in radians.
   */
  public rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
    );
  }

  /**
   * Sets the angle of the vector with the x-axis.
   *
   * This method mutates the vector.
   *
   * @param angle The angle between the vector and the x-axis in radians.
   */
  public setAngle(angle: number) {
    const length = this.length();
    this.x = length * Math.cos(angle);
    this.y = length * Math.sin(angle);
  }

  public angleBetween(vector: PossibleVector2) {
    return Math.acos(
      this.dot(vector) / (this.length() * Vector2.wrap(vector).length()),
    );
  }

  /**
   * Returns the distance between this vector and another.
   *
   * @param vector The other vector.
   */
  public distanceTo(vector: PossibleVector2) {
    return this.sub(Vector2.wrap(vector)).length();
  }
}
