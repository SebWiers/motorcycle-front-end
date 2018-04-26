$('div#data table td input[type="number"]').change( function(){
    input.getNumber(this.id)
    $('canvas#bikeCanvas').addClass('stale')
    $('div#charts').addClass('stale')
})
$('div#data table td input#COLOR').change( function(){
    input.getRangeColor() 
    $('canvas#bikeCanvas').addClass('stale')
    $('div#charts').addClass('stale')
})
$('div#data table td input[type=radio][name=units]').change( function(){
    $('canvas#bikeCanvas').addClass('stale')
    if (this.value === 'mm'){ $('div#data table td input[type="number"]').not('#NR').each(function(){ this.value = (this.value * 25.4).toFixed(1) } ) }
    if (this.value === 'in'){ $('div#data table td input[type="number"]').not('#NR').each(function(){ this.value = (this.value / 25.4).toFixed(1) } ) }
})
$('#drawButton').click( function(){
    input.bike = input.makeBike()
    charts.draw(input.bike)
    $('div#charts').removeClass('stale')
    $('canvas#bikeCanvas').removeClass('stale')
})