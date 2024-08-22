import { PossibleVector2, Vector2 } from "./Vector2.ts";

export type PossibleMatrix2D =
  | number
  | Matrix2D
  | [number, number, number, number, number, number]
  | { a: number; b: number; c: number; d: number; tx: number; ty: number }
  | DOMMatrix;

/**
 * An optimized 2x3 matrix for 2D transformations.
 */
export class Matrix2D {
  private _a: number = 1;
  private _b: number = 0;
  private _c: number = 0;
  private _d: number = 1;
  private _tx: number = 0;
  private _ty: number = 0;

  public static get identity() {
    return new Matrix2D();
  }

  public static get zero() {
    return new Matrix2D(0, 0, 0, 0, 0, 0);
  }

  public get isIdentity() {
    return (
      this._a === 1 &&
      this._b === 0 &&
      this._c === 0 &&
      this._d === 1 &&
      this._tx === 0 &&
      this._ty === 0
    );
  }

  public get a() {
    return this._a;
  }

  public get b() {
    return this._b;
  }

  public get c() {
    return this._c;
  }

  public get d() {
    return this._d;
  }

  public get tx() {
    return this._tx;
  }

  public get ty() {
    return this._ty;
  }

  public get inverse(): Matrix2D {
    const { _a, _b, _c, _d, _tx, _ty } = this;
    const det = this.determinant;
    if (det === 0) {
      return new Matrix2D();
    }
    return new Matrix2D(
      _d / det,
      -_b / det,
      -_c / det,
      _a / det,
      (_c * _ty - _d * _tx) / det,
      (_b * _tx - _a * _ty) / det,
    );
  }

  public get determinant(): number {
    return this._a * this._d - this._b * this._c;
  }

  public constructor();
  public constructor(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
  );
  public constructor(value?: PossibleMatrix2D);
  public constructor(a?: any, b?: any, c?: any, d?: any, tx?: any, ty?: any) {
    if (a === undefined) {
      return;
    }

    if (Array.isArray(a)) {
      this._a = a[0];
      this._b = a[1];
      this._c = a[2];
      this._d = a[3];
      this._tx = a[4];
      this._ty = a[5];
      return;
    }

    if (typeof a === "number") {
      if (typeof b === "number") {
        this._a = a;
        this._b = b;
        this._c = c;
        this._d = d;
        this._tx = tx;
        this._ty = ty;
      } else {
        this._a = a;
        this._b = a;
        this._c = a;
        this._d = a;
        this._tx = a;
        this._ty = a;
      }
      return;
    }

    if (a instanceof DOMMatrix) {
      this._a = a.a;
      this._b = a.b;
      this._c = a.c;
      this._d = a.d;
      this._tx = a.e;
      this._ty = a.f;
      return;
    }

    if (typeof a === "object") {
      this._a = a.a;
      this._b = a.b;
      this._c = a.c;
      this._d = a.d;
      this._tx = a.tx;
      this._ty = a.ty;
      return;
    }
  }

  public translate(by: PossibleVector2) {
    const v = Vector2.wrap(by);
    this._tx += v.x;
    this._ty += v.y;
    return this;
  }

  public scale(by: PossibleVector2) {
    const v = Vector2.wrap(by);
    this._a *= v.x;
    this._b *= v.x;
    this._c *= v.y;
    this._d *= v.y;
    return this;
  }

  public rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const { _a, _b, _c, _d } = this;
    this._a = _a * cos - _b * sin;
    this._b = _a * sin + _b * cos;
    this._c = _c * cos - _d * sin;
    this._d = _c * sin + _d * cos;
    return this;
  }

  public multiply(other: Matrix2D) {
    const { _a, _b, _c, _d, _tx, _ty } = this;
    this._a = _a * other._a + _b * other._c;
    this._b = _a * other._b + _b * other._d;
    this._c = _c * other._a + _d * other._c;
    this._d = _c * other._b + _d * other._d;
    this._tx = _tx * other._a + _ty * other._c + other._tx;
    this._ty = _tx * other._b + _ty * other._d + other._ty;
    return this;
  }

  public equals(other: Matrix2D, threshold: number = 0.000001) {
    return (
      Math.abs(this._a - other._a) <= threshold + Number.EPSILON &&
      Math.abs(this._b - other._b) <= threshold + Number.EPSILON &&
      Math.abs(this._c - other._c) <= threshold + Number.EPSILON &&
      Math.abs(this._d - other._d) <= threshold + Number.EPSILON &&
      Math.abs(this._tx - other._tx) <= threshold + Number.EPSILON &&
      Math.abs(this._ty - other._ty) <= threshold + Number.EPSILON
    );
  }
}
