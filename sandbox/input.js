input = {
    makebike: function(){
        let valid = true;
        b = new.Bike()
        b.wheelbase = Number( document.getElementById('WB').value )
        valid = valid && !isNaN(b.wheelbase)
        b.color = Number( document.getElementById('COLOR').value )
        valid = valid && !isNaN(b.color)
        b.frontWheel.radius = Number( document.getElementById('FWD').value ) / 2
        valid = valid && !isNaN(b.frontWheel.radius)
        b.rearWheel.radius = Number( document.getElementById('RWD').value ) / 2
        valid = valid && !isNaN(b.rearWheel.radiu)
        b.neck.rake = Number( document.getElementById('NR').value )
        valid = valid && !isNaN(b.neck.rake)
        b.fork.measure.onRakeNeckToPivot = Number( document.getElementById('rNP').value )
        valid = valid && !isNaN( b.fork.measure.onRakeNeckToPivot)
        b.fork.measure.fromRakeToPivot = Number( document.getElementById('pNP').value )
        valid = valid && !isNaN(b.fork.measure.fromRakeToPivot)
        b.fork.measure.onRakeNeckToAxle = Number( document.getElementById('rNA').value )
        valid = valid && !isNaN(b.fork.measure.onRakeNeckToAxle)
        b.fork.measure.fromRakeToAxle = Number( document.getElementById('pNA').value )
        valid = valid && !isNaN(b.fork.measure.fromRakeToAxle)
        b.fork.measure.maxBump = Number( document.getElementById('maxBUMP').value )
        valid = valid && !isNaN(b.fork.measure.maxBump)
        b.drawScale = .85 * document.getElementById('bikeCanvas').width / (b.wheelbase +b.frontWheel.radius +b.rearWheel.radius)

        b.fork.measure.pivotFromNeck.calculate(b)
        b.fork.measure.axleFromNeck.calculate(b)
        b.fork.measure.pivotarm.makeLine(b)
        b.neck.setRakeLine(b)
        //b.fork.travel.calculatePostions(b)

        console.log(b, b.fork.travel.positions)

        const ctx = document.getElementById('bikeCanvas').getContext('2d')

        
        ctx.scale(b.drawScale,b.drawScale)
        ctx.translate(60,20)

        b.frontWheel.draw(b,ctx)
        b.rearWheel.draw(b,ctx)
        b.drawFrame(b,ctx)
        b.neck.drawNeck(b,ctx)

        b.fork.travel.drawPositions(b,ctx)
        b.fork.measure.drawLeg(b,ctx)
        b.fork.measure.pivotarm.draw(b,ctx)

        b.neck.drawRakeLine(b,ctx)
        b.frontWheel.drawLineToGround()
    }
}