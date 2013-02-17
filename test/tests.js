buster.assertions.add( "withinPrecission", {
    assert: function (a,b) {
        var va = parseFloat(a);
        var vb = parseFloat(b)
        var precission=0.00001;
        return (Math.abs(a-b)<precission );
    },
    assertMessage: "${0} differs from ${1} more than allowed",
    refuteMessage: "${0} is too similar to ${1}",
    expectation: "toBeWithinPrecission"
});

buster.testCase("Test Error Functions", {
    "erf(x)": function() {
        assert.withinPrecission( erf(0.1), 0.112463);
        assert.withinPrecission( erf(0.3), 0.328627);
        assert.withinPrecission( erf(0.5), 0.520500);
        assert.withinPrecission( erf(0.7), 0.677801);
        assert.withinPrecission( erf(0.9), 0.796908);
     },
     "erfinv(x)": function() {
        assert.withinPrecission( 0.1, erfinv(0.112463) );
        assert.withinPrecission( 0.3, erfinv(0.328627) );
        assert.withinPrecission( 0.5, erfinv(0.520500) );
        assert.withinPrecission( 0.7, erfinv(0.677801) );
        assert.withinPrecission( 0.9, erfinv(0.796908) );
     },
     "erfinv(erf(x))=1": function() {
        for(i=0.1;i<1;i+=0.1) {
            assert.withinPrecission( erfinv(erf(i)), i)
        }
     }
});

buster.testCase("Normal Distribution", {
    "pdf(x)": function() {
        stnorm = new NormalDistribution(0,1);
        /*
         * Values calculated in wolfram alpha 
         *    e^(-(x-μ)^2/(2 σ^2))/(sqrt(2 π) σ) with σ=1; μ=0; x=___
         */        
        assert.withinPrecission( stnorm.f(0) , 0.398942);
        assert.withinPrecission( stnorm.f(0.1) , 0.396953);
        assert.withinPrecission( stnorm.f(0.3) , 0.381388);
        assert.withinPrecission( stnorm.f(0.5) , 0.352065);
    },
    "cdf(x)": function() {
        stnorm = new NormalDistribution(0,1);
        /*
         * Values calculated in wolfram alpha
         *    1/2 erfc((mu-x)/(sqrt(2) sigma)) with mu=0; sigma=1; x=___
         */    
        assert.withinPrecission( stnorm.cdf(0) , 0.5);
        assert.withinPrecission( stnorm.cdf(0.1) , 0.539828);
        assert.withinPrecission( stnorm.cdf(0.3) , 0.617911);
        assert.withinPrecission( stnorm.cdf(0.5) , 0.691462);
    }
});

buster.testCase("Distribution Sum", {
    "Sum pdf(x)": function() {
        distSum = new DistributionSum();
        distSum.dists.push(new NormalDistribution(0,1));
        distSum.dists.push(new NormalDistribution(0,1));

        assert.withinPrecission( distSum.f(0) ,   2*0.398942);
        assert.withinPrecission( distSum.f(0.1) , 2*0.396953);
        assert.withinPrecission( distSum.f(0.3) , 2*0.381388);
        assert.withinPrecission( distSum.f(0.5) , 2*0.352065);
    },
    "Sum cdf(x)": function() {
        distSum = new DistributionSum();
        distSum.dists.push(new NormalDistribution(0,1));
        distSum.dists.push(new NormalDistribution(0,1));
        
        assert.withinPrecission( distSum.cdf(0) ,   2*0.5);
        assert.withinPrecission( distSum.cdf(0.1) , 2*0.539828);
        assert.withinPrecission( distSum.cdf(0.3) , 2*0.617911);
        assert.withinPrecission( distSum.cdf(0.5) , 2*0.691462);
    },
});
