// @ts-ignore
import { describe, expect, test } from "bun:test";
import { Vector2 } from "../../src";

describe("constructor", () => {
  test("no arguments -> (0, 0)", () => {
    const v = new Vector2();
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
  });

  test("x, y -> (x, y)", () => {
    const v = new Vector2(1, 2);
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
  });

  test("[x, y] -> (x, y)", () => {
    const v = new Vector2([1, 2]);
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
  });

  test("{x, y} -> (x, y)", () => {
    const v = new Vector2({ x: 1, y: 2 });
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
  });

  test("x -> (x, x)", () => {
    const v = new Vector2(new Vector2(1));
    expect(v.x).toBe(1);
    expect(v.y).toBe(1);
  });

  test("{width, height} -> (width, height)", () => {
    const v = new Vector2({ width: 1, height: 2 });
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
  });
});

describe("fromPolar", () => {
  test.each([
    [1, 0, [1, 0]],
    [2, Math.PI / 2, [0, 2]],
    [0.5, Math.PI, [-0.5, 0]],
    [1, (Math.PI * 3) / 2, [0, -1]],
    [4, Math.PI / 4, [2.83, 2.83]],
  ])(
    "r = %p, angle = %p -> %p",
    (r: number, angle: number, expected: [number, number]) => {
      const v = Vector2.fromPolar(angle, r);
      expect(v.x).toBeCloseTo(expected[0]);
      expect(v.y).toBeCloseTo(expected[1]);
    },
  );

  test("default r", () => {
    const v = Vector2.fromPolar(Math.PI / 2);
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(1);
  });
});

describe("negate vector", () => {
  test.each([
    [
      [1, 2],
      [-1, -2],
    ],
    [
      [4, 5],
      [-4, -5],
    ],
    [
      [-2.5, 4.8],
      [2.5, -4.8],
    ],
  ])("%p -> %p", (vector: [number, number], expected: [number, number]) => {
    const a = new Vector2(vector[0], vector[1]);
    const b = new Vector2(expected[0], expected[1]);
    expect(a.negate()).toEqual(b);
  });
});

describe("angleBetween", () => {
  test("90deg", () => {
    const a = new Vector2(1, 0);
    const b = new Vector2(0, 1);

    expect(a.angleBetween(b)).toBeCloseTo(Math.PI / 2);
    expect(b.angleBetween(a)).toBeCloseTo(Math.PI / 2);
  });

  test("same vector", () => {
    const a = new Vector2(1, 0);
    expect(a.angleBetween(a)).toBe(0);
  });

  test("opposite vector", () => {
    const a = new Vector2(1, 0);
    const b = new Vector2(-1, 0);
    expect(a.angleBetween(b)).toBeCloseTo(Math.PI);
    expect(b.angleBetween(a)).toBeCloseTo(Math.PI);
  });

  test("45deg", () => {
    const a = new Vector2(1, 0);
    const b = new Vector2(1, 1);
    expect(a.angleBetween(b)).toBeCloseTo(Math.PI / 4);
    expect(b.angleBetween(a)).toBeCloseTo(Math.PI / 4);
  });
});

describe("distanceTo", () => {
  test("same vector", () => {
    const a = new Vector2(1, 0);
    expect(a.distanceTo(a)).toBe(0);
  });

  test("opposite vector", () => {
    const a = new Vector2(1, 0);
    const b = new Vector2(-1, 0);
    expect(a.distanceTo(b)).toBe(2);
    expect(b.distanceTo(a)).toBe(2);
  });

  test("90 deg", () => {
    const a = new Vector2(1, 0);
    const b = new Vector2(0, 1);
    expect(a.distanceTo(b)).toBeCloseTo(Math.sqrt(2));
    expect(b.distanceTo(a)).toBeCloseTo(Math.sqrt(2));
  });

  test("45 deg", () => {
    const a = new Vector2(1, 0);
    const b = new Vector2(1, 1);
    expect(a.distanceTo(b)).toBe(1);
    expect(b.distanceTo(a)).toBe(1);
  });
});

