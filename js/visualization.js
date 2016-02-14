/*
VISUALIZING THE SAUDI WORKFORCE
Code: https://github.com/hks-epod/hrdf
Feb 2016
*/


// Putting these in the global scope - otherwise, how do I return and pass?
var w = 1200,
	h = 500,
	pie = d3.layout.pie(),
	pieRadius = d3.scale.sqrt().range([5, 40]),
	arc = d3.svg.arc(),
	donutLayer;

// Rotating the Earth here...
// Saudi longlat: 45° E, 24° N
var projection = d3.geo.mercator()
	.center([0, 24])
	.rotate([-45, 0])
	.scale(1500)
	.translate([w/3, h/2]);

// Setting the basic province to Riyadh
var userProvince = "Riyadh";


//THE DATA QUEUE
queue()
	.defer(d3.json, "_geo/saudi_comp.json")
	.defer(d3.csv, "_data/capitals.csv", processCapitals)
	.defer(d3.csv, "_data/donuts.csv")
	.await(ready);

//THE FUNCTION THAT CALLS THE OTHER DRAW FUNCTIONS
function ready(error,json,csv,new_csv) {
	drawMap(json);
	userButtons(csv, new_csv);
}


function mouseover(d) {
	var className = this.parentNode.getAttribute("class"),
		provinceName,
		comma = d3.format(","),
		mousecoord = [0,0],
		mousecoord = d3.mouse(this),
		style = window.getComputedStyle(this, null),
		thisColor = style['fill'],
		thisIndustry = this.parentNode.__data__.industry;

	var totalWorkers = parseFloat(this.parentNode.__data__.Saudi) + parseFloat(this.parentNode.__data__['Non-Saudi']),
		percentSaudi = parseFloat(this.parentNode.__data__.Saudi) / totalWorkers,
		percentSaudi = parseInt(percentSaudi * 100);

	if (className == "donut") {
		provinceName = this.parentNode.getAttribute("id");
		d3.select("#caption")
			.html("<br> There are " + percentSaudi + "% Saudi workers in the " 
					+ thisIndustry + " industry in " + provinceName + " province.");

		d3.selectAll(".total-workforce").text(null);
	
	} else if (className == "pie") {
		provinceName = this.parentNode.__data__['capital'];
		
		d3.select("#caption").text(null);
		d3.selectAll(".total-workforce").text("Total");

	}

	d3.select("#tooltip")
		.style("left", mousecoord[0] + w/2 + "px")
		.style("top", mousecoord[1] + h/2 + "px");

	d3.select(this)
		.style("stroke-width", "2px")
		.style("fill", d3.rgb(thisColor).darker());
	
	d3.select("#provinceName").text(provinceName + " province");
	d3.select("#saudi").text(comma(this.parentNode.__data__.Saudi));
	d3.select("#expats").text(comma(this.parentNode.__data__['Non-Saudi']));

	if (d.data == this.parentNode.__data__.Saudi) {
		d3.select("#saudi").style("background-color", "yellow");
		d3.select("#expats").style("background-color", null);
	} else if (d.data == this.parentNode.__data__['Non-Saudi']) {
		d3.select("#saudi").style("background-color", null);
		d3.select("#expats").style("background-color", "yellow");
	}

	d3.select("#tooltip").classed("hidden", false);
};


function mouseout(d) {
	d3.select("#tooltip").classed("hidden", true);

	// Feels really hacky :/
	style = window.getComputedStyle(this, null),
	thisColor = style['fill'];

	
	d3.select(this)
		.style("stroke-width", "1px")
		.style("fill", d3.rgb(thisColor).brighter());
};


function demoused(d) {
	d3.select(this).attr("class", "nomouse");

	d3.select("#chartTitle")
		.text(d.id)
		.classed("hoverTitle", false)
		.classed("title", true); 
}


function processCapitals(d) {
	d.Total = +d.Total; //TODO: Replace w Eric's destring func.
	d.Saudi = +d.Saudi;
	d['Non-Saudi'] = +d['Non-Saudi'];

	return d;

}


