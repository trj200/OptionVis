
function getOptionValue(CallOrPut, strike, time, spotPrice, volatility, riskFreeRate ){
    var value = 0
    //C = SP e-dt N(d1) - ST e-rt N(d2)
//P = ST e-rt N(-d2) - SP e-dt N(-d1)
//d1 = ( ln(SP/ST) + (r - d + (σ2/2)) t ) / σ √t
//d2 = ( ln(SP/ST) + (r - d - (σ2/2)) t ) / σ √t = d1 - σ √t
    function fnER(e){
        var t=e>=0?1:-1;e=Math.abs(e);
        var n=.3275911,a=.254829592,r=-.284496736,i=1.421413741,l=-1.453152027,
        d=1.061405429,u=1/(1+n*e),
        m=1-((((d*u+l)*u+i)*u+r)*u+a)*u*Math.exp(-e*e);
        return t*m
    }
    function fn_CD(e,t,n){return-1e5>(e-t)/n?0:(e-t)/n>1e5?1:.5*(1+fnER((e-t)/Math.sqrt(2*n)))}

    d1 = ( Math.log(spotPrice/strike) + (riskFreeRate - 0 + volatility * volatility/2) * time ) / volatility * Math.sqrt(time);
    //d1 = 1/ (volatility * Math.sqrt(time)) * ( Math.log(spotPrice/strike) + (riskFreeRate - 0 + volatility ^ 2)/2 * time );

    d2 = d1 - (volatility * Math.sqrt(time));
    //console.log(d1);
    //console.log(d2);
    if(CallOrPut == "call"){
        value = (spotPrice * Math.exp(0) * fn_CD(d1,0,1)) - (strike * Math.exp(-riskFreeRate * time) * fn_CD(d2,0,1));
    }
    else{
        value = (strike * Math.exp(-riskFreeRate * time) * fn_CD(-d2,0,1)) - (spotPrice * 1 * fn_CD(-d1,0,1))
    }
    document.write(CallOrPut);

    return value;
}

var rfr = .01;
var vol = .12;
document.write(getOptionValue("call", 100, 1, 110, vol, rfr));
document.write("<br />");
document.write(getOptionValue("put", 100, 1, 110, vol, rfr));