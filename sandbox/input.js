input = {
    validated: false,
    getNumber: function(id){
        const input = document.getElementById(id)
        if (!input){ return }
        const value = input.value
        if (value === '' || isNaN(value)){ 
            input.style.color = '#fff'
            input.style.backgroundColor = '#f00'
            this.validated = false && validated
            return null
        } else {
            input.style.color = '#000'
            input.style.backgroundColor = '#fff'
            this.validated = true && this.validated
            return Number(value)
        }
    },
    makeBike: function(){
        this.validated = true
        const b = new Bike()
        b.wheelbase = this.getNumber('WB')
        b.color = this.getNumber('COLOR')
        b.frontWheel.radius = this.getNumber('FWD') / 2
        b.rearWheel.radius = this.getNumber('RWD') / 2
        b.neck.rake = this.getNumber('NR') * Math.PI/180
        b.fork.measure.onRakeNeckToPivot = this.getNumber('rNP')
        b.fork.measure.fromRakeToPivot = this.getNumber('pNP')
        b.fork.measure.onRakeNeckToAxle = this.getNumber('rNA')
        b.fork.measure.fromRakeToAxle = this.getNumber('pNA')
        b.fork.measure.maxBump = this.getNumber('maxBUMP')
        if (!this.validated){ return null }

        b.drawScale = b.findScale(b);
        b.fork.measure.pivotFromNeck.calculate(b)
        b.fork.measure.axleFromNeck.calculate(b)
        b.fork.measure.pivotarm.makeLine(b)
        b.neck.setRakeLine(b)
        //b.fork.travel.calculatePostions(b)

        console.log(b, b.fork.travel.positions)
        const bc = document.getElementById('bikeCanvas')
        const ctx = bc.getContext('2d')
        ctx.clearReact(0,0,bc.width,bc.height)
        
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
        b.frontWheel.drawLineToGround(b,ctx)
    }
}

$('div#data table td input[type="number"]').change( function(){input.getNumber(this.id)} )

$('#drawButton').click( function(){input.makeBike()} )