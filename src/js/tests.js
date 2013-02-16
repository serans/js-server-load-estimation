precission = 0.00001;

function assertWithinPrecission(a,b) {
    if (Math.abs(a-b)>precission ) {
        throw("values not within precission:\n"+a+","+b);
    }
}

function testErf() {
    assertWithinPrecission( erf(0.1), 0.112463);
    assertWithinPrecission( erf(0.3), 0.328627);
    assertWithinPrecission( erf(0.5), 0.520500);
    assertWithinPrecission( erf(0.7), 0.677801);
    assertWithinPrecission( erf(0.9), 0.796908);
}

function testErfinv() {
    assertWithinPrecission( 0.1, erfinv(0.112463) );
    assertWithinPrecission( 0.3, erfinv(0.328627) );
    assertWithinPrecission( 0.5, erfinv(0.520500) );
    assertWithinPrecission( 0.7, erfinv(0.677801) );
    assertWithinPrecission( 0.9, erfinv(0.796908) );
}

function testErfinvEquality() {
    for(i=0.1;i<1;i+=0.1) {
        assertWithinPrecission( erfinv(erf(i)), i)
    }
}

/**
 * Values calculated in wolfram alpha 
 *    e^(-(x-μ)^2/(2 σ^2))/(sqrt(2 π) σ) with σ=1; μ=0; x=___
 */
function testNormalPdf() {
    stnorm = new NormalDistribution(0,1);
    
    assertWithinPrecission( stnorm.f(0) , 0.398942);
    assertWithinPrecission( stnorm.f(0.1) , 0.396953);
    assertWithinPrecission( stnorm.f(0.3) , 0.381388);
    assertWithinPrecission( stnorm.f(0.5) , 0.352065);
}

/**
 * Values calculated in wolfram alpha
 *    1/2 erfc((mu-x)/(sqrt(2) sigma)) with mu=0; sigma=1; x=___
 */
function testNormalCdf() {
    stnorm = new NormalDistribution(0,1);
    
    assertWithinPrecission( stnorm.cdf(0) , 0.5);
    assertWithinPrecission( stnorm.cdf(0.1) , 0.539828);
    assertWithinPrecission( stnorm.cdf(0.3) , 0.617911);
    assertWithinPrecission( stnorm.cdf(0.5) , 0.691462);
}

function testDistSumPdf() {
    distSum = new DistributionSum();
    distSum.dists.push(new NormalDistribution(0,1));
    distSum.dists.push(new NormalDistribution(0,1));

    assertWithinPrecission( distSum.f(0) ,   2*0.398942);
    assertWithinPrecission( distSum.f(0.1) , 2*0.396953);
    assertWithinPrecission( distSum.f(0.3) , 2*0.381388);
    assertWithinPrecission( distSum.f(0.5) , 2*0.352065);
}

function testSumCdf() {
    distSum = new DistributionSum();
    distSum.dists.push(new NormalDistribution(0,1));
    distSum.dists.push(new NormalDistribution(0,1));
    
    assertWithinPrecission( distSum.cdf(0) ,   2*0.5);
    assertWithinPrecission( distSum.cdf(0.1) , 2*0.539828);
    assertWithinPrecission( distSum.cdf(0.3) , 2*0.617911);
    assertWithinPrecission( distSum.cdf(0.5) , 2*0.691462);
}