describe("normalized", () => {
  test.each([
    [
      [5, 0],
      [1, 0],
    ],
    [
      [1, 1],
      [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
    ],
    [
      [-4, 0],
      [-1, 0],
    ],
    [
      [-1, -1],
      [-1 / Math.sqrt(2), -1 / Math.sqrt(2)],
    ],
  ])("%p -> %p", (vector: [number, number], expected: [number, number]) => {
    const a = new Vector2(vector[0], vector[1]);
    const b = new Vector2(expected[0], expected[1]);
    expect(a.normalized()).toEqual(b);
  });
});

describe("perpendicular", () => {
  test.each([
    [
      [5, 0],
      [0, -5],
    ],
    [
      [1, 1],
      [1, -1],
    ],
    [
      [-4, 0],
      [0, 4],
    ],
    [
      [-1, -1],
      [-1, 1],
    ],
  ])("%p -> %p", (vector: [number, number], expected: [number, number]) => {
    const a = new Vector2(vector[0], vector[1]);
    const b = new Vector2(expected[0], expected[1]);
    expect(a.perpendicular()).toEqual(b);
  });
});

describe("scale", () => {
  test.each([
    [[1, 2], 3, [3, 6]],
    [[4, 5], 6, [24, 30]],
    [[-2.5, 4.8], 1.5, [-3.75, 7.2]],
    [[3.8, 2.7], 0, [0, 0]],
  ])(
    "%p * %p -> %p",
    (vector: [number, number], scale: number, expected: [number, number]) => {
      const a = new Vector2(vector[0], vector[1]).scale(scale);
      expect(a.x).toBeCloseTo(expected[0]);
      expect(a.y).toBeCloseTo(expected[1]);
    },
  );
});

describe("angle", () => {
  test.each([
    [[1, 0], 0],
    [[0, 1], Math.PI / 2],
    [[-1, 0], Math.PI],
    [[0, -1], -Math.PI / 2],
    [[1, 1], Math.PI / 4],
    [[-1, 1], (Math.PI * 3) / 4],
    [[-1, -1], (-Math.PI * 3) / 4],
    [[1, -1], -Math.PI / 4],
  ])("%p -> %p", (vector: [number, number], expected: number) => {
    const a = new Vector2(vector[0], vector[1]);
    expect(a.angle).toBeCloseTo(expected);
  });
});

describe("angleDegrees", () => {
  test.each([
    [[1, 0], 0],
    [[0, 1], 90],
    [[-1, 0], 180],
    [[0, -1], -90],
    [[1, 1], 45],
    [[-1, 1], 135],
    [[-1, -1], -135],
    [[1, -1], -45],
  ])("%p -> %p", (vector: [number, number], expected: number) => {
    const a = new Vector2(vector[0], vector[1]);
    expect(a.angleDegrees).toBeCloseTo(expected);
  });
});

describe("dot", () => {
  test.each([
    [[1, 0], [0, 1], 0],
    [[3, -2], [4, -1], 14],
    [[-5, 2], [3, 4], -7],
    [[-2, -1], [-3, -4], 10],
  ])(
    "%p * %p -> %p",
    (a: [number, number], b: [number, number], expected: number) => {
      const v1 = new Vector2(a[0], a[1]);
      const v2 = new Vector2(b[0], b[1]);
      expect(v1.dot(v2)).toBe(expected);
    },
  );
});

describe("slope", () => {
  test.each([
    [[1, 1], 1],
    [[-1, 1], -1],
    [[-1, -1], 1],
    [[1, -1], -1],
    [[3, 2], 2 / 3],
    [[-3, 2], -2 / 3],
  ])("%p -> %p", (vector: [number, number], expected: number) => {
    const a = new Vector2(vector[0], vector[1]);
    expect(a.slope).toBeCloseTo(expected);
  });
});

describe("aliases", () => {
  test("width is an alias for x", () => {
    const v = new Vector2(1, 2);
    expect(v.width).toBe(1);

    v.x = 2;
    expect(v.width).toBe(2);

    v.width = 4;
    expect(v.x).toBe(4);
  });

  test("height is an alias for y", () => {
    const v = new Vector2(1, 2);
    expect(v.height).toBe(2);

    v.y = 3;
    expect(v.height).toBe(3);

    v.height = 5;
    expect(v.y).toBe(5);
  });
});
