

//Width and height for whole
var w = 900;
var h = 600;

//image width and height
var image_w = 150;
var image_h = 150;

//For selected node
var active = d3.select(null);

//Define map projection
var projection = d3.geo.albersUsa()
    .translate([w/2.5, h/2.5])
    .scale([1000]);

//Zoom behavior
var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//Map the winrate to opacity[0.3, 0.9] 
var Opacity = d3.scale.linear()
    .range([0.2, 1.0]);

//Map the rank to radius[2, 20] 
var Scale = d3.scale.linear()
    .range([2, 20]);

//Create SVG element
var svg = d3.select("h1")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .on("click", stopped, true);

//Creater a group to store states
var g = svg.append("g")
    .attr("class","map");

//Enable to zoom
g.call(zoom.event);
//Allow free zooming
//g.call(zoom); 
    
//Load in state data, draw the map
d3.csv("data/US-states.csv", function(data) {
    createTimeLine();

    //Load in GeoJSON data
    d3.json("data/US-geo.json", function(json) {
        //Merge the EastorWest data and GeoJSON
        //Loop through once for each EastorWest data value
        for (var i = 0; i < data.length; i++) {
            var dataState = data[i].state;              //Grab state name
            var dataValue = parseFloat(data[i].value);  //Grab data value, and convert from string to float
            var dataEASTorWEST = data[i].EASTorWEST;
            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    //Copy the data value into the JSON
                    json.features[j].properties.EASTorWEST = dataEASTorWEST;
                    //Stop looking through the JSON
                    break;
                }
            }
        }

        //Bind data and create one path per GeoJSON feature
        g.selectAll("path")
            .data(json.features).enter()
            .append("path")
            .attr("stroke","white")
            .attr("stroke-width",2)
            .attr("d", path)
            .attr("class", function(d) {
                return d.properties.postal;})
            .style("fill", function(d) {
                //Get data value
                var EASTorWEST = d.properties.EASTorWEST;

                if (EASTorWEST) {
                    //If value exists…
                    if (EASTorWEST == "East") {
                        return "#C6E2FF";
                    } else {
                        return "#FFB6C1";
                    }
                } else {
                    //If value is undefined…
                    return "#CCCCCC";
                }
            })
            .on("click", stateClick);

        //顯示2015年的新秀資料    
        readDraft(2015);
    });
});



//TeamData for Rader chart
var teamRadarData = [];
//List of teams
var teamList = [];

//Return the map of a team
function teamDataset(teamRadarData) {
    return teamRadarData.map(function(d) {
        return {
            className: d.className,
            axes: d.axes.map(function(axis) {
                return { axis: axis.axis, value: axis.value };})
        };
    });
}

//Regularize the rank, rank 1 to 30 points
function regularizeRank(rank) {
    return ((31 - rank) / 30 * 100).toFixed(1);
}

//Judge if is in the array
function contains(array, obj) {
    var i = array.length; 
    while (i--) { 
        if (array[i] === obj) { 
            return true; 
        } 
    } 
    return false; 
}

//Get the index of the element in an array
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {  
        if (this[i] == val) return i;  
    }  
    return -1;  
};  

//Delete an element in an array
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);  
    if (index > -1) {  
        this.splice(index, 1);  
    }
};  

//When click a Node
function teamClick(d) {
    selectedTeamName = d.teamname;
    if (contains(teamList, selectedTeamName)) { //Contains the node
        //Restore the node color
        d3.select(this)
            .style("fill", function(d){
            if (d.EASTorWEST == "East") {
                return "blue";
            } else {
                return "red";
            };
        });

        //Remove in the teamList;
        teamList.remove(selectedTeamName);

        //Existing node number after deleting
        if (teamList.length == 0) { //點掉node
            
        } 
    } else {    //Does not contain the node
        teamList.push(selectedTeamName);
        active = d3.select(this).style("fill", "orange");
        //if (teamList.length == 1) {
            document.getElementById("name").innerHTML = thisYearDraft[d.abb][0]["Name"];
            document.getElementById("PTS").innerHTML = thisYearDraft[d.abb][0]["PTS"];
            document.getElementById("Pk").innerHTML = thisYearDraft[d.abb][0]["Pk"];
            document.getElementById("TRB").innerHTML = thisYearDraft[d.abb][0]["TRB"];
            document.getElementById("AST").innerHTML = thisYearDraft[d.abb][0]["AST"];
            document.getElementById("pic").src = thisYearDraft[d.abb][0]["pic"];
        //}
        
    }
}



