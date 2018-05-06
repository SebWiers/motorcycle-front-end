$('div#data table td input[type="number"]').change( function(){
    input.getNumber(this.id)

})
$('div#data table td input#COLOR').change( function(){
    input.getRangeColor() 

})
$('div#data table td input[type=radio][name=units]').change( function(){
    $('canvas#bikeCanvas').addClass('stale')
    $('div#charts').addClass('stale')
    input.convert(this.value)
})
$('#drawButton').click( function(){
    input.bike = input.makeBike()
    charts.draw(input.bike)
    $('div#charts').removeClass('stale')
    $('canvas#bikeCanvas').removeClass('stale')
})
$('#drawButton').click()