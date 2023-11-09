    var margin = { top: 0, left: 0, right: 0, bottom: 0 },
        height = 1200,
        width = 900;

    var svg = d3.select("#map")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("id", "svg_id");

    var prjctn = d3.geo.mercator()
        .translate([width / 2, height / 2])
        .scale(3000)
        .center([-4, 55]);

    var path = d3.geo.path().projection(prjctn);

    function updateMap() {
        // Fetching the towns from the JSON infeed
        fetch('http://34.38.72.236/Circles/Towns/' + document.getElementById('townsSlider').value)
            .then(response => response.json())
            .then(data => {
                // Erase all of the towns if any
                svg.selectAll('.towns').remove();
                svg.selectAll('.city_name').remove();

                // Adding new towns to the map
                svg.selectAll('.towns')
                    .data(data)
                    .enter().append('svg:image')
                    .attr("class", "towns")
                    .attr("transform", function (d) {
                        return "translate(" + -20 / 2 + "," + -20 / 2 + ")";
                    })
                    .attr("xlink:href", function (d) {
                        return 'icon.png';
                    })
                    .attr("x", function (d) {
                        var coords = prjctn([d.lng, d.lat]);
                        return coords[0];
                    })
                    .attr("y", function (d) {
                        var coords = prjctn([d.lng, d.lat]);
                        return coords[1];
                    });

                // Append city names
                svg.selectAll('city_name')
                    .data(data)
                    .enter()
                    .append('text')
                    .attr('class', 'city_name')
                    .attr("x", function (d) {
                        var coords = prjctn([d.lng, d.lat]);
                        return coords[0];
                    })
                    .attr("y", function (d) {
                        var coords = prjctn([d.lng, d.lat]);
                        return coords[1];
                    })
                    .text(function (d) {
                        return d.Town;
                    })
                    .attr('dx', '15')
                    .attr('dy', '10');
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function updateSliderValue() {
        var sliderValue = document.getElementById('townsSlider').value;
        document.getElementById('sliderValue').innerHTML = sliderValue;
    }

    // Drawing the map initially
    d3.json('united-kingdom.json', function (error, data) {
        svg.selectAll(".country")
            .data(data.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path)
            .append('title')
            .text("Great Britain");
    });

    // Loading the map initially with the data
    updateMap();