//Click the state to zoom
function stateClick(d) {
    //Inverse when have selected
    if (active.node() == this) {
        active.style("fill", function(d) {
            //Get data value
            var EASTorWEST = d.properties.EASTorWEST;
            if (EASTorWEST) {
                //If value exists…
                if (EASTorWEST == "East") {
                    return "#C6E2FF";
                } else {
                    return "#FFB6C1";
                }
            } else {
                //If value is undefined…
                return "#ccc";
            }
        });
        //Delete the state name
        stateAbb = d3.select(this).attr("class");
        svg.selectAll(".text-" + stateAbb).remove();

        return stateReset();
    }

    active = d3.select(this).style("fill", "orange");

    //Modify the size 
    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = 0.7 / Math.max(dx / w, dy / h),
        translate = [w / 2 - scale * x, h / 2 - scale * y];

    svg.transition()
        .duration(600)
        .call(zoom.translate(translate).scale(scale).event);

    g.append("text")
        .attr("class", "text-" + d.properties.postal)
        .attr("x", x - 20)
        .attr("y", y)
        //.attr("x", projection([d.properties.longitude, d.properties.latitude])[0])
        //.attr("y", projection([d.properties.longitude, d.properties.latitude])[1])
        .attr("font-size", "10px")
        //.style("fill", "#888888")
        .style("cursor", "default")
        .text(d.properties.name);
}

//Get back to the normal map
function stateReset() {
    active = d3.select(null);

    svg.transition()
      .duration(600)
      .call(zoom.translate([0, 0]).scale(1).event);

    d3.selectAll(".bar-form")
        .style("display", "inline");
    svg.selectAll(".teamRadar")
        .style("display", "inline");
    svg.selectAll(".stack-bar")
        .style("display", "inline");
    svg.selectAll(".pie-chart")
        .style("display", "inline");
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) {
        d3.event.stopPropagation();
    }
}

//Get back to original status
function nodeMouseout(d){
    g.selectAll("circle").style("opacity", function(d){
        if(typeof thisYearDraft[d.abb] != "undefined"){
            return Opacity(1);}
        else{return Opacity(-1);}
    })

    d3.select(this).select("circle")
        .transition()
        .duration(200)
        .attr("r", function(d) { 
            if(typeof thisYearDraft[d.abb] != "undefined"){
                return Scale(thisYearDraft[d.abb][0]["PTS"]*3);}
            else{return 40;}
        })
        .style("opacity", function(d){
            if(typeof thisYearDraft[d.abb] != "undefined"){
                return Opacity(1);}
            else{return Opacity(-1);}
        })
        .style("stroke-width", "1px");

    d3.select(this).select("text")
        .transition()
        .duration(200)
        .attr("dx", "20")
        .style("fill", "#888888")
        .style("font-size", "16px")
        .text(function(d) {
            return d.abb});

    g.select("image")
        .remove();
}

//Timeline
function createTimeLine() {
    $("#slider-range-min").slider({
        range: "min",
        value: 2015,
        min: 1996,
        max: 2015,
        slide: function( event, ui ) { //滾動時間時
            $( "#amount" ).val( ui.value );
            readDraft(ui.value);
        }
    });
    $("#amount").val( $( "#slider-range-min" ).slider( "value" ) );
};

var thisYearDraft = {};


