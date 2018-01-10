import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import React, {Component} from 'react';

// import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js'

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiaGFycmlzb25kZG8iLCJhIjoiY2pjN2kzaWpxMXVpNzMzbzBoZDBwN3BpbCJ9.buxFzFrEOlXXTbE_dYyNMw"
});

class MapBox extends Component {


  render() {
    return (
      <Map
        style={{mapbox:"//styles/mapbox/streets-v10"}}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
          </Layer>
      </Map>

    )
  }
}

export default MapBox;
