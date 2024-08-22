import { Vector2 } from "./Vector2";
import { TAU } from "./constants";

function isAngleBetweenAngles(
  angle: number,
  theta1: number,
  theta2: number,
): boolean {
  theta1 = (theta1 + TAU) % TAU;
  theta2 = (theta2 + TAU) % TAU;
  angle = (angle + TAU) % TAU;

  if (theta2 === 0) {
    theta2 = TAU;
  }

  if (theta1 < theta2) {
    return theta1 <= angle && angle < theta2;
  }

  return angle >= theta1 || angle < theta2;
}

function circularDifference(alpha: number, beta: number): number {
  alpha = (alpha + TAU) % TAU;
  beta = (beta + TAU) % TAU;
  return Math.min((beta - alpha + TAU) % TAU, (alpha - beta + TAU) % TAU);
}

function findClosestAngleToAngle(
  angle: number,
  alpha: number,
  beta: number,
): number {
  const diff1 = circularDifference(angle, alpha);
  const diff2 = circularDifference(angle, beta);
  return diff1 < diff2 ? alpha : beta;
}

/**
 * Checks if the given point is inside the circle with
 * the given center and radius.
 *
 * @param center - The center of the circle.
 * @param radius - The radius of the circle.
 * @param point - The point to check.
 */
export function pointInsideCircle(
  center: Vector2,
  radius: number,
  point: Vector2,
): boolean {
  return center.distanceTo(point) <= radius;
}

/**
 * Checks if the given point is inside the ellipse at
 * the given center with the given major and minor radii.
 *
 * @param center - The center of the ellipse.
 * @param radius - The major and minor radii of the ellipse.
 * @param point - The point to check.
 */
export function pointInsideEllipse(
  center: Vector2,
  radius: Vector2,
  point: Vector2,
): boolean {
  return (
    (point.x - center.x) ** 2 / radius.x ** 2 +
      (point.y - center.y) ** 2 / radius.y ** 2 <=
    1
  );
}

/**
 * Check if the given point is inside the sector defined
 * by points a, b, and c with the given radius.
 *
 * @param a - The first vertex of the sector.
 * @param b - The center vertex of the sector.
 * @param c - The second vertex of the sector.
 * @param radius - The radius of the sector.
 * @param point - The point to check.
 */
export function pointInsideSector(
  a: Vector2,
  b: Vector2,
  c: Vector2,
  radius: number,
  point: Vector2,
): boolean {
  const d = point.distanceTo(b);

  if (d >= radius) {
    return false;
  }

  const bToA = a.sub(b);
  const bToC = c.sub(b);
  const bToPoint = point.sub(b);
  const totalAngle = bToA.clockwiseAngleTo(bToC);
  const angleToPoint = bToA.clockwiseAngleTo(bToPoint);

  return angleToPoint >= 0 && angleToPoint <= totalAngle;
}

export function pointInsideRectangle(
  center: Vector2,
  size: Vector2,
  point: Vector2,
): boolean {
  const minX = center.x - size.width / 2;
  const maxX = center.x + size.width / 2;
  const minY = center.y - size.height / 2;
  const maxY = center.y + size.height / 2;
  return (
    point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
  );
}

/**
 * Checks if a point is inside a polygon defined by a list
 * of vertices.
 *
 * @remarks
 * This function uses raycasting to determine if the given
 * point is inside the polygon or not. It counts how many
 * edges a ray cast from the point crosses. If the number
 * is even, the point is outside the polygon. If it is odd,
 * the point is inside the polygon.
 *
 * @param vertices - The vertices of the polygon.
 * @param point - The point to check.
 */
export function pointInsidePolygon(
  vertices: Vector2[],
  point: Vector2,
): boolean {
  const p = point;
  let isInside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const a = vertices[i];
    const b = vertices[j];
    if (
      a.y > p.y !== b.y > p.y &&
      p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
    ) {
      isInside = !isInside;
    }
  }

  return isInside;
}

/**
 * Calculates the shortest distance from a given point
 * to any point on a line segment.
 *
 * @param a - The first point of the line segment.
 * @param b - The second point of the line segment.
 * @param point - The point to check.
 */
export function distanceToLineSegment(
  a: Vector2,
  b: Vector2,
  point: Vector2,
): number {
  const lineSegment = b.sub(a);
  const squaredLength = lineSegment.squaredLength();

  // Special case where a == b. In this case, simply return
  // the distance from the point to point a.
  if (squaredLength === 0) {
    return point.distanceTo(a);
  }

  let t = point.sub(a).dot(lineSegment) / squaredLength;
  t = Math.max(0, Math.min(1, t));
  const projection = a.add(lineSegment.scale(t));

  return point.distanceTo(projection);
}

export function distanceToArc(
  center: Vector2,
  fromAngle: number,
  toAngle: number,
  radius: number,
  point: Vector2,
): number {
  const centerToPoint = point.sub(center);
  let angleToPoint = centerToPoint.angle;

  let angle: number;
  if (isAngleBetweenAngles(angleToPoint, fromAngle, toAngle)) {
    angle = angleToPoint;
  } else {
    angle = findClosestAngleToAngle(angleToPoint, fromAngle, toAngle);
  }

  const pointOnArc = center.add(Vector2.fromPolar(angle, radius));
  return point.distanceTo(pointOnArc);
}
