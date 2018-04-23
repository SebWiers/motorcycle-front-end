b = new Bike()

b.fork.measure.pivotFromNeck.calculate(b)
b.fork.measure.axleFromNeck.calculate(b)
b.fork.measure.pivotarm.makeLine(b)
b.fork.travel.calculatePostions(b)




console.log(b)

const ctx = document.getElementById('bikeCanvas').getContext('2d')

b.drawScale = 10
ctx.scale(b.drawScale,b.drawScale)
ctx.translate(60,20)

b.frontWheel.draw(b,ctx)
b.rearWheel.draw(b,ctx)
b.drawFrame(b,ctx)
b.neck.drawNeck(b,ctx)

b.fork.travel.drawPositions(b,ctx)
b.fork.measure.drawLeg(b,ctx)
b.fork.measure.pivotarm.draw(b,ctx)

b.neck.drawRake(b,ctx)