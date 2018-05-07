'use strict'

class Bike {
    constructor() {
        this.drawScale = null
        this.findScaleFrame = function(b,canvas){
            const long = b.rearWheel.radius + b.wheelbase + (b.fork.measure.axleFromNeck.dX * Math.sin(b.neck.rake) ) + b.frontWheel.radius 
            const tall = b.frontWheel.radius > b.rearWheel.radius ? 2 * b.frontWheel.radius : 2 * b.rearWheel.radius
            const scaleX = .8 * canvas.width / long
            const scaleY = .8 * canvas.height / tall
            b.drawScale = scaleX < scaleY ? scaleX : scaleY
            return {
                scale: b.drawScale,
                offsetX: .9*long,
                offsetY: canvas.height/b.drawScale - b.fork.measure.axleFromNeck.dY - b.frontWheel.radius,
            }
        }
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
                ctx.strokeStyle = "hsla(" + 360%(b.color + 60) + ", 75%, 50%, .5)"
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
        this.drawLineToGround = function(b,ctx){
            ctx.save()
            ctx.lineWidth = 2/b.drawScale
            const dash = 5*ctx.lineWidth
            ctx.setLineDash([dash,dash])
            ctx.strokeStyle = "hsla(" + 360%(b.color + 60) + ", 75%, 50%, .5)"
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