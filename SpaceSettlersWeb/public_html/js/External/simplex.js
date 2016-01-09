var Simplex = (function(Simplex) {
    var GRAD3 = [[+1, +1, +0], [-1, +1, +0], [+1, -1, +0], [-1, -1, +0],
                 [+1, +0, +1], [-1, +0, +1], [+1, +0, -1], [-1, +0, -1],
                 [+0, +1, +1], [+0, -1, +1], [+0, +1, -1], [+0, -1, -1]];

    function dot(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    }

    Simplex.randomPermutations = function() {
        var permutations = new Array(512);

        for (var i = 0; i < 256; i++) {
            var value = Math.floor(256 * Math.random());
            permutations[i] = value;
            permutations[256 + i] = value;
        }

        return permutations;
    };

    Simplex.simplex2d = function(x, y, permutations) {
        // Code ported from Stefan Gustavson's code example. Can be found at: http://webstaff.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf.

        // Setup the permutation table.
        permutations = permutations || Simplex.randomPermutations();

        // 2D simplices are simply unilateral triangles.
        // Skew the input space to more easily find what triangle our point is contained within.
        var F = +0.366025403784439; // 0.5*(sqrt(3.0)-1.0)
        var skew = (x + y) * F;
        var i = Math.floor(x + skew);
        var j = Math.floor(y + skew);

        var G = +0.211324865405187; // (3.0-sqrt(3.0))/6.0
        var unskew = (i + j) * G;
        var X0 = i - unskew;
        var Y0 = j - unskew;

        // Find the offset to the first corner from the simplex origin.
        var x0 = x - X0;
        var y0 = y - Y0;

        var i1 = (x0 > y0) ? 1.0 : 0.0; // Lower triangle.
        var j1 = (x0 > y0) ? 0.0 : 1.0; // Upper triangle.

        // Find the offset to the other corners from the simplex origin.
        var x1 = x0 - i1 + G;
        var y1 = y0 - j1 + G;

        var x2 = x0 - 1.0 + 2.0 * G;
        var y2 = y0 - 1.0 + 2.0 * G;

        // Find the hashed gradient indices for the corners.
        var ii = i & 255;
        var jj = j & 255;
        var gi0 = permutations[ii + permutations[jj]] % 12;
        var gi1 = permutations[ii + i1 + permutations[jj + j1]] % 12;
        var gi2 = permutations[ii + 1 + permutations[jj + 1]] % 12;

        // Calculate the contributions for all three corners.
        var t0 = Math.max(0.5 - x0 * x0 - y0 * y0, 0.0);
        var t1 = Math.max(0.5 - x1 * x1 - y1 * y1, 0.0);
        var t2 = Math.max(0.5 - x2 * x2 - y2 * y2, 0.0);

        t0 = t0 * t0;
        t1 = t1 * t1;
        t2 = t2 * t2;

        var n0 = t0 * t0 * (GRAD3[gi0][0] * x0 + GRAD3[gi0][1] * y0);
        var n1 = t1 * t1 * (GRAD3[gi1][0] * x1 + GRAD3[gi1][1] * y1);
        var n2 = t2 * t2 * (GRAD3[gi2][0] * x2 + GRAD3[gi2][1] * y2);

        // Return the contributions scaled to return values in the interval [-1, 1].
        return 70.0 * (n0 + n1 + n2);
    };

    return Simplex;
})(Simplex || {});
