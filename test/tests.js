function pseudointegrate(f, from, to, nsteps) {
    sum=0;
    inc=(to-from)/nsteps;
    for(var x=from; x<to; x+=inc) {
        sum+=f(x)*inc;
    }
    return sum;
}

buster.assertions.add( "withinPrecission", {
    assert: function (a,b) {
        var va = parseFloat(a);
        var vb = parseFloat(b)
        var precission=0.0001;
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
        distSum.add(new NormalDistribution(0,1));
        distSum.add(new NormalDistribution(0,1));

        assert.withinPrecission( distSum.f(0)   , 0.398942);
        assert.withinPrecission( distSum.f(0.1) , 0.396953);
        assert.withinPrecission( distSum.f(0.3) , 0.381388);
        assert.withinPrecission( distSum.f(0.5) , 0.352065);
    },
    "Sum cdf(x)": function() {
        distSum = new DistributionSum();
        distSum.add(new NormalDistribution(0,1));
        distSum.add(new NormalDistribution(0,1));
        
        assert.withinPrecission( distSum.cdf(0)   , 0.5);
        assert.withinPrecission( distSum.cdf(0.1) , 0.539828);
        assert.withinPrecission( distSum.cdf(0.3) , 0.617911);
        assert.withinPrecission( distSum.cdf(0.5) , 0.691462);
    },
    "Integral 0-24 Sum. f(x) ~= 1": function() {
        ds = new DistributionSum();
        ds.add(new CyclicDist(8, 4),3);
        ds.add(new CyclicDist(20, 4),5);
        assert.withinPrecission( 
            pseudointegrate( function(x) { return ds.f(x) }, 0, 24, 24),
            1);
    },
});

buster.testCase("Scaled Normal Distribution", {
    "cdf(x)": function() {
        snd = new ScaledNormalDistribution(12,4);

        assert.withinPrecission( snd.cdf(0) , 0);
        assert.withinPrecission( snd.cdf(12)  , 0.5);
        assert.withinPrecission( snd.cdf(24)  , 1);
    },
});

buster.testCase("Cyclic Normal Distribution", {
    "Integral 0-24 f(x) ~= 1": function() {
        for(var i=0; i<24; i++) {
            cd = new CyclicDist(i, 4);
            assert.withinPrecission( 
                pseudointegrate( function(x) { return cd.f(x) }, 0, 24, 24),
                1);
        }
    },
    "is cyclic": function() {
        for(var i=0; i<24; i++) {
            cd = new CyclicDist(i,4);
            assert.withinPrecission(cd.f(0), cd.f(24));
        }
    },
    "cdf has correct scale": function() {
        for(var i=0; i<24; i++) {
            cd = new CyclicDist(i,4);
            assert.withinPrecission(cd.cdf(0), 0);
            assert.withinPrecission(cd.cdf(24), 1);
        }
    },
});

buster.testCase("PPH to Sigma", {
    "correct estimation": function() {
        for(pph = 0.05; pph<0.2; pph+=0.05) {
            sigma = pphToSigma(pph);
            a = new NormalDistribution(12, sigma);
            assert.withinPrecission(a.cdf(12.5)-a.cdf(11.5),pph);
        }
    },
});
