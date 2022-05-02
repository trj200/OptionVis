
function makeGraphics(data){

  //var erte = document.getElementById('graph');
var margin = ({top: 40, right: 100, bottom: 100, left: 100});
var height = document.getElementById('graph').clientHeight - (margin.top + margin.bottom);// 400;
var width = document.getElementById('graph').clientWidth - (margin.right + margin.left);//520;
var squareSize = height/21; document.getElementById('graph').clientHeight / 28;


var x = d3.scaleLinear()
.domain([0,d3.max(data, d => d.x)])
.range([margin.left, width + margin.left])

var y = d3.scaleLinear()
.domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
//.range([height , margin.top]);
.range([ height + margin.top, margin.top,])

var greenColor = d3.scaleLinear()
.domain([0, 3])//d3.max(data, d => d.relative)])
//.domain([0,d3.max(data, d => d.relative)])
.range(["#cdc","green"])

var redColor = d3.scalePow()
.domain([-1,1])// d3.max(data, d => d.relative)])
//.domain([d3.min(data, d => d.relative),1])
.range(["red","#cdd"])

var svg = d3.select('svg');
svg.selectAll('rect,text,g').remove();
var g = svg.append("g").attr("fill", "orange");

var str = ($('#strike').val()) * (height/40);
var middle = margin.top + (height + squareSize) /2;
svg.append("rect").attr("x", margin.left ).attr("y", middle - str )
  .attr("height",2).attr("width", "100%");
svg.append("text").attr("x", margin.left + width + 40).attr("y",middle - str - (squareSize/2))
  .attr("height",30).attr("width", 100).text("strike");

svg.append("text").attr("x", 10).attr("y", -7 + margin.top + height * .5).text("Stock");
svg.append("text").attr("x", 10).attr("y", 12 + margin.top + height * .5).text("Price");
svg.append("text").attr("x", margin.left + width * .25).attr("y", 55 + margin.top + height + squareSize).text("Contract age in days");

g.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", d => x(d.x))
  .attr("y", d => y(d.y))
  .attr("height",squareSize) // rect size
  .attr("width", squareSize)
  .attr("fill", d => d.relative > 1 ? greenColor(d.relative) : redColor(d.relative))
  .on('click', display)
  //.append("svg:title").text(d => d.relative);

var x2 = d3.scaleLinear()
    .domain([0, $('#time').val()])  
    .range([0, width + squareSize]);  

svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + (height + margin.top + squareSize) + ")") 
  .attr("class","axis")   
  .call(d3.axisBottom(x2));

  var y2 = d3.scaleLinear()
    .domain([20,-20])
    .range([0,height + squareSize])

  svg.append("g")
  .attr("transform", "translate(" + (margin.left - 2) + "," + (margin.top - 2) + ")")
  .attr("class","axis")
  .call(d3.axisLeft(y2).tickFormat(function(d) {
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
    if(rel > 1000 || rel < -1000){
      rel = "over 1000"
    }
    
    document.getElementById('cellDetail').innerText ="If the stock price has " + sign + " at " 
    + xx.toFixed(2) + " days into the contract and volatility is at " + $('#postVolatility').val() +
    "%, then the contract value has " + change + " by " + rel + "%."; 
  }