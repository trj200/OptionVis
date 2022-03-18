
function makeGraphics(data){

//   data = [
//     {x:1, y:1, value:1},
//     {x:2,y:2,value:2},
//     {x:1,y:2,value:3}
//   ];

var height = 400;
var width = 400;
var margin = ({top: 20, right: 20, bottom: 20, left: 20});

var x = d3.scaleLinear()
.domain([0,d3.max(data, d => d.x)])
.range([margin.left, width - margin.right])

var y = d3.scaleLinear()
.domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
.range([height - margin.bottom, margin.top]);

var color = d3.scaleLinear()
.domain([0,d3.max(data, d => d.value)])
.range(["red","green"])

var svg = d3.select('svg');
var g = svg.append("g").attr("fill", "orange");

g.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", d => x(d.x))
  .attr("y", d => y(d.y))
  .attr("height",17) // rect size
  .attr("width", 17)
  .attr("fill", d => color(d.value))
  .append("svg:title").text(d => d.value);

  var xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x));

var yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y));
}
  