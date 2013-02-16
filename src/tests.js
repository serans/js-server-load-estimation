precission = 0.0001;

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

function testnormal() {
}

function testdiff(){
}

function testcdf() {
}
