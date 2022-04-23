
function makeGraphics(data){

var height = 400;
var width = 520;
var margin = ({top: 20, right: 80, bottom: 20, left: 100});

var x = d3.scaleLinear()
.domain([0,d3.max(data, d => d.x)])
.range([margin.left, width - 40])

var y = d3.scaleLinear()
.domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
.range([height , margin.top]);

var greenColor = d3.scaleLinear()
.domain([0, 4])//d3.max(data, d => d.relative)])
.range(["#cdc","green"])

var redColor = d3.scaleLinear()
.domain([-.5,1])// d3.max(data, d => d.relative)])
.range(["red","#cdd"])

var svg = d3.select('svg');
svg.selectAll('rect,text,g').remove();
var g = svg.append("g").attr("fill", "orange");

var str = ($('#strike').val()) * 10;
svg.append("rect").attr("x", margin.left ).attr("y",height - str - 200 + margin.top - 2 )
  .attr("height",2).attr("width", "100%");
svg.append("text").attr("x", margin.left + width - 110).attr("y",height - str - 200 + margin.top - 3)
  .attr("height",30).attr("width", 100).text("strike");

svg.append("text").attr("x", 10).attr("y", -5 + margin.top + height * .5).text("Stock");
svg.append("text").attr("x", 10).attr("y", 11 + margin.top + height * .5).text("Price");
svg.append("text").attr("x", margin.left + width * .25).attr("y", 36 + margin.top + height).text("Contract age in days");

g.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", d => x(d.x))
  .attr("y", d => y(d.y))
  .attr("height",15) // rect size
  .attr("width", 15)
  .attr("fill", d => d.relative > 1 ? greenColor(d.relative) : redColor(d.relative))
  .on('click', display)
  .append("svg:title").text(d => d.relative);

var x = d3.scaleLinear()
    .domain([0, $('#time').val()])  
    .range([0, 400]);  

svg
  .append("g")
  .attr("transform", "translate(" + margin.left + ",418)")      // This controls the vertical position of the Axis
  .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
    .domain([20,-20])
    .range([0,height])

  svg.append("g")
  .attr("transform", "translate(" + (margin.left - 2) + "," + (margin.top - 2) + ")")
  .call(d3.axisLeft(y).tickFormat(function(d) {
     var si = ""; 
     if(d > 0){si = "+";}
     //if(d < 0){si = "-";}
     return si + " " + d + " %"; 
    }));

}

  function display(d){
    var yy = d.target.__data__.y - 100;
    var xx = ($('#time').val() / 20) *  d.target.__data__.x;
    var rel = Math.round((d.target.__data__.relative - 1) * 100);
    var sign = "gone up +" + yy + " %";
    if(yy == 0){
      sign = "remained at the same price";
    }
    if(yy < 0){
      sign = "gone down " + yy + " %";
    }
    var change = "decreased";
    if(rel > 0 ){
     change = "increased";
    }
    
    document.getElementById('cellDetail').innerText ="If the stock price has " + sign + " at " 
    + xx.toFixed(2) + " days into the contract and volatility is at " + ($('#postVolatility').val() * 100).toFixed(0) +
    "%, then the contract value has " + change + " by " + rel + "%."; 
  }