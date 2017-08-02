
$.ajax({
    url: "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
    type: 'GET',
    dataType: 'json',
    success: function(data) {

        ///set margins
        var margin = {top: 60, right: 40, bottom: 20, left:40};
        var height = 500 - margin.top - margin.bottom;
        var width = 900 - margin.right - margin.left;

        //Add a date object to the array
        var time;

        for (var i=0; i<data.length; i++) {
            time = new Date(0);
            time.setHours(24);
            time.setSeconds(data[i].Seconds);
            data[i]["objDate"] = time;
        }

        //Set min and max Times

        var minTime = data[0].objDate;
        var maxTime = data[data.length-1].objDate;
        //maxTime.setSeconds(buffer);

        var blankDate = new Date(0);
        blankDate.setHours(24);

        var diff = new Date(0);
        diff.setHours(24);
        diff.setSeconds(data[data.length-1].Seconds - data[0].Seconds  + 9);


        //canvas
        var svg = d3.select("#chartContainer")
            .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var yScale = d3.scaleLinear()
            .domain([36, 1])
            .range([height, 0]);

        var xAxisScale = d3.scaleTime()
            .domain([diff, blankDate])
            .range([0, 825]);

        var xScale = d3.scaleTime()
            .domain([maxTime, minTime])
            .range([40, 825]);

        var yNumberTicks = 10;
        var xNumberTicks = 10;

        var axisVertical = d3.axisLeft(yScale)
                            .ticks(yNumberTicks)
                            .tickSize(5,5)
                            .tickSizeOuter(0);


        var axisHorizontal = d3.axisBottom(xAxisScale)
                                .tickFormat(d3.timeFormat("%M:%S"))
                                .tickSizeOuter(0)
                                .ticks(xNumberTicks);

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .html('ok');
        //axes
        svg.append('g')
            .attr("class", "yAxis")
            .attr('transform', 'translate(0, 0)')
            .call(axisVertical);

        svg.append('g')
            .attr("class", "xAxis")
            .attr('transform', 'translate(0,' + height + ')')
            .call(axisHorizontal);

        //grid lines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxisScale)
                .ticks(xNumberTicks)
                .tickSizeOuter(0)
                .tickSize(-height)
                .tickFormat("")
            );
        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(yScale)
                .ticks(yNumberTicks)
                .tickSize(-width-5)
                .tickFormat("")
            );

        var dotRadius = 5;
        //add key
        svg.append('circle')
            .attr("class", "pointClean")
            .attr("cx", width-235)
            .attr("cy", height-175)
            .attr("r", dotRadius);

        svg.append('circle')
            .attr("class", "pointDoping")
            .attr("cx", width-235)
            .attr("cy", height-150)
            .attr("r", dotRadius);


        //scatter points
        var points = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", function(d) {
                                    if (d.Doping == "") {
                                        return "pointClean"
                                    }
                                    else {
                                        return "pointDoping"
                                    }
                                })
                .attr("cx", function(d) {return xScale(d.objDate)})
                .attr("cy", function(d, i) {return i*(height/35) })
                .attr("r", dotRadius)
                .on('mouseover', function(d) {return tooltip
                    .html("<div class='toolText'> Time: " + d.Time + ", " + "Year: " + d.Year +
                        "<br>" + d.Name + ", " + d.Nationality +
                        "<br>" +
                        "<br>" + d.Doping
                        + "</div>")
                    .style("visibility", "visible");})
                .on("mousemove", function(){return tooltip.style("top",
                    (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
                .on('mouseout', function() {return tooltip.style("visibility", "hidden");});


    },
    error: function() {
        alert('error');
    }
});



