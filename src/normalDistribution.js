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

/**
 * Searches the interval from <tt>lowerLimit</tt> to <tt>upperLimit</tt>
 * for a root (i.e., zero) of the function <tt>func</tt> with respect to 
 * its first argument using Brent's method root-finding algorithm.
 *
 * @param {function} function for which the root is sought.
 * @param {number} the lower point of the interval to be searched.
 * @param {number} the upper point of the interval to be searched.
 * @param {number} the desired accuracy (convergence tolerance).
 * @param {number} the maximum number of iterations.
 * @returns an estimate for the root within accuracy.
 */
// Translated from zeroin.c in http://www.netlib.org/c/brent.shar.
function uniroot ( func, lowerLimit, upperLimit, errorTol, maxIter ) {

  var a = lowerLimit
    , b = upperLimit
    , c = a
    , fa = func.call(this,a)
    , fb = func.call(this,b)
    , fc = fa
    , s = 0
    , fs = 0
    , tol_act   // Actual tolerance
    , new_step  // Step at this iteration
    , prev_step // Distance from the last but one to the last approximation
    , p         // Interpolation step is calculated in the form p/q; division is delayed until the last moment
    , q
    ;

  errorTol = errorTol || 0;
  maxIter  = maxIter  || 1000;
 
  while ( maxIter-- > 0 ) {
  
    prev_step = b - a;
   
    if ( Math.abs(fc) < Math.abs(fb) ) {
      // Swap data for b to be the best approximation
      a = b, b = c, c = a;
      fa = fb, fb = fc, fc = fa;
    }
 
    tol_act = 1e-15 * Math.abs(b) + errorTol / 2;
    new_step = ( c - b ) / 2;
 
    if ( Math.abs(new_step) <= tol_act || fb === 0 ) {
      return b; // Acceptable approx. is found
    }
 
    // Decide if the interpolation can be tried
    if ( Math.abs(prev_step) >= tol_act && Math.abs(fa) > Math.abs(fb) ) {
      // If prev_step was large enough and was in true direction, Interpolatiom may be tried
      var t1, cb, t2;
      cb = c - b;
      if ( a === c ) { // If we have only two distinct points linear interpolation can only be applied
        t1 = fb / fa;
        p = cb * t1;
        q = 1.0 - t1;
      }
      else { // Quadric inverse interpolation
        q = fa / fc, t1 = fb / fc, t2 = fb / fa;
        p = t2 * (cb * q * (q - t1) - (b - a) * (t1 - 1));
        q = (q - 1) * (t1 - 1) * (t2 - 1);
      }
 
      if ( p > 0 ) {
        q = -q;  // p was calculated with the opposite sign; make p positive
      }
      else {
        p = -p;  // and assign possible minus to q
      }
 
      if ( p < ( 0.75 * cb * q - Math.abs( tol_act * q ) / 2 ) &&
           p < Math.abs( prev_step * q / 2 ) ) { 
        // If (b + p / q) falls in [b,c] and isn't too large it is accepted
        new_step = p / q;
      }
 
      // If p/q is too large then the bissection procedure can reduce [b,c] range to more extent
    }
 
    if ( Math.abs( new_step ) < tol_act ) { // Adjust the step to be not less than tolerance
      new_step = ( new_step > 0 ) ? tol_act : -tol_act;
    }
 
    a = b, fa = fb;     // Save the previous approx.
    b += new_step, fb = func.call(this,b);  // Do step to a new approxim.
 
    if ( (fb > 0 && fc > 0) || (fb < 0 && fc < 0) ) {
      c = a, fc = fa; // Adjust c for it to have a sign opposite to that of b
    }
  }
 
}
