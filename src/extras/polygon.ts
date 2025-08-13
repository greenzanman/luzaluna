import type { Vec2 } from "kaplay";
export function rightCrosses(point: Vec2, line1: Vec2, line2: Vec2): number {
    if (line1.y == line2.y)
        return 0
    if (line1.y > line2.y) { // Swap values
        line2 = [line1, line1 = line2][0];
    }
    if (point.y < line1.y || point.y > line2.y) {
        return 0
    }
    let xPoint = ((point.y - line1.y) * line1.x + (line2.y - point.y) * line2.x)
     / (line2.y - line1.y)
    
    
    return point.x > xPoint ? 0 : 1
}