'use strict'

class Bike {
    constructor() {
        this.drawScale = null
        this.fork = new singlePivotFork()
        this.neck = {
            bottom: new Point(0,0),
            rake: Math.atan(3/4),// test,
            setRakeLine: function(b){
                b.neck.rakeLine = new Line( 
                    b.neck.bottom, 
                    new Point(
                        10 * b.wheelbase * Math.sin(b.neck.rake) + b.neck.bottom.x, 
                        10 * b.wheelbase * Math.cos(b.neck.rake)+ b.neck.bottom.y
                    )
                )
            },
            drawRakeLine: function(b,ctx){
                ctx.save()
                ctx.lineWidth = 2/b.drawScale
                const dash = 5*ctx.lineWidth 
                ctx.setLineDash([dash,dash])
                ctx.strokeStyle = "hsla(" + 360%(b.color + 60) + ", 75%, 50%, .25)"
                b.neck.rakeLine.draw(ctx)
                ctx.restore()
            },
            drawNeck: function(b,ctx){
                ctx.save()
                ctx.beginPath()
                ctx.strokeStyle = "hsla(" + b.color + ", 100%, 50%, .5)"
                ctx.lineWidth = 20/b.drawScale
                ctx.moveTo(b.neck.bottom.x - b.wheelbase/10 * Math.sin(b.neck.rake) , b.neck.bottom.y - b.wheelbase/10 * Math.cos(b.neck.rake))
                ctx.lineTo(b.neck.bottom.x, b.neck.bottom.y)
                ctx.stroke()
                ctx.restore()
            }
        }
        this.frontWheel = new Wheel()
        this.frontWheel.radius = 12//test
        this.rearWheel = new Wheel()
        this.rearWheel.radius = 12//test
        this.rearWheel.findCenter = function(b){
            b.rearWheel.centerFromNeck.dX = b.frontWheel.centerFromNeck.dX - b.wheelbase
            b.rearWheel.centerFromNeck.dY = b.frontWheel.centerFromNeck.dY + b.frontWheel.radius - b.rearWheel.radius
        }
        this.centerOfGravity = {
            neckDx: null,
            neckDy: null,
        }
        this.wheelbase = 60//test
        this.color = 0
        this.drawFrame= function(b,ctx){
            ctx.save()
            ctx.beginPath()
            ctx.lineCap = "round"
            ctx.strokeStyle = "hsla(" + b.color + ", 100%, 50%, .25)"
            ctx.lineWidth = 40/b.drawScale
            
            ctx.moveTo(b.rearWheel.centerFromNeck.dX + b.wheelbase* .6, b.rearWheel.centerFromNeck.dY)
            ctx.lineTo(b.rearWheel.centerFromNeck.dX, b.rearWheel.centerFromNeck.dY)
           
            ctx.moveTo(b.rearWheel.centerFromNeck.dX, b.rearWheel.centerFromNeck.dY)
            ctx.lineTo( b.neck.bottom.x - b.wheelbase/20 * Math.sin(b.neck.rake) , b.neck.bottom.y - b.wheelbase/20 * Math.cos(b.neck.rake))
            
            ctx.moveTo( b.neck.bottom.x - b.wheelbase/20 * Math.sin(b.neck.rake) , b.neck.bottom.y - b.wheelbase/20 * Math.cos(b.neck.rake))
            ctx.lineTo(b.rearWheel.centerFromNeck.dX + b.wheelbase* .6, b.rearWheel.centerFromNeck.dY)
            
            ctx.stroke()
            ctx.restore()            
        }
    }
}

