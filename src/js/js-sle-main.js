/*  js-server-load-estimation
    Copyright (C) 2013  Miguel Hermo Serans

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    contact: code@mhserans.com
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
    return 0.5*(1.0+erf( (x-this.mu) / (this.sigma*1.41421356237) ))
}


NormalDistribution.prototype.diff = function(x) {
    with(Math) {
        return ((this.mu - x) * exp(-1 * pow((x - this.mu), 2) / (2 * pow(this.sigma, 2)))) / (sqrt(2 * PI) * pow(this.sigma, 3))
    }
}

/**
 * Scaled normal function
 * Normal distribution scaled so that:
 *    cdf(0) = 0
 *    cdf(24)= 1
 */
function ScaledNormalDistribution(mu, sigma) {
    this.n = new NormalDistribution(mu,sigma);
}

ScaledNormalDistribution.prototype.f = function(x) { 
    return ( (this.n.f(x)-this.n.cdf(0)) / (this.n.cdf(24)-this.n.cdf(0)) );
}

ScaledNormalDistribution.prototype.cdf = function(x) { 
    return ( (this.n.cdf(x)-this.n.cdf(0))/(this.n.cdf(24)-this.n.cdf(0)) );
}

ScaledNormalDistribution.prototype.diff = function(x) { 
    return ( this.n.difff(x) );
}

/**
 * CyclicDist
 * Distribution that is cyclical in the range 0-24 if
 * µ is within that range
 */
function CyclicDist(mu, sigma) {
    this.dists = new DistributionSum();
    this.dists.dists.push( new NormalDistribution(mu-24, sigma) );
    this.dists.dists.push( new NormalDistribution(mu,    sigma) );
    this.dists.dists.push( new NormalDistribution(mu+24, sigma) );
    
    this.cdf_0  = this.dists.cdf(0);
    this.cdf_24 = this.dists.cdf(24);
}

CyclicDist.prototype.f = function(x) { 
    return ( (this.dists.f(x)-this.cdf_0) / (this.cdf_24-this.cdf_0) );
}

CyclicDist.prototype.cdf = function(x) { 
    return ( (this.dists.cdf(x)-this.cdf_0) / (this.cdf_24-this.cdf_0) );
}

CyclicDist.prototype.diff = function(x) { 
    return ( this.dists.diff(x) );
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

function pphToSigma(x) {
    return 0.5/(erfinv(x)*Math.sqrt(2));
}

function pphTest(){
    for(pph = 0.04; pph<0.06; pph+=0.005) {
        sigma = pphToSigma(pph);
        a = new NormalDistribution(12, sigma);
        b = new CyclicDist(12, sigma);
        console.log(pph+";"+(a.cdf(12.5)-a.cdf(11.5))+";"+(b.cdf(12.5)-b.cdf(11.5)));
    }
}

/**
 * 
 */
function makeEstimation( config ) {

    var results;
    
    var n_pop = config.demo_table.length;
    
    if(n_pop==0) return;
    
    var dist = new DistributionSum();
    for(var i=0; i<n_pop; i++) {
        console.log( "pop: "+config.demo_table[i] );
        var n = parseInt(config.demo_table[i].n_visits);
        var mu = parseInt(config.demo_table[i].peak_time);
        var sigma = 0; //TO-DO
        
        dist.dists.push( new Population( mu, sigma, n) );
    }
    
    //Find maxima
    
    results.graphPoints = new Array();
    for(var i=0; i<1440; i+=30) {
        results.graphPoints.push(dist.f(i) );
    }
    return graphPoints;
}

function drawGraph(chart_id, highlight) {
    _options = {
        min_x: 0,
        max_x: 24,
        increment: 0.5,
        title: 'f(x)',
    }
    data = new Array();
    for(var i=0; i<1440; i+=30) {
        data.push([i,Math.random()*100]);
    }
    plot = $.jqplot(chart_id, [data]);
    return plot;
}