function userButtons(csv, new_csv) {
	var toggle = false;

	// DRAW THE OVERALL LEGEND
   	var legend = d3.select("svg")
   					.append("g")
   					.attr("id", "legend");

   	var saudis = legend.append("g");

	saudis.append("circle")
		.attr("cx", "50px")
		.attr("cy", "450px")
		.attr("r", 5)
		.attr("class", "saudi");

   	saudis.append("text")
   		.attr("x", "63px")
   		.attr("y", "455px")
   		.text("Saudi workers");

   	var expats = legend.append("g");

   	expats.append("circle")
   		.attr("cx", "50px")
   		.attr("cy", "470px")
   		.attr("r", 5)
   		.attr("class", "expat");

   	expats.append("text")
   		.attr("x", "63px")
   		.attr("y", "475px")
   		.text("Non-Saudi workers");

	d3.selectAll("#byWorkforce").on("click", function() {
		
		d3.select(".menu").remove();
		d3.selectAll(".chart").remove();
		d3.select(".donutLayer").remove();
		toggle = !toggle;
		

		d3.select(".map").selectAll("path")
   				.on("mouseover", null)
   				.on("mouseout", null)
   				.classed("nomouse", true)
   				.classed("moused", false);

		if (toggle == true) {
			d3.select(".chart").remove();
			d3.select(".menu").remove();
			d3.select(".donutLayer").remove();
			d3.select("#byWorkforce").classed("button selected", true);
			drawPies(csv);		
		}
		else if (toggle == false) {
			d3.select(".circleLayer").remove();
			d3.selectAll(".button").classed("selected", false);
		}

	});
   

   d3.select("#byRegion").on("click", function() {

   		d3.select(".circleLayer").remove();
   		d3.select(".donutLayer").remove(); 
   		d3.select(".menu").remove();
   		toggle = !toggle;

   		if (toggle == true) {
   			d3.select(".circleLayer").remove();
   			d3.select(".donutLayer").remove();
   			d3.select("#byRegion").classed("button selected", true);
   			drawBars(new_csv);		
   		}
   		else if (toggle == false) {
   			d3.select(".chart").remove();
   			d3.select(".donutLayer").remove();
   			d3.select(".map").selectAll("path")
   				.on("mouseover", null)
   				.on("mouseout", null)
   				.classed("nomouse", true)
   				.classed("moused", false);

   			d3.selectAll(".button").classed("selected", false);
   		}
   	});

   	d3.select("#byIndustry").on("click", function() {

   		d3.select(".circleLayer").remove();
   		d3.select(".menu").remove();
   		toggle = !toggle; 

   		if (toggle == true) {
   			d3.select(".circleLayer").remove();
   			d3.select("#byIndustry").classed("button selected", true);
   			chooseIndustries(new_csv);
   		}
   		else if (toggle == false) {
   			d3.select(".donutLayer").remove();
   			d3.select(".chart").remove();
   			d3.select(".menu").remove();
   			
   			d3.select(".map").selectAll("path")
   				.on("mouseover", null)
   				.on("mouseout", null)
   				.classed("nomouse", true)
   				.classed("moused", false);

   			d3.selectAll(".button").classed("selected", false);
   		}
   	});

};


function drawMap(json) {

	var path = d3.geo.path()
		.projection(projection);

	var svg = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	var map = d3.select("svg")
		.append("g")
		.attr("class", "map");

	var comma = d3.format(",");

	var provinces = topojson.feature(json, json.objects.saudi);
		
	map.selectAll("path")
	   .data(provinces.features)
	   .enter()
	   .append("path")
	   .attr("d", path)
	   .attr("class", "province nomouse")
	   .attr("id", function(d) { return d.id; });

} //drawMap


function drawPies(csv) {
	
	pieRadius.domain([1, d3.max(csv, function(d) { return d.Total; })]);
	
	arc.innerRadius(0)
		.outerRadius(function(d) { return pieRadius(this.parentNode.__data__.Total); });

	pie.value(function(d) { return d; });

	var circleLayer = d3.select("svg")
					.append("g")
					.attr("class", "circleLayer");

	var pies = circleLayer.selectAll(".pie")
		.data(csv)
		.enter()
		.append("g")
		.attr("id", function(d) { return d.capital; })
		.attr("class", "pie")
		.attr("transform", function(d) {
			return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";
			});

	pies.selectAll(".slice")
		.data(function(d) {
			return pie([d['Saudi'], d['Non-Saudi']]);
		})
		.enter()
		.append('path')
		.attr('d',  arc)
		.attr('class', 'slice')
		.attr('class', function(d, i) { 
			// Terrible hack
			if (i==0) { return "saudi"; }
			if (i==1) { return "expat"; }
		})
		.on("mouseover", mouseover)
			.on("mouseout", mouseout);

} //drawPies


