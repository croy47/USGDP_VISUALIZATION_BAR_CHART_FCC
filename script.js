//Work in Progress. This project is going to make GDP data of all countries accessible
const { select, json, scaleLinear, scaleTime, min, max, axisBottom, axisLeft } =
  d3;

const svg = select("svg").attr("width", innerWidth).attr("height", innerHeight);

//
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 100, bottom: 20, left: 100, right: 20 };

const chartHeight = height - margin.top - margin.bottom;
const chartWidth = width - margin.left - margin.right;

const ticksCount = width > 700 ? 10 : 5;

const chartMaker = (data) => {
  const timeArr = data.map((el) => new Date(el[0]));

  const maxTimeVal = new Date(max(timeArr));

  maxTimeVal.setMonth(maxTimeVal.getMonth() + 3);

  //scale and Axis

  const chart = svg.append("g");

  svg
    .append("text")
    .text("GDP Data of United States")
    .attr("id", "title")
    .attr("y", margin.top - 5)
    .attr("x", chartWidth / 2);

  // svg.append("text").text(Source);

  const xScale = scaleTime()
    .domain([min(timeArr), maxTimeVal])
    .range([margin.left, chartWidth]);

  const xAxisG = chart
    .append("g")
    .call(axisBottom(xScale).ticks(ticksCount))
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`);

  xAxisG
    .append("text")
    .attr("fill", "black")
    .text("Year")
    .attr("class", "axis-label")
    .attr("x", chartWidth / 2)
    .attr("y", 50)
    .attr("text-anchor", "middle");

  const yScale = scaleLinear()
    .domain([0, max(data, (d) => d[1])])
    .range([chartHeight, margin.top]);

  // console.log(yScale.domain());

  const yAxisG = chart
    .append("g")
    .call(axisLeft(yScale).tickSize(-chartWidth + 100))
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`);

  yAxisG
    .append("text")
    .attr("fill", "black")
    .text("GDP (In Billion Dollars)")
    .attr("class", "axis-label")
    .attr("x", -chartHeight / 2)
    .attr("y", -60)
    .attr("transform", `rotate(-90)`);

  // Tooltip
  const tooltip = select("body").append("div").attr("id", "tooltip");

  chart
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (_, i) => xScale(timeArr[i]))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", chartWidth / 275)
    .attr("height", (d) => chartHeight - yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (e, d) => {
      tooltip
        .attr("data-date", d[0])
        .html(`<p>$${d[1]}B</p><p>${d[0]}</p>`)
        //style
        .style("left", e.clientX + 10 + "px")
        .style("top", e.clientY - 40 + "px");

      return tooltip.style("opacity", 0.5);
    })
    .on("mouseout", (e, d) => {
      return tooltip.style("opacity", 0);
    });
};

//////fetch data && process
await json("data.json").then((gdp_data) => {
  let data = gdp_data.data;

  return chartMaker(data);
});

// Source of Data -
