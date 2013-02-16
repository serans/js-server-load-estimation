/*
 * Error functions
 */


/**
 * Error Function.
 * From Handbook of Mathematical Functions, function 7.1.26
 * @see http://people.math.sfu.ca/~cbm/aands/page_299.htm
 */
function erf(x) {
    //save the sign of x
    if (x >= 0) sign = 1
    else sign = -1

    x = Math.abs(x)

    //constants
    a1 =  0.254829592
    a2 = -0.284496736
    a3 =  1.421413741
    a4 = -1.453152027
    a5 =  1.061405429
    p  =  0.3275911

    //A&S formula 7.1.26
    t = 1.0/(1.0 + p*x)
    y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x)
    
    return sign*y
}


/**
 * Inverse Error Function
 */
function erfinv(y) {
    y=parseFloat(y);

   //rational approx coefficients
    var a = [ 0.886226899, -1.645349621,  0.914624893, -0.140543331];
    var b = [-2.118377725,  1.442710462, -0.329097515,  0.012229801];
    var c = [-1.970840454, -1.624906493,  3.429567803,  1.641345311];
    var d = [3.543889200,  1.637067800];

    var y0 = 0.7;
    var x=0, z=0, y0=0.7;

    if (y<-1 || y>1) return undefined;
    
    if ( (y*y) == 1) { x = undefined; }
    else if(y<-y0) {
        z = Math.sqrt(-Math.log((1.0-y)/2.0));
        x = -(((c[3]*z+c[2])*z+c[1])*z+c[0])/((d[1]*z+d[0])*z+1.0);
    } else {
        if(y<y0) {
            z = y*y;
            x = y*(((a[3]*z+a[2])*z+a[1])*z+a[0])/((((b[3]*z+b[3])*z+b[1])*z+b[0])*z+1.0);
        } else {
            z = Math.sqrt(-Math.log((1.0-y)/2.0));
            x = (((c[3]*z+c[2])*z+c[1])*z+c[0])/((d[1]*z+d[0])*z+1.0);      
        }
    }
  
    x = x - (erf(x) - y) / (2.0/Math.sqrt(Math.PI) * Math.exp(-x*x));
    x = x - (erf(x) - y) / (2.0/Math.sqrt(Math.PI) * Math.exp(-x*x));
    return x;
}

/**
 * Normal Distribution
 */
function NormalDistribution(mu, sigma) {
    this.mu = mu;
    this.sigma = sigma;
}

NormalDistribution.prototype.f = function(x) {
    with(Math) {
        return (1.0 / (this.sigma * sqrt(2.0 * PI))) * Math.exp(-0.5 * pow((x - this.mu) / this.sigma, 2))
    }
}

NormalDistribution.prototype.cdf = function(x) {
    var z = (x-this.mu)/Math.sqrt(2*this.sigma*this.sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0) { sign = -1; }
    return (1/2)*(1+sign*erf);
}


NormalDistribution.prototype.diff = function(x) {
    with(Math) {
        return ((this.mu - x) * exp(-1 * pow((x - this.mu), 2) / (2 * pow(this.sigma, 2)))) / (sqrt(2 * PI) * pow(this.sigma, 3))
    }
}


/**
 * Population
 */
function Population(mu, sigma, n) {
    this.dist = new NormalDistribution(mu, sigma);
    this.n = n;
}

Population.prototype.f = function(x) {
    return this.dist.f(x)*this.n;
}

Population.prototype.diff = function(x) {
    return this.dist.diff(x)*this.n;
}

Population.prototype.cdf = function(x) {
    return this.dist.cdf(x)*this.n;
}


/**
 * Sum of distributions
 */
function DistributionSum() {
    this.dists = new Array();
}

DistributionSum.prototype.f = function(x) {
    
    var len=this.dists.length;
    var sum=0;
    
    for(i=0; i<this.dists.length; i++) {
        sum+=this.dists[i].f(x);
    }
    return sum;
}
    
DistributionSum.prototype.cdf = function(x) {
    var len=this.dists.length;
    var sum=0;
    
    for(i=0; i<this.dists.length; i++) {
        sum+=this.dists[i].cdf(x);
    }
    return sum;
}

DistributionSum.prototype.diff = function(x) {
    var len=this.dists.length;
    var sum=0;
    
    for(i=0; i<this.dists.length; i++) {
        sum+=this.dists[i].diff(x);
    }
    return sum;
}

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
