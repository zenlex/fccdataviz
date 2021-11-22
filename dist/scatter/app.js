import*as d3 from"d3";const w=800,h=800,padding=60,graph=d3.select(".graph-container").append("svg").attr("x",0).attr("y",0).attr("width",w).attr("height",h),url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";function updateGraph(t){const a=[],e=[];for(const r of t)a.push(r.Year),e.push(new Date(1e3*r.Seconds));const r=d3.scaleLinear([d3.min(a)-.5,d3.max(a)+.5],[0,680]),n=d3.axisBottom(r),l=d3.scaleLinear().range([0,h]);l.domain([d3.min(e),d3.max(e).setSeconds(d3.max(e).getSeconds()+5)]);const o=d3.axisLeft(l),i=d3.select(".graph-container").append("div").attr("id","tooltip").style("opacity",0);graph.selectAll("circle").data(t).enter().append("circle").attr("r",5).attr("cx",((t,e)=>r(a[e])+60)).attr("cy",((t,a)=>l(e[a])-60)).attr("data-xvalue",(t=>t.Year)).attr("data-yvalue",((t,a)=>e[a])).style("fill",(t=>t.Doping?"red":"blue")).attr("class","dot").on("mouseover",((t,a)=>{i.attr("data-year",a.Year).style("left",`${t.clientX+5}px`).style("top",`${t.clientY}px`),i.transition().duration(100).style("opacity",.9),i.html(`<h4>${a.Name}</h4><h4>Time:${a.Time}</h4><h4>Year:${a.Year}</h4><h4>Place: ${a.Place}</h4><h4>Nationality: ${a.Nationality}</h4><a href=${a.URL}> <h4>${a.Doping}</h4></a>`)})).on("mouseout",(()=>{i.transition().duration(200).style("opacity",0)})),graph.append("g").attr("id","x-axis").attr("transform","translate(60, 740)").call(n.tickFormat(d3.format("d"))),graph.append("g").attr("id","y-axis").attr("transform","translate(60, -60)").call(o.tickFormat(d3.timeFormat("%M:%S")));const s=graph.append("g").attr("id","legend").attr("transform","translate(740, 380)");s.append("text").text("No doping allegations").attr("class","legend-label").style("fill","blue"),s.append("text").text("Riders with doping allegations").attr("class","legend-label").attr("transform","translate(0, 20)").style("fill","red")}function fetchData(t,a){fetch(t).then((t=>t.json())).then((t=>{a(t)}))}fetchData(url,updateGraph);