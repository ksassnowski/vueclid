import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

// @ts-ignore
window.DOMMatrix = class {
  public readonly a: number = 1;
  public readonly b: number = 1;
  public readonly c: number = 1;
  public readonly d: number = 1;
  public readonly e: number = 1;
  public readonly f: number = 1;

  public readonly is2D: boolean = true;

  public get m11() {
    return this.a;
  }

  public get m12() {
    return this.b;
  }

  public get m13() {
    return 0;
  }

  public get m14() {
    return 0;
  }

  public get m21() {
    return this.c;
  }

  public get m22() {
    return this.d;
  }

  public get m23() {
    return 0;
  }

  public get m24() {
    return 0;
  }

  public get m31() {
    return 0;
  }

  public get m32() {
    return 0;
  }

  public get m33() {
    return 1;
  }

  public get m41() {
    return this.e;
  }

  public get m42() {
    return this.f;
  }

  public get m43() {
    return 0;
  }

  public get m44() {
    return 1;
  }

  constructor(values: [number, number, number, number, number, number]) {
    this.a = values[0];
    this.b = values[1];
    this.c = values[2];
    this.d = values[3];
    this.e = values[4];
    this.f = values[5];
  }
};
