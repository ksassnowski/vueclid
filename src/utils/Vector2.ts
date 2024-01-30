export type PossibleVector2 =
  | number
  | Vector2
  | [number, number]
  | { x: number; y: number };

const RAD2DEG = 180 / Math.PI;

/**
 * A 2D vector.
 */
export class Vector2 {
  /**
   * The x component of the vector.
   */
  public x: number;

  /**
   * The y component of the vector.
   */
  public y: number;

  /**
   * Wraps a value in a vector.
   *
   * If the value is already a vector, it is returned unchanged.
   *
   * @param value The value to wrap.
   */
  public static wrap(value: PossibleVector2): Vector2 {
    if (value instanceof Vector2) {
      return value;
    }
    return new Vector2(value);
  }

  /**
   * Creates a vector with length 1 from an angle with the x-axis.
   *
   * @param angle The angle of the vector with the x-axis in radians.
   */
  public static fromAngle(angle: number) {
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }

  /**
   * Creates a vector from polar coordinates.
   *
   * @param angle The angle of the vector with the x-axis in radians.
   * @param r The magnitude of the vector.
   */
  public static fromPolar(angle: number, r: number = 1) {
    return new Vector2(r * Math.cos(angle), r * Math.sin(angle));
  }

  /**
   * Returns the angle of the vector with the x-axis in radians.
   */
  public get angle() {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Returns the angle of the vector with the x-axis in degrees.
   */
  public get angleDegrees() {
    return this.angle * RAD2DEG;
  }

  /**
   * Returns the slope of the vector.
   */
  public get slope() {
    return this.y / this.x;
  }

  constructor();
  constructor(xy: number);
  constructor(x: number, y: number);
  constructor(possibleVector: PossibleVector2);
  constructor(x?: any, y?: any) {
    if (typeof x === "number") {
      this.x = x;
      this.y = x;
      if (typeof y === "number") {
        this.y = y;
      }
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

  /**
   * Returns the sum of this vector and the other.
   *
   * @param vector The other vector.
   */
  public add(vector: PossibleVector2) {
    const other = Vector2.wrap(vector);
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  /**
   * Returns the difference between this vector and the other.
   *
   * @param vector The other vector.
   */
  public sub(vector: PossibleVector2) {
    const other = Vector2.wrap(vector);
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  /**
   * Multiplies each component of the vector by the corresponding component of
   * the other vector.
   *
   * @param vector The other vector.
   */
  public mul(vector: PossibleVector2) {
    const other = Vector2.wrap(vector);
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  /**
   * Divides each component of the vector by the corresponding component of the
   * other vector.
   *
   * @param vector The other vector.
   */
  public div(vector: PossibleVector2) {
    const other = new Vector2(vector);
    return new Vector2(this.x / other.x, this.y / other.y);
  }

  /**
   * Returns the dot product of this vector and another.
   *
   * @param vector The other vector.
   */
  public dot(vector: PossibleVector2) {
    const other = new Vector2(vector);
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Scales both components of the vector by the given scalar.
   *
   * @param scalar The scalar to scale by.
   */
  public scale(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * Returns the magnitude of the vector.
   */
  public length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns a vector with the same direction but a magnitude of 1.
   */
  public normalized() {
    return new Vector2(this.x / this.length(), this.y / this.length());
  }

  /**
   * Returns a vector with the same magnitude but opposite direction.
   */
  public negate() {
    return new Vector2(-this.x, -this.y);
  }

  /**
   * Returns a vector perpendicular to this one.
   */
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
