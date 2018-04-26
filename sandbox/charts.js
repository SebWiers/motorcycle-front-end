charts = {
    data: [
     {data: [ [0, 29.9], [1, 71.5], [3, 106.4] ] },
     {data: [ [.25, 29.9], [1.25, 71.5], [2.5, 106.4] ] }
    ],
    getTrailSeries: function(bike){
        const t = bike.fork.travel.positions
        const s = t.map(
            function(p){
                return [p.bump, p.trail]             
            }
        )
        return s
    },
    draw: function(bike){
        Highcharts.chart('charts', {
            legend:{ 
                enabled: false
            },
            title:{
                enabled: false,
                text: ""
            },
            tooltip:{
                formatter: function(){
                    return "Travel: " + this.x.toFixed(1) + "<br>Trail: " + this.y.toFixed(1)
                }
            },
            xAxis: {
                title: {text: "Bump Travel"},
                minPadding: 0.05,
                maxPadding: 0.05
            },
            yAxis:{
                title: {text: "Trail"},
                minRange: bike.frontWheel.radius/2,
                maxRange: bike.frontWheel.radius*2
            },
            series:[ 
                {data: this.getTrailSeries(bike), name:"Trail"}
            ]
        })
    }
}
$('#chartButton').click( function(){
    //input.bike.fork.travel.calculatePositions(input.bike)
    //input.bike.fork.drawPositions(input.bike)
    charts.draw(input.bike)
    $('div#charts').removeClass('stale')
})