
function makeGraphics(data){
// var data = [
//     {name: 0, value: "0.08167"},
//     {name: 1, value: "0.01492"},
//     {name: 2, value: "0.0015"},
//     {name: 3, value: "0.01974"},
//     {name: 4, value: "0.00074"}
//   ];

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
.domain([0, d3.max(data, d => d.y)])
.range([height - margin.bottom, margin.top]);

var color = d3.scaleLinear()
.domain([0,d3.max(data, d => d.value)])
//.interpolator(d3.interpolatePuRd)
.range(["green","red"])

//color = d3.scaleSequentialSqrt([0, d3.max(data, d => d3.max(d.value))], d3.interpolatePuRd)
//color = d3.scaleSequentialSqrt([0, 30], d3.interpolatePuRd)


var svg = d3.select('svg');

var g = svg.append("g").attr("fill", "orange");



g.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", d => x(d.x))
  .attr("y", d => y(d.y))
  //.attr("height", d => y(0) - y(d.value))
  .attr("height",8) // rect size
  .attr("width", 8)
  //.attr("title","ok")
  .attr("fill", d => color(d.value));

 

// var x = d3.scaleBand()
//  .domain(data.map(d => d.y))
//  .range([margin.left, width - margin.right])
//  .padding(0.1);



  //console.log(y);

  var xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x));

var yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y));
}
  