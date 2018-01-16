import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
import {MAPBOX_TOKEN} from './secret';
import './MapBox.css'
mapboxgl.accessToken = MAPBOX_TOKEN;

const MAP_INITIAL_LNG_CENTER = -98.1712;
const MAP_INITIAL_LAT_CENTER = 37.8229;
const MAP_INITIAL_ZOOM = 3.53;

class MapBox extends Component {
  constructor(props) {
    super(props);
    this.map=null;
    this.state = {
      lng: this.props.lon,
      lat: this.props.lat,
      lngMapCenter: MAP_INITIAL_LNG_CENTER,
      latMapCenter: MAP_INITIAL_LAT_CENTER,
      zoom: MAP_INITIAL_ZOOM,
      geojson:  [],
      mapInit: false,
      running: this.props.running
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");
    console.log("nextProps:", nextProps);
    console.log("this.state", this.state);
    if (nextProps.lat !== this.state.lat || nextProps.lon !== this.state.lng || this.state.running != nextProps.running) {
      console.log("WILL UPDATE LOCATION")
        if (this.state.geojson.length===0) {
          this.setState({geojson:  [
              [nextProps.lon, nextProps.lat]
          ]})
        } else {
          this.componentDidMount();
          this.setState ({
            lng: nextProps.lon,
            lat: nextProps.lat,
            geojson:  [
              [nextProps.lon, nextProps.lat]
            ],
            running: nextProps.running
          })
        }
    }
  }

  componentDidMount() {
    console.log("COMPONENT DID MOUNT");
    const { lng, lat, zoom } = this.state;

    console.log("lng:", lng, ", lat:", lat, ", zoom:", zoom);
    var blue = '#33C9EB';

    if (this.map===null) {
      this.map = new mapboxgl.Map({
        container: "map",
        style: 'mapbox://styles/mapbox/streets-v8',
        center: [lng, lat],
        zoom
      });
    }

    // this.map.on('move', () => {
    //   const { lng, lat } = this.map.getCenter();
    //
    //   this.setState({
    //     lngMapCenter: lng.toFixed(4),
    //     latMapCenter: lat.toFixed(4),
    //     zoom: this.map.getZoom().toFixed(2)
    //   });
    // });

      // add markers to map
      console.log("POINT GEOJSON:", this.state.geojson);
      this.state.geojson.forEach((marker) => {
        console.log("marker location", marker)


        //remove all marker
        var elem = document.getElementsByClassName("marker-pin");
        while(elem[0]) {
            elem[0].parentNode.removeChild(elem[0]);
        }
        var elem = document.getElementsByClassName("marker-car");
        while(elem[0]) {
            elem[0].parentNode.removeChild(elem[0]);
        }

        // create a HTML element for each feature
        // add the corresponing style to the marker
        var el = document.createElement('div');
        if (this.props.device ==="phone")
          el.className = 'marker-pin';
        else if (this.props.device ==="server")
          el.className = 'marker-car';

        // make a marker for each feature and add to the map
          var markerLayer=new mapboxgl.Marker(el).setLngLat(marker).addTo(this.map)

      });

      if (!this.state.controlAdded) {
        this.map.addControl(new mapboxgl.NavigationControl());
        this.setState({controlAdded: true})
      }
      console.log("END COMPONENT DID MOUNT")

  }

  flyToCurrentLocation = () => {
    this.map.flyTo({
        center: [this.state.lng, this.state.lat],
        zoom: 14
    });
  }

// ref={el => this.mapContainer = el}
  render() {
    const { lng, lat} = this.state;

    return (
      <div>
        {/*
        <div className="whiteLetter">"this.props.lon: "{this.props.lon}, "this.props.lat: "{this.props.lat}</div>
        <h4>MAP CENTER:</h4>
        <div className="whiteLetter">lngMapCenter:  {this.state.lngMapCenter}, latMapCenter: {this.state.latMapCenter}, zoom: {this.state.zoom}</div>
        */}
        {this.state.running===true ?
          <div><button className="btn btn-success fly" onClick={this.flyToCurrentLocation}>FLY</button></div>
          : null
        }
        <div className="inline-block relative w100 mt12 bg-darken75 color-white z1 py6 px12 round-half txt-s txt-bold">
        {/*}<div className="inline-block relative top center mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">*/}
          <div>{`LOCATION Longitude: ${this.state.lng} Latitude: ${this.state.lat}`}</div>
        </div>
        {/*}<div id="map" className="absolute top right left bottom" />*/}
        <div id="map" className="relative" />
      </div>
    );
  }
}

export default MapBox;
