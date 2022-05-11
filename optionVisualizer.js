
function getOptionValue(callOrPut, strike, time, spotPrice, volatility, riskFreeRate) {
    var value = 0
    function fnER(e) {
        var t = e >= 0 ? 1 : -1; e = Math.abs(e);
        var n = .3275911, a = .254829592, r = -.284496736, i = 1.421413741, l = -1.453152027,
            d = 1.061405429, u = 1 / (1 + n * e),
            m = 1 - ((((d * u + l) * u + i) * u + r) * u + a) * u * Math.exp(-e * e);
        return t * m
    }
    function fn_CD(e, t, n) { return -1e5 > (e - t) / n ? 0 : (e - t) / n > 1e5 ? 1 : .5 * (1 + fnER((e - t) / Math.sqrt(2 * n))) }

    d1 = 1/ (volatility * Math.sqrt(time)) * ( Math.log(spotPrice/strike) + (riskFreeRate - 0 + volatility  * volatility/2) * time );

    d2 = d1 - (volatility * Math.sqrt(time));
    if (callOrPut == "call") {
        value = (spotPrice * Math.exp(0) * fn_CD(d1, 0, 1)) - (strike * Math.exp(-riskFreeRate * time) * fn_CD(d2, 0, 1));
    }
    else {
        value = (strike * Math.exp(-riskFreeRate * time) * fn_CD(-d2, 0, 1)) - (spotPrice * 1 * fn_CD(-d1, 0, 1))
    }
    if (value < 0) { value = 0; }
    return value;
}

function getGridNumbers(callOrPut, buyOrSell, strike, time, spotPrice, volatility, riskFreeRate) {
    var xResolution = 20;
    var yResolution = 20;
    var yIncrement = 40 / yResolution;
    var xIncrement = time / xResolution;
    var yStart = spotPrice * 1.2; // always start at up 20%
    var xStart = time;
    var purchasePrice = getOptionValue(callOrPut, strike, time, spotPrice, $('#volatility').val()/100, riskFreeRate);
    var longResults = new Array();
    for (var yCount = 0; yCount <= yResolution; yCount++) {
        xStart = time;
        for (var xCount = 0; xCount <= xResolution; xCount++) {
            var oValue = getOptionValue(callOrPut, strike, xStart, yStart, volatility, riskFreeRate);
            var r = oValue/purchasePrice;
            if(buyOrSell == "sell"){r = -r + 2;}
            //longResults.push({x: xCount, y:yStart, value: oValue, relative: r, pur: purchasePrice, st: xStart});
            longResults.push({x: xCount, y:yStart, value: oValue, relative: r});
            // if(yStart == 100){
            //     console.log(strike, xStart, yStart)
            // }
            xStart -= xIncrement;
            if(xStart < .0001){ xStart = .00011;}    
        }
        yStart -= yIncrement;
    }
    return longResults;
}

$(init);

function init() {

    $('#strikeReadout').val($('#strike').val() + '%');
    $('#timeReadout').val($('#time').val());
    $('#volatilityReadout').val($('#volatility').val() + '%');
    $('#riskFreeRateReadout').val($('#riskFreeRate').val() + '%');
    $('#postVolatilityReadout').val($('#postVolatility').val() + '%');


    function createChart(){
        var inputs = getInputs();
        var table = getGridNumbers(inputs.callOrPut, inputs.buyOrSell, inputs.strike, inputs.time, 100, inputs.volatility, inputs.riskFreeRate);
        makeGraphics(table);
    }

    createChart();

    $('#strike,#time,#volatility,#riskFreeRate,#callOrPut,#buyOrSell,#postVolatility').bind('input', function(e){
        createChart();
        switch(e.target.id){
            case "strike":
            case "volatility":
            case "riskFreeRate":
            case "postVolatility":
                e.target.nextElementSibling.value  = e.target.value + '%';
            break;
            default:
                e.target.nextElementSibling.value  = e.target.value;
                break;
            }
    });
    $('#volatility').bind('input',function(e){
        $('#postVolatility').val($('#volatility').val());
        $('#postVolatilityReadout').val($('#volatility').val() + '%');

    })
    $('#closeButton').bind('click', function(){
        $('#introDiv').css('display','none');
    });
    $('#headerSpan').bind('click',function(){
        if($('#introDiv').css('display') == "none"){
            $('#introDiv').css('display','block');      
          }
        else{
            $('#introDiv').css('display','none');       
         }
    });
}

function getInputs(){
    var cop = $('#callOrPut').val();
    var bos = $('#buyOrSell').val();
    var s = Number($('#strike').val()) + 100;
    var t = Number($('#time').val())/365;
    var v = $('#postVolatility').val()/100;
    var rfr = $('#riskFreeRate').val()/100;
    return {callOrPut: cop, buyOrSell: bos, strike: s, time: t, volatility: v, riskFreeRate: rfr}
}

//testing();
function testing(){
console.log(getOptionValue("call", 100, 1, 100, .2, .05), "10.45");
console.log(getOptionValue("put", 100, 1, 100, .2, .05), "5.57");
console.log(getOptionValue("call", 120, 1, 100, .2, .05), "3.25");
console.log(getOptionValue("put", 120, 1, 100, .2, .05), "17.39");
console.log(getOptionValue("call", 100, .5, 100, .2, .05), "6.89");
console.log(getOptionValue("put", 100, .5, 100, .2, .05), "4.42");
console.log(getOptionValue("call", 100, .25, 100, .2, .05), "4.62");
console.log(getOptionValue("put", 100, .25, 100, .2, .05), "3.37");
console.log(getOptionValue("call", 100, .25, 120, .2, .05), "21.35");
console.log(getOptionValue("put", 100, .25, 120, .2, .05), "0.11");
console.log(getOptionValue("call", 100, .25, 120, .3, .05), "21.99");
console.log(getOptionValue("put", 100, .25, 120, .3, .05), "0.74");
console.log(getOptionValue("call", 100, .1, 100, .3, .01), "3.83");
console.log(getOptionValue("put", 100, .1, 100, .3, .01), "3.73");
}

