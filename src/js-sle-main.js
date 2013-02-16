function makeEstimation( config ) {

    var graphPoints = new Array();
    var peakHits;
    var peakHitsTime;

    function timeToMinutes(h,m) { return parseInt(h)*60+parseInt(m); };

    var n_pop = config.demo_table.length;
    
    if(n_pop==0) return;
    
    var dist = new NormalDistributionSum();
    for(var i=0; i<n_pop; i++) {
        console.log( "pop: "+config.demo_table[i] );
        var start = timeToMinutes(config.demo_table[i].peak_start_h,config.demo_table[i].peak_start_m);
        var end  = timeToMinutes(config.demo_table[i].peak_end_h,config.demo_table[i].peak_end_m);
        var n = parseInt(config.demo_table[i].n_visits);
        
        //peak time finishes the next day
        if(end<start) { end+=1440; }
        
        dist.dists.push( new Population( (end+start)/2, end-start, n) );
    }
    
    for(var i=0; i<1440; i+=30) {
        graphPoints.push(dist.f(i) );
    }
    return graphPoints;
}
/*
function drawGraph(chart_id, highlight) {
    _options = {
        min_x: 0,
        max_x: 24,
        increment: 0.5,
        title: 'f(x)',
    }

    data = new Array(1,3,4,5,6,5,3,2,5,7,8,9);

    plot = $.jqplot(chart_id, [data]);
}*/