class singlePivotFork{
    constructor() {
        this.measure={
            onRakeNeckToPivot: 11,// test
            fromRakeToPivot: -8,// test
            onRakeNeckToAxle: 20,// test
            fromRakeToAxle: 4,// test
            maxBump: 10,//test         
            pivotarm: {
                angle: null,
                length: null,
                line: null,
                makeLine: function(b){
                    if (
                        b.fork.measure.pivotFromNeck.dX === null ||
                        b.fork.measure.axleFromNeck.dX === null ||
                        b.fork.measure.pivotFromNeck.dY  === null ||
                        b.fork.measure.axleFromNeck.dY === null
                    ) { return }
                    const m = b.fork.measure
                    this.line = new Line( new Point(m.pivotFromNeck.dX, m.pivotFromNeck.dY), new Point(m.axleFromNeck.dX, m.axleFromNeck.dY) )
                    m.pivotarm.length = this.line.calculateLength()
                    m.pivotarm.angle = this.line.calculateAngle()
                    return this.line
                },                  
                draw: function(b, ctx){
                    ctx.save()
                    const m = b.fork.measure
                    if (m.pivotarm.length === null){ m.pivotarm.makeLine(b) }//sets up pivot arm endpoints for first draw
                    ctx.lineCap = "round"
                    let w = ctx.lineWidth = m.pivotarm.length * b.drawscale < 50 ? m.pivotarm.length * 2 / b.drawScale : 10 / b.drawScale
                    ctx.strokeStyle = "hsla(" + b.color + ", 100%, 50%, .75)"
                    ctx.beginPath()
                    ctx.moveTo(m.pivotFromNeck.dX, m.pivotFromNeck.dY)
                    ctx.lineTo(m.axleFromNeck.dX, m.axleFromNeck.dY)
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.lineWidth = 1/b.drawScale
                    ctx.strokeStyle = "hsla(" + b.color + ", 0%, 0%, .5)"
                    const pivot = new Point(m.pivotFromNeck.dX, m.pivotFromNeck.dY)
                    const axle = new Point(m.axleFromNeck.dX, m.axleFromNeck.dY)
                    pivot.draw(w/2, ctx)
                    axle.draw(w/2, ctx)
                    ctx.restore()
                },
            },
            pivotFromNeck: {
                dX: null,
                dY: null,       
                calculate: function(b) { 
                    const m = b.fork.measure
                    const a = b.neck.rake 
                    if (a !== null && m.onRakeNeckToPivot !== null && m.fromRakeToPivot !== null) { 
                        m.pivotFromNeck.dX = Math.sin(a) * m.onRakeNeckToPivot + Math.cos(a) * m.fromRakeToPivot 
                        m.pivotFromNeck.dY = Math.cos(a) * m.onRakeNeckToPivot - Math.sin(a) * m.fromRakeToPivot
                    } else { return }
                    return b.fork.measure.pivotFromNeck
                }
            },
            drawLeg: function(b,ctx){
                ctx.save()
                ctx.beginPath()
                ctx.lineCap = "round"
                ctx.strokeStyle = "hsla(" + b.color + ", 100%, 50%, .5)"
                ctx.lineWidth = 15/b.drawScale
                ctx.moveTo(b.fork.measure.pivotFromNeck.dX,b.fork.measure.pivotFromNeck.dY)
                ctx.lineTo(b.neck.bottom.x, b.neck.bottom.y)
                ctx.stroke()
                ctx.restore()
            },
            axleFromNeck:{
                dX: null, 
                dY: null,
                calculate: function(b){
                    const m = b.fork.measure
                    const a = b.neck.rake 
                    if (a !== null && m.rakeNeckToAxle !== null && m.rakeLineToAxle !== null) {
                        m.axleFromNeck.dX = Math.sin(a) * m.onRakeNeckToAxle + Math.cos(a) * m.fromRakeToAxle 
                        m.axleFromNeck.dY = Math.cos(a) * m.onRakeNeckToAxle - Math.sin(a) * m.fromRakeToAxle
                    } else { return }
                    b.frontWheel.centerFromNeck = {dX: m.axleFromNeck.dX, dY: m.axleFromNeck.dY}
                    b.frontWheel.setCircle()
                    b.rearWheel.findCenter(b)
                    b.rearWheel.setCircle()
                    return b.fork.measure.axleFromNeck
                }
            }
        }
        this.travel = {
            pivotIncrement: .01,
            positions: [],
            showArm: true,
            calculatePostions: function(b){
                const m = b.fork.measure
                const t = b.fork.travel
                let bump = 0
                let pc = 0
                let x, y
                m.pivotarm.toAxle = {
                    dX: Math.cos(m.pivotarm.angle) * m.pivotarm.length,
                    dY: Math.sin(m.pivotarm.angle) * m.pivotarm.length,
                } 
                this.positions.push({
                    pivotChange: pc,
                    pivotAngle: m.pivotarm.angle, 
                    axleFromNeck: m.axleFromNeck,
                    pivotarm: new Line(new Point(m.pivotFromNeck.dX, m.pivotFromNeck.dY), new Point(m.axleFromNeck.dX,m.axleFromNeck.dY)),
                    bump: bump,
                    color: b.color,
                    rakeLine: b.neck.rakeLine,
                    frontGroundLine: new Line(
                        new Point(m.axleFromNeck.dX-b.wheelbase, m.axleFromNeck.dY+b.frontWheel.radius),
                        new Point(m.axleFromNeck.dX+b.wheelbase, m.axleFromNeck.dY+b.frontWheel.radius)
                    ),
                    frontContactPatch: new Point(m.axleFromNeck.dX, m.axleFromNeck.dY+b.frontWheel.radius),
                })
                for (pc= t.pivotIncrement;   bump < m.maxBump && pc < Math.PI * 2;   pc+= t.pivotIncrement){
                    bump = Math.sin( m.pivotarm.angle + pc) * m.pivotarm.length - m.pivotarm.toAxle.dY
                    x = m.axleFromNeck.dX + Math.cos( m.pivotarm.angle + pc) * m.pivotarm.length - m.pivotarm.toAxle.dX
                    y = m.axleFromNeck.dY - bump
                    this.positions.push({
                        pivotChange: pc, 
                        pivotAngle: m.pivotarm.angle + pc,
                        pivotarm: new Line(new Point(m.pivotFromNeck.dX, m.pivotFromNeck.dY), new Point(x,y)),
                        axleFromNeck: { dX: x, dY: y },
                        bump: bump,
                        color: (b.color + this.positions.length * t.pivotIncrement * 360 / Math.PI )%360,
                        rakeLine: b.neck.rakeLine,
                        frontGroundLine: new Line(
                            new Point(x-b.wheelbase, y+b.frontWheel.radius),
                            new Point(x+b.wheelbase, y+b.frontWheel.radius),
                        ),
                        frontContactPatch: new Point(x, y+b.frontWheel.radius),
                        wheelBase: new Point(x, y+b.frontWheel.radius).getDistance(
                            new Point(b.rearWheel.circle.x, b.rearWheel.circle.x + b.rearWheel.radius)
                        ),
                    })
                }
                for (let p in this.positions){
                    //debugger
                    this.positions[p].intersectRakeGround = this.positions[p].rakeLine.getIntersection(this.positions[p].frontGroundLine).p
                    //debugger
                    this.positions[p].trail = this.positions[p].frontContactPatch.getDistance(this.positions[p].intersectRakeGround)
                    
                }
            },
            drawPositions: function(b, ctx){
                const p = b.fork.travel.positions
                const m = b.fork.measure
                let t
                ctx.save()
                ctx.lineWidth = m.pivotarm.length * b.drawscale < 50 ? m.pivotarm.length * 1 / b.drawScale : 5 / b.drawScale
                for (t in p){
                    if (b.fork.travel.showArm){
                        ctx.strokeStyle = "hsla(" + p[t].color + ", 50%, 50%, 1)"
                        p[t].pivotarm.draw(ctx)
                    }
                }
                ctx.restore()
                ctx.save()
                ctx.lineCap = "butt"
                ctx.lineWidth = 4/b.drawScale                
                for (t in p){
                    ctx.beginPath()
                    if (t > 0){ ctx.moveTo(p[t-1].axleFromNeck.dX, p[t-1].axleFromNeck.dY) }
                    ctx.strokeStyle = "hsla(" + p[t].color + ", 50%, 50%, 1)"
                    ctx.lineTo(p[t].axleFromNeck.dX, p[t].axleFromNeck.dY)
                    ctx.stroke()
                }
                
                ctx.restore()
            }
        }

    }  
}

