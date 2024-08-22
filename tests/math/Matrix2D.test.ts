// @ts-ignore
import { describe, expect, test } from "bun:test";
import { Matrix2D, PossibleMatrix2D } from "../../src/utils/Matrix2D";

test.each([
  [[1, 0, 0, 1, 0, 0], true],
  [[2, 0, 0, 2, 0, 0], false],
])(
  "isIdentity: values = %p -> %p",
  (values: PossibleMatrix2D, expected: boolean) => {
    const m = new Matrix2D(values);
    expect(m.isIdentity).toBe(expected);
  },
);

describe("equality", () => {
  test.each([
    [[1, 0, 0, 1, 0, 0], [1, 0, 0, 1, 0, 0], true],
    [[2, 2, 0, 1, 0, 0], [2, 2, 0, 1, 0, 0], true],
    [[1, 0, 0, 1, 0, 0], [2, 0, 0, 2, 0, 0], false],
    [[1, 0, 0, 1, 0, 0], [1, 0, 0, 1, 0, 1], false],
  ])(
    "exactly equal: %p === %p -> %p",
    (a: PossibleMatrix2D, b: PossibleMatrix2D, expected: number) => {
      const m1 = new Matrix2D(a);
      const m2 = new Matrix2D(b);
      expect(m1.equals(m2)).toBe(expected);
    },
  );

  test.each([
    [[1.1, 0, 0, 1.1, 0, 0], [1.05, 0, 0, 1.05, 0, 0], 0.05, true],
    [[1.1, 0, 0, 1.1, 0, 0], [1.05, 0, 0, 1.05, 0, 0], 0.04, false],
    [[1.1, 0, 0, 1.1, 0, 0], [1.099999, 0, 0, 1.099999, 0, 0], undefined, true],
  ])("threshold equal: %p === %p -> %p", (a, b, threshold, expected) => {
    const m1 = new Matrix2D(a);
    const m2 = new Matrix2D(b);
    expect(m1.equals(m2, threshold)).toBe(expected);
  });
});

describe("constructor", () => {
  test("no arguments -> identity", () => {
    const m = new Matrix2D();
    expect(m.isIdentity).toBe(true);
  });

  test("static identity constructor", () => {
    const m = Matrix2D.identity;
    expect(m.isIdentity).toBe(true);
  });

  test("static zero constructor", () => {
    const m = Matrix2D.zero;
    expect(m.a).toBe(0);
    expect(m.b).toBe(0);
    expect(m.c).toBe(0);
    expect(m.d).toBe(0);
    expect(m.tx).toBe(0);
    expect(m.ty).toBe(0);
  });

  test("array of values", () => {
    const m = new Matrix2D([1, 2, 3, 4, 5, 6]);
    expect(m.a).toBe(1);
    expect(m.b).toBe(2);
    expect(m.c).toBe(3);
    expect(m.d).toBe(4);
    expect(m.tx).toBe(5);
    expect(m.ty).toBe(6);
  });

  test("individual values", () => {
    const m = new Matrix2D(1, 2, 3, 4, 5, 6);
    expect(m.a).toBe(1);
    expect(m.b).toBe(2);
    expect(m.c).toBe(3);
    expect(m.d).toBe(4);
    expect(m.tx).toBe(5);
    expect(m.ty).toBe(6);
  });

  test("single value fills all", () => {
    const m = new Matrix2D(2);
    expect(m.a).toBe(2);
    expect(m.b).toBe(2);
    expect(m.c).toBe(2);
    expect(m.d).toBe(2);
    expect(m.tx).toBe(2);
    expect(m.ty).toBe(2);
  });

  test("Matrix2D object", () => {
    const other = new Matrix2D(1, 2, 3, 1, 2, 3);
    const m = new Matrix2D(other);
    expect(m.equals(other)).toBe(true);
  });

  test("{ a, b, c, d, tx, ty }", () => {
    const m = new Matrix2D({ a: 1, b: 2, c: 3, d: 4, tx: 5, ty: 6 });
    expect(m.a).toBe(1);
    expect(m.b).toBe(2);
    expect(m.c).toBe(3);
    expect(m.d).toBe(4);
    expect(m.tx).toBe(5);
    expect(m.ty).toBe(6);
  });

  test("DOMMatrix", () => {
    const domMatrix = new DOMMatrix([1, 2, 3, 4, 5, 6]);
    const m = new Matrix2D(domMatrix);
    expect(m.a).toBe(1);
    expect(m.b).toBe(2);
    expect(m.c).toBe(3);
    expect(m.d).toBe(4);
    expect(m.tx).toBe(5);
    expect(m.ty).toBe(6);
  });
});

test("translate", () => {
  const m = new Matrix2D();
  m.translate([5, 2]);
  expect(m.equals(new Matrix2D([1, 0, 0, 1, 5, 2]))).toBe(true);
});

describe("scale", () => {
  test("single value scales both axes", () => {
    const m = new Matrix2D(1, 2, 3, 4, 5, 6);
    m.scale(2);
    expect(m.equals(new Matrix2D(2, 4, 6, 8, 5, 6))).toBe(true);
  });

  test("scale axes individually", () => {
    const m = new Matrix2D(1, 2, 3, 4, 5, 6);
    m.scale([2, 3]);
    expect(m.equals(new Matrix2D(2, 4, 9, 12, 5, 6))).toBe(true);
  });
});

describe("rotate", () => {
  test.each([[Math.PI / 2, [1, 0, 0, 1, 0, 0], [0, 1, -1, 0, 0, 0]]])(
    "angle = %p, input = %p -> %p",
    (angle: number, matrix: PossibleMatrix2D, expected: number) => {
      const m = new Matrix2D(matrix);
      m.rotate(angle);
      console.log(m);
      expect(m.equals(new Matrix2D(expected))).toBe(true);
    },
  );
});

describe("determinant", () => {
  test("identity matrix has determinant 1", () => {
    const matrix = Matrix2D.identity;
    expect(matrix.determinant).toBe(1);
  });

  test("matrix with identical columns has determinant 0", () => {
    const matrix = new Matrix2D(5, 2, 5, 2, 0, 0);
    expect(matrix.determinant).toBe(0);
  });

  test.each([
    [[3, 2, 4, 9, 0, 0], 19],
    [[1, 2, 3, 4, 0, 0], -2],
    [[6, 6, 7, 7, 0, 0], 0],
  ])("det(%p) = %p", (matrix: PossibleMatrix2D, expected: number) => {
    const m = new Matrix2D(matrix);
    expect(m.determinant).toBe(expected);
  });
});
