
function getOptionValue(CallOrPut, strike, time, spotPrice, volatility, riskFreeRate) {
    var value = 0
    //C = SP e-dt N(d1) - ST e-rt N(d2)
    //P = ST e-rt N(-d2) - SP e-dt N(-d1)
    //d1 = ( ln(SP/ST) + (r - d + (σ2/2)) t ) / σ √t
    //d2 = ( ln(SP/ST) + (r - d - (σ2/2)) t ) / σ √t = d1 - σ √t
    function fnER(e) {
        var t = e >= 0 ? 1 : -1; e = Math.abs(e);
        var n = .3275911, a = .254829592, r = -.284496736, i = 1.421413741, l = -1.453152027,
            d = 1.061405429, u = 1 / (1 + n * e),
            m = 1 - ((((d * u + l) * u + i) * u + r) * u + a) * u * Math.exp(-e * e);
        return t * m
    }
    function fn_CD(e, t, n) { return -1e5 > (e - t) / n ? 0 : (e - t) / n > 1e5 ? 1 : .5 * (1 + fnER((e - t) / Math.sqrt(2 * n))) }

    d1 = (Math.log(spotPrice / strike) + (riskFreeRate - 0 + volatility * volatility / 2) * time) / volatility * Math.sqrt(time);
    //d1 = 1/ (volatility * Math.sqrt(time)) * ( Math.log(spotPrice/strike) + (riskFreeRate - 0 + volatility ^ 2)/2 * time );

    d2 = d1 - (volatility * Math.sqrt(time));
    //console.log(d1);
    //console.log(d2);
    if (CallOrPut == "call") {
        value = (spotPrice * Math.exp(0) * fn_CD(d1, 0, 1)) - (strike * Math.exp(-riskFreeRate * time) * fn_CD(d2, 0, 1));
    }
    else {
        value = (strike * Math.exp(-riskFreeRate * time) * fn_CD(-d2, 0, 1)) - (spotPrice * 1 * fn_CD(-d1, 0, 1))
    }
    if (value < 0) { value = 0; }
    return value;
}

function getGridNumbers(CallOrPut, strike, time, spotPrice, volatility, riskFreeRate) {
    var xResolution = 20;
    var yResolution = 20;
    var yIncrement = 40 / yResolution;
    var xIncrement = time / xResolution;
    var yStart = spotPrice * 1.2; // always start at up 20%
    var xStart = time;
    var longResults = new Array();
    for (var yCount = 0; yCount < yResolution; yCount++) {
        //console.log(xCount);
        xStart = time;
        for (var xCount = 0; xCount < xResolution; xCount++) {
            //console.log(yCount);
            var oValue = getOptionValue(CallOrPut, strike, xStart, yStart, volatility, riskFreeRate);
            longResults.push({x: xCount, y:yStart, value: oValue});
            //console.log(xStart  + "," + yStart  + ":" + getOptionValue(CallOrPut, strike, xStart, yStart, volatility, riskFreeRate ) );
            xStart -= xIncrement;
        }
        yStart -= yIncrement;
    }
    //console.log(results);
    return longResults;
}

$(init);

function init() {
    function createChart(){
        var inputs = getInputs();
        var table = getGridNumbers(inputs.CallOrPut, inputs.strike, inputs.time, 100, inputs.volatility, inputs.riskFreeRate);
        //console.log(table);
        makeGraphics(table);
    }

    createChart();

    $('#strike,#time,#volatility,#riskFreeRate,#callOrPut').bind('input', function(e){createChart();})
}

function getInputs(){
    var cop = $('#callOrPut').val();
    var s = $('#strike').val();
    var t = $('#time').val();
    var v = $('#volatility').val();
    var rfr = $('#riskFreeRate').val();
    return {CallOrPut: cop, strike: s, time: t, volatility: v, riskFreeRate: rfr}
}

