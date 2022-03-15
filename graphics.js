

var data = [
    {name: 0, value: "0.08167"},
    {name: 1, value: "0.01492"},
    {name: 2, value: "0.0015"},
    {name: 3, value: "0.01974"},
    {name: 4, value: "0.00074"}
  ];

  var height = 400;
var width = 400;
var margin = ({top: 20, right: 20, bottom: 20, left: 20});

var x = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([margin.left, width - margin.right])
  .padding(0.1);

  var x = d3.scaleLinear()
  .domain([0,d3.max(data, d => d.name)])
  .range([margin.left, width - margin.right])

var y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([height - margin.bottom, margin.top]);

  //console.log(y);

  var xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x));

var yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y));

  