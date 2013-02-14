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
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);

}

NormalDistribution.prototype.diff = function(x) {
    with(Math) {
        return ((this.mu - x) * exp(-1 * pow((x - this.mu), 2) / (2 * pow(this.sigma, 2)))) / (sqrt(2 * PI) * pow(this.sigma, 3))
    }
}

/**
 * Sum of normal distributions
 */
function NormalDistributionSum() {
    this.dists = new Array();
}

NormalDistributionSum.prototype.f = function(x) {
    
    var len=this.dists.length;
    var sum=0;
    
    for(i=0; i<this.dists.length; i++) {
        sum+=this.dists[i].f(x);
    }
    return sum;
}
    
NormalDistributionSum.prototype.cdf = function(x) {
    var len=this.dists.length;
    var sum=0;
    
    for(i=0; i<this.dists.length; i++) {
        sum+=this.dists[i].cdf(x);
    }
    return sum;
}

NormalDistributionSum.prototype.diff = function(x) {
    var len=this.dists.length;
    var sum=0;
    
    for(i=0; i<this.dists.length; i++) {
        sum+=this.dists[i].diff(x);
    }
    return sum;
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