function drawBars(new_csv) {

	data = new_csv;

	var barWidth = 10;

	var y = d3.scale.linear()
		.domain([0, 600000]) //from the policy brief scale
		.range([0, h/2]);

	var xAxis = d3.svg.axis()
					.orient("bottom");

	var yAxis = d3.svg.axis()
					  .scale(y)
					  .orient("left")
					  .ticks(5);

	var chart = d3.select("svg")
		.append("g")
		.attr("class", "chart")
			.attr("transform", "translate(-350, 50)");

	
	// FILTERING THE DATA
	filtered = data.filter(function(row) {
		return row['province'] == "Riyadh";
	})

	var bar = chart.selectAll("g")
		.data(filtered)
		.enter()
		.append("g")
		.attr("class", function(d) { return "bar " + d.province; })
		.attr("transform", function(d, i) { return "translate(" + (i * barWidth * 2 + 3*(w/4)) + ",0)"; });

	// SAUDI 
	saudiRects = bar.append("rect")
		.attr("width", barWidth);

	saudiRects.attr("height", function(d) { 
			return y(d.Saudi);
		})
		.attr("y", function(d) { return h/3 - y(d.Saudi); })
		.attr("class", function(d) { return "bars saudi " + d.industry; })
		

	// NON-SAUDI
	expatRects = bar.append("rect")
		.attr("width", barWidth);

	expatRects.attr("height", function(d) { 
			// return y(d.Saudi) - y(d['Non-Saudi']);
			// return h/3 - y(d.Saudi) - y(d['Non-Saudi']);
			return y(d['Non-Saudi']);
		})
		.attr("y", function(d) { return h/3 - y(d.Saudi) - y(d['Non-Saudi']); })
		.attr("class", function(d) { return "bars expat " + d.industry; })

	// BAR CHART TITLE
	chart.append("text")
		.attr("x", (w/2 + 400) + "px")
		.attr("y", "-10px")
		.attr("id", "chartTitle")
		.classed("title", true)
		.text(function(d) { 
			return "Riyadh";
			});


	// AXES

	// debugger;
	//TODO: Fix this - breaking on ordinal.
	// xAxis.domain(filtered.map(function(d) { return d.industry; })); 
	
	chart.call(xAxis);
	// chart.call(yAxis);



	// UPDATING THE province
		function update(d) {

			d3.select("path#Riyadh").attr("class", "nomouse");
			d3.select(this).attr("class", "moused");
			userProvince = d.id;

		d3.select("#chartTitle").text(userProvince);

		filtered = data.filter(function(row) {
			return row['province'] == userProvince;
		});

		bar = d3.selectAll('.bar').data(filtered);

		var new_bars = bar.enter()
			.append("g")
			.attr("transform", function(d, i) { return "translate(" + (i * barWidth + 3*(w/4)) + ",0)"; })
			
		new_bars.append("rect")
			.attr("width", barWidth)
			.attr("class", "bars saudi");

		new_bars.append("rect")
			.attr("width", barWidth)
			.attr("class","bars expat");

		bar.exit().remove();

		bar.attr("class", function(d) { 
				return "bar " + d.province; 
			});
		
		// UPDATING THE BAR CHART
		saudiRects = chart.selectAll(".bars.saudi");
		saudiRects.transition()
			.attr("height", function(d) { 
				return y(this.parentNode.__data__.Saudi);
			})
			.attr("y", function(d) { 
				return h/3 - y(this.parentNode.__data__.Saudi); 
				});

		expatRects = chart.selectAll(".bars.expat");
		expatRects.transition()
			.attr("height", function(d) {
				return y(this.parentNode.__data__['Non-Saudi']);	
				})
			.attr("y", function(d) { 
				return h/3 - y(this.parentNode.__data__.Saudi) - y(this.parentNode.__data__['Non-Saudi']); 
				});				

	} //update func

	// HIGHLIGHT THE SELECTED USER PROVINCE
	d3.select(".map").selectAll("path")
		.on("mouseover", update)
			.on("mouseout", demoused);

		d3.select("path#Riyadh").attr("class", "moused");

} //drawBars


function chooseIndustries(new_csv) {
	by_industry = d3.nest()
					.key(function(d) { return d.industry; })
					.entries(new_csv);

	var dropdown = d3.select("#industryMenu")
		.append("p")
		.attr("class", "menu")
		.text("Select an industry: ")
		.append("p")
		.append("select");
	
	dropdown.selectAll("option")
		.data(by_industry)
		.enter()
		.append("option")
		.attr("value", function (d) { return d.key; })
		.text(function (d) { return d.key; });


	// Default view
	var product = "Construction";
	drawDonuts(product);

	// Updating
	dropdown.on("change", function(d) {
				product = d3.select(this).property("value");
				drawDonuts(product);
			});

}

function drawDonuts(selectedIndustry) {

	d3.select(".donutLayer").remove();

	donutLayer = d3.select("svg")
		.append("g")
		.attr("class", "donutLayer");

	filtered = by_industry.filter(function(row) {
		return row['key'] == selectedIndustry;
	})
	filtered = filtered[0];

	maxValue = 0
	filtered['values'].forEach(function(d) {
		if (+d.total >= maxValue) {
			maxValue = +d.total;
		}
	})

	var donutRadius = d3.scale.sqrt().domain([1, maxValue]).range([3,15]);
	
	arc.innerRadius(function(d) { return donutRadius(this.parentNode.__data__['total'] * 5)})
		.outerRadius(function(d) { return donutRadius(this.parentNode.__data__['total']); });

	pie.value(function(d) { return d; });

	var donuts = donutLayer.selectAll(".donut")
		.data(filtered['values']);

	donuts.enter()
		.append("g")
		.attr("id", function(d) { return d.province; })
		.attr("class", "donut")
		.attr("transform", function(d) {
			return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";
			});

	donuts.exit().remove(); 

	donuts.selectAll(".donutslice")
		.data(function(d) {
			return pie([d['Saudi'], d['Non-Saudi']]);
		})
		.enter()
		.append('path')
		.attr('d',  arc)
		.attr('class', 'donutslice')
		.attr('class', function(d, i) { 
			if (i==0) { return "saudi"; } 
			if (i==1) { return "expat"; }
		})
		.on("mouseover", mouseover)
		.on("mouseout", mouseout);

}



