

var mapboxTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([46.519653, 6.632273], 14);


var svg = d3.select(map.getPanes().overlayPane).append("svg");

var g = svg.append("g").attr("class", "leaflet-zoom-hide");
    
    
d3.json("/data/places.geojson", function(collection) {

    var featuresdata = collection.features.filter(function(d) {
        return d.properties.country == "Switzerland";
    })
    console.log(featuresdata);

    var transform = d3.geo.transform({ point: projectPoint });
    var path = d3.geo.path().projection(transform);
    
    
    featuresdata.forEach(function(d) {
        generateEntry(d);
    });
    
    function reset() {

        var bounds = path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];

        g.selectAll("circle")
            .data(featuresdata)
            .attr("transform", function(d) {
                var point = applyLatLngToLayer(d);
                console.log("Reset Circle position:", point);
                return "translate(" + point.x + "," + point.y + ")";
            });

        svg.attr("width", bottomRight[0] - topLeft[0] + 120)
        .attr("height", bottomRight[1] - topLeft[1] + 120)
        .style("left", topLeft[0] - 50 + "px")
        .style("top", topLeft[1] - 50 + "px");

        g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

        
    }
    
    
    map.on("viewreset", reset);
    reset();

    });

function generateEntry(datapoint) {
    console.log(datapoint.properties.name);
    var circle = g
        .append("circle")
        .attr("r", 10) // increase the radius to make the circles bigger
        .attr("class", "waypoints")
        .attr("transform", function() {
            var point = applyLatLngToLayer(datapoint);
            console.log("Circle position:", point);
            return "translate(" + point.x + "," + point.y + ")";
        })
        .style("fill", "black");
    
    circle.on("mouseover", function() {

        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 15); // increase the radius when hovered over
    })
    .on("mouseout", function() {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 10); // decrease the radius when hovered out
    })
    .on("click", function() {
        map.setView([datapoint.geometry.coordinates[1], datapoint.geometry.coordinates[0]], 16);
        d3.select("#info-content").html(""); // clear the dashboard
        
        // display information about the selected datapoint
        var name = datapoint.properties.name;
        var country = datapoint.properties.country;
        var population = datapoint.properties.population;
        
        var info = "<h2>" + name + "</h2>";
        info += "<p><strong>Country:</strong> " + country + "</p>";
        info += "<p><strong>Population:</strong> " + population + "</p>";
        
        d3.select("#info-content").html(info); // display the information on the dashboard
    });
}
function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}

function applyLatLngToLayer(d) {
    var y = d.geometry.coordinates[1]
    var x = d.geometry.coordinates[0]
    return map.latLngToLayerPoint(new L.LatLng(y, x))
}


    