class Wheel{
    constructor(){
        this.centerFromNeck = {dX: null, dY: null}
        this.radius = null
        this.circle = null
        this.setCircle = function(){
            this.circle = new Circle(new Point(this.centerFromNeck.dX, this.centerFromNeck.dY),this.radius)
        }
        this.draw = function(b,ctx){
            ctx.save()
            ctx.fillStyle = "hsla(" + b.color + ", 25%, 25%, .25)"
            this.circle.draw(ctx)
            ctx.restore()
        }
        this.drawLineToGround = function(){
            ctx.save()
            ctx.lineWidth = 2/b.drawScale
            const dash = 5*ctx.lineWidth
            ctx.setLineDash([dash,dash])
            ctx.strokeStyle = "hsla(" + 360%(b.color + 60) + ", 75%, 50%, .25)"
            this.lineToGround.draw(ctx)
            ctx.restore()    
        }
    }
    get underContactPatch(){
        if (this.centerFromNeck.dX === null) return null
        if (this.centerFromNeck.dY === null) return null
        if (this.radius === null) return null
        return new Point(this.centerFromNeck.dX, this.centerFromNeck.dY + this.radius * 100)
    }
    get lineToGround(){
        if (this.contactPatch === null) return null
        return new Line(this.underContactPatch, new Point(this.centerFromNeck.dX, this.centerFromNeck.dY))
    }
    
}