//讀取當年度新秀資料
function readDraft(year) {
    $("#chartContainer").html("");
    var svg = dimple.newSvg("#chartContainer", 1200, 600);
    thisYearDraft = {};
    var nodes = g.selectAll("circle").remove();
    nodes = g.selectAll("text").remove();
    //Load in NBA teams data
    d3.csv("data/NBA-teams.csv", function(teamData) {
        //Create nodes group
        nodes = g.selectAll("circle")
            .data(teamData)
            .enter()
            .append("g")
            .attr("class", "team")
            .attr("transform", function(d) {
                return "translate(" + projection([d.lon, d.lat])[0] + "," + projection([d.lon, d.lat])[1] + ")";})
            .on("mouseout", nodeMouseout);

        Scale.domain([0, 70]);

        d3.csv("data/draft_NBA_1996-2015.csv", function(draftData) {
            var chartInfo = [];

            for (var i = 0; i < draftData.length; i++) { //every draft
                if(draftData[i].Year == year){

                    if(thisYearDraft[draftData[i].Tm] == null)
                        thisYearDraft[draftData[i].Tm] = [];
                    thisYearDraft.year = year;

                    for(var j = 0; j < teamData.length; j++){
                        if(draftData[i].Tm == teamData[j].abb){
                            var playerInfo = {};
                            playerInfo["Year"] = draftData[i].Year;
                            playerInfo["Name"] = draftData[i].Player;
                            playerInfo["PTS"] = draftData[i].PTS;
                            playerInfo["Pk"] = draftData[i].Pk;
                            playerInfo["TRB"] = draftData[i].TRB;
                            playerInfo["AST"] = draftData[i].AST;
                            playerInfo["pic"] = draftData[i].PICTURE;
                            playerInfo["SALARY"] = draftData[i].SALARY;

                            console.log(draftData[i]);

                            chartInfo.push(playerInfo);
                            thisYearDraft[draftData[i].Tm].push(playerInfo);    
                        }
                    }
                }
            }

            //Circles for teams
            nodes.append("circle")
                .attr("class", function(d) { return d.abb })
                .attr("r", function(d){
                    if(typeof thisYearDraft[d.abb] != "undefined"){
                        return Scale(thisYearDraft[d.abb][0]["PTS"]*3);}
                    else{return 10;}
                })
                .style("fill", function(d){
                    if (d.EASTorWEST == "East") {
                        return "blue";
                    } else {
                        return "red";
                    };
                })
                .style("opacity", function(d){
                    if(typeof thisYearDraft[d.abb] != "undefined"){
                        return Opacity(1);}
                    else{return Opacity(-1);}
                })
                .style("cursor", function(d){
                    if(typeof thisYearDraft[d.abb] != "undefined"){
                        return "pointer";}
                    else{return "default";}
                })
                .on("click", teamClick); //點node 呼叫teamclick

            //text for teams
            nodes.append("text")
                .attr("class", function(d) {
                    return "text " + d.abb;})
                .attr("dx", "20")
                .attr("dy", ".5em")
                .style("fill", "#888888")
                .style("font-weight", "bold")
                .style("cursor", "default")
                .style("opacity", function(d){
                    if(typeof thisYearDraft[d.abb] != "undefined"){
                        return Opacity(1);}
                    else{return Opacity(-1);}
                })
                .style("font-size", "16px")
                .text(function(d){
                    return d.abb;});            

            //when mouseover
            nodes.on("mouseover", function(d){
                console.log(thisYearDraft.year);
                console.log(thisYearDraft[d.abb][0]["pic"]);

                g.selectAll("circle").style("opacity", function(d){
                    if(typeof thisYearDraft[d.abb] != "undefined"){
                        return Opacity(0.3);}
                    else{return Opacity(-1);}
                })

                d3.select(this).select("text")
                    .transition()
                    .duration(200)
                    .attr("dx", "30")
                    .style("fill", "#000000")
                    .style("font-size", "30px")
                    .text(function(d) {
                        return thisYearDraft[d.abb][0]["Name"];
                    });

                d3.select(this).select("circle")
                    .transition()
                    .duration(200)
                    .attr("r", function(d) { 
                         return Scale(thisYearDraft[d.abb][0]["PTS"]*5); 
                    })
                    .style("opacity", function(d){
                        return Opacity(d.winrate);
                    })
                    .style("stroke-width", "1px");

                //Append the logo of the team
                g.append("image")
                    .attr("class", d.abb)
                    .attr("xlink:href", "logo/" + d.abb + "_logo.svg")
                    .attr("width", image_w + "px")
                    .attr("height", image_h + "px")
                
                //remove the blink effect
                    .attr("x", projection([d.lon, d.lat])[0] + 5)
                    .attr("y", projection([d.lon, d.lat])[1] + 5);

            });
            //Map the winrate to fontsize[10, 20] 
            var FontSize = d3.scale.linear()
                .domain([15, 1])
                .range([10, 20]);

            console.log(chartInfo);

            // Create the chart as usual
            var myChart = new dimple.chart(svg, chartInfo);
            myChart.setBounds(70, 40, 900, 320);
            
            // Add the x axis reading dates in the format 01 Jan 2012
            // and displaying them 01 Jan
            var x = myChart.addCategoryAxis("x", "Name");
            x.addOrderRule(["Pk"]);

            // Add the y axis reading dates and times but only outputting
            // times.  
            var y = myChart.addMeasureAxis("y", ["SALARY"]);

            // Size the bubbles by volume
            var z = myChart.addMeasureAxis("z", ["PTS"]);
            
            var b = myChart.addSeries(["Name"], dimple.plot.bar);
            b.barGap = 0.1;


            // Control bubble sizes by setting the max and min values    
            z.overrideMin = 0;
            z.overrideMax = 40;

            // Add the bubble series for shift values first so that it is
            // drawn behind the lines
            myChart.addSeries(["Year"], dimple.plot.bubble);

            // Add the line series on top of the bubbles.  The bubbles
            // and line points will naturally fall in the same places
            var s = myChart.addSeries(["Year"], dimple.plot.line);

            // Add line markers to the line because it looks nice
            s.lineMarkers = true;

            // Draw everything
            myChart.draw();
        });
    });
}