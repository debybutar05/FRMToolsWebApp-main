import React from "react";
import Plot from "react-plotly.js";

const GeoChoropleth = () =>{
    // var data = [{
    //     type: "choroplethmap", 
    //     locations: ["NY", "MA", "VT"], z: [-50, -10, -20],
    //     geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json"
    //     // geojson: "/geoMap_Jakarta_Kecamatan.json"
    //   }];
      
    // var layout = {
    //     mapbox: {
    //         center: {lon: 106.8456, lat: -6.2088}, 
    //         zoom: 3.5
    //     },
    //     width: 600, height:400
    // };
    
    // var config={
    //     mapboxAccessToken: "eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfMW4xNDFsMjciLCJqdGkiOiIyNzVmMGQzZiJ9.p2O2ropDn4yHxljCyqWVEkSpOi9UAxOdnrDyOidRKMk",
    //   }

    var data = [
        {type: "scattermap", lon: [-86], lat: [34], marker: {size: 20, color: 'purple'}},
        {
         type: "choroplethmap",locations: ["AL"], z: [10], coloraxis: "coloraxis",           geojson: {type: "Feature", id: "AL", geometry: {type: "Polygon", coordinates: [[
         [-86, 35], [-85, 34], [-85, 32], [-85, 32], [-85, 32], [-85, 32], [-85, 31],
         [-86, 31], [-87, 31], [-87, 31], [-88, 30], [-88, 30], [-88, 30], [-88, 30],
         [-88, 34], [-88, 35]]]
        }}}];
     
     var layout = {width: 600, height: 400, map: {style: 'streets',
         center: {lon: -86, lat: 33}, zoom: 5}, marker: {line: {color: "blue"}},
         coloraxis: {showscale: false, colorscale: "Viridis"}};
      
    return(
    <div className="row">
        <div className="col-md-12">
            <Plot data={data} layout={layout}/>
        </div>
    </div>
    )
}

export default GeoChoropleth