'use stict'


class Point {
    constructor(x,y){
        this.x = x
        this.y = y
        this.getDistance = function (p = new Point(0,0)){
            if (!(p instanceof Point)){ throw "point.getDistance(p) has bad target point"}
            const dX = this.x - p.x
            const dY = this.y - p.y
            return Math.pow( dX*dX + dY*dY , .5)
        }
        this.getAngle = function(p = new Point(0,0)){
            if (!(p instanceof Point)){ throw "point.getAngle(p) has bad target point"}
            const dX = this.x - p.x
            const dY = this.y - p.y
            return Math.atan(dY/dX)
        }
        this.draw = function(d,ctx){
            ctx.moveTo(this.x-d, this.y)
            ctx.lineTo(this.x+d, this.y)
            ctx.moveTo(this.x, this.y-d)
            ctx.lineTo(this.x, this.y+d)
            ctx.stroke()
        }
    }    
}


class Line {
    constructor (p1,p2){
        if (!p2){
            this.p1 = new Point(0,0)
            this.p2 = p1
        } else {
            this.p1 = p1
            this.p2 = p2
        }        
        this.calculateLength = function(){
            if (this.length === undefined){ this.length = this.p1.getDistance(p2) }
            return this.length
        }
        this.calculateAngle = function(){
            if (this.angle === undefined){ this.angle = this.p1.getAngle(p2) }
            return this.angle
        }
        this.getIntersection = function(lineB){
            if (!(lineB instanceof Line)){ throw "line.getIntersection(line) requires a second line" }
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
                p: new Point( x1 + ua*(x2 - x1), y1 + ua*(y2 - y1) ),
                onSeg1: ua >= 0 && ua <= 1,
                onSeg2: ub >= 0 && ub <= 1
            };
        }
        this.draw = function(ctx){
            ctx.beginPath()
            ctx.moveTo(this.p1.x, this.p1.y)
            ctx.lineTo(this.p2.x, this.p2.y)
            ctx.stroke()
        }
    }

    
}


class Circle {
    constructor (center = new point(0,0), radius = 1){
        this.center = center
        this.radius = radius
        this.draw = function(ctx){
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2)
            ctx.fill()
        }
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
        const c2a = new Point( p2.x + r2 * Math.cos(angR + angN), p2.y + r2 * Math.sin(angR + angN) )
        const c1b = new Point( p1.x + r1 * Math.cos(angR - angN), p1.y + r1 * Math.sin(angR - angN) )
        const c2b = new Point( p2.x + r2 * Math.cos(angR - angN), p2.y + r2 * Math.sin(angR - angN) )	       
        return {
            lines:{ a: new Line(c1a,c2a), b: new Line(c2a,c2b) },
            sourceTangets:{a:c1a,b:c1b},
            targetTangents:{a:c2a,b:c2b}
        }
    }
}