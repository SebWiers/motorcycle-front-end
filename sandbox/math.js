'use stict'


export class Point {
    constructor(x,y){
        this.x = x
        this.y = y
    }

    vector(p){
        if (!p){
            if (this.a === undefined) { this.a = this.getAngle() }
            if (this.m === undefined) { this.m = this.getDistance() } 
            return {a:this.s, r:this.r}     
        } else {
            if (!(p instanceof Point)){ throw "point.vector(p) has bad target point"}
            return {a: this.getAngle(p), m: this.getDistance(p)}
        }
    }

    getDistance (p = new Point(0,0)){
        if (!(p instanceof Point)){ throw "point.getDistance(p) has bad target point"}
        dX = this.x - p.x
        dY = this.y - p.y
        return Math.pow( dX*dX + dY*dY , .5)
    }

    getAngle (p = new Point(0,0)){
        if (!(p instanceof Point)){ throw "point.getAngle(p) has bad target point"}
        dX = this.x - p.x
        dY = this.y - p.y
        return Math.atan(dY/dX)
    }
}


export class Line {
    constructor (p1,p2 = new point(0,0)){
        if (p1.x <= p2.x){
            this.p1 = p1
            this.p2 = p2  
        } else {
            this.p1 = p2
            this.p2 = p1  
        }
    }

    xIntersect(){
        if (this.xIntersect === undefined){ 
            this.xIntersect = this.getIntersection(this,new Line(new Point(1,0)))
        }
        return this.xIntersect 
    }

    yIntersect(){
        if (this.yIntersect === undefined){ 
            this.yIntersect = this.getIntersection(this,new Line(new Point(1,0)))
        }
        return this.yIntersect 
    }

    slope(){
        if (this.slope === undefined){ this.slope = (p2.y-p1.y)/(p2.x-p2.x) }
        return slope
    }

    getIntersection(lineB){
        if (!(lineA instanceof Line)){ throw "line.getIntersection() requires a second line" }
        const x1 = this.p1.x
        const y1 = this.p1.y
        const x2 = this.p2.x
        const y2 = this.p2.y
        const x3 = lineB.p1.x
        const y3 = lineB.p1.y
        const x4 = lineB.p2.x
        const y4 = lineB.p2.y
        const denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
        if (denom == 0) { 
            return { p: null, onSeg1: null, onSeg2: null } 
        }
        const ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
        const ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
        return {
            p: new point( x1 + ua*(x2 - x1), y1 + ua*(y2 - y1) ),
            onSeg1: ua >= 0 && ua <= 1,
            onSeg2: ub >= 0 && ub <= 1
        };
    }
}


export class Circle {
    constructor (center = new point(0,0), radius = 1){
        this.center = center
        this.radius = radius
    }

    outerTangentLinesToCircle(c){ 
        // derived from https://stackoverflow.com/questions/12034019/as3-draw-a-line-along-the-common-tangents-of-two-circles
        if (!(c instanceof Circle)){ throw "circle.getCircleTangentPoints(c) requires a second line" }
        const p1 = this.center
        const p2 = c.center
        const r1 = this.radius
        const r2 = c.radius;					 
        const angR = Math.atan( (p1.y - p2.y) / (p1.x - p2.x) );
        const angN = Math.acos((r1 - r2)/ getDistance(p1,p2));	
        const c1a = new Point( p1.x + r1 * Math.cos(angR + angN), p1.y + r1 * Math.sin(angR + angN) )
        const c2a = new Point( p2.x + r2 * Math.cos(angR + angN), y: p2.y + r2 * Math.sin(angR + angN) )
        const c1b = new Point( p1.x + r1 * Math.cos(angR - angN), y: p1.y + r1 * Math.sin(angR - angN) )
        const c2b = new Point( p2.x + r2 * Math.cos(angR - angN), y: p2.y + r2 * Math.sin(angR - angN) )	       
        return {
            lines:{ a: new Line(c1a,c2a), b: new Line(c2a,c2b) },
            sourceTangets:{a:c1a,b:c1b},
            targetTangents:{a:c2a,b:c2b}
        }
    }
}