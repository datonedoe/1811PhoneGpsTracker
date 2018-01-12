import React, {Component} from 'react'
import mapboxgl from 'mapbox-gl'
import {MAPBOX_TOKEN} from './secret';
import './MapBox.css'
mapboxgl.accessToken = MAPBOX_TOKEN;

class MapBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: this.props.lon,
      lat: this.props.lat,
      zoom: 16
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps");
    console.log("nextProps:", nextProps);
    if (nextProps.lat !== this.state.lat || nextProps.lon !== this.state.lng) {
      console.log("WILL UPDATE LOCATION")
      this.setState ({
        lng: nextProps.lon,
        lat: nextProps.lat,
      })
    }
  }

  componentDidMount() {
    console.log("COMPONENT DID MOUNT");
    const { lng, lat, zoom } = this.state;
    // const lng = this.props.lon;
    // const lat = this.props.lat;
    // const zoom = this.state.zoom;
    console.log("lng:", lng, ", lat:", lat, ", zoom:", zoom);
    var blue = '#33C9EB';

    const map = new mapboxgl.Map({
      container: "map",
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [lng, lat],
      zoom
    });

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

/////////
      map.on('load', function() {
          map.addLayer({
              'id': 'lines',
              'type': 'line',
              'source': {
                  'type': 'geojson',
                  'data': {
                      'type': 'FeatureCollection',
                      'features': [
                        {
                          'type': 'Feature',
                          'properties': {
                              'color': blue
                          },
                          'geometry': {
                              'type': 'LineString',
                              'coordinates': [
                                  [-122.48393028974533, 37.829471820141016],
                                  [-122.48395174741744, 37.82940826466351],
                                  [-122.48395174741744, 37.829412501697064],
                                  [-122.48423874378203, 37.829357420242125],
                                  [-122.48422533273697, 37.829361657278575],
                                  [-122.48474299907684, 37.829331998018276],
                                  [-122.4849334359169, 37.829298101706186],
                                  [-122.48492807149889, 37.82930022022615],
                                  [-122.48509705066681, 37.82920488676767],
                                  [-122.48509168624878, 37.82920912381288],
                                  [-122.48520433902739, 37.82905870855876],
                                  [-122.48519897460936, 37.82905870855876],
                                  [-122.4854403734207, 37.828594749716714],
                                  [-122.48543500900269, 37.82860534241688],
                                  [-122.48571664094925, 37.82808206121068],
                                  [-122.48570591211319, 37.82809689109353],
                                  [-122.4858346581459, 37.82797189627337],
                                  [-122.48582661151886, 37.82797825194729],
                                  [-122.4859634041786, 37.82788503534145],
                                  [-122.48595803976059, 37.82788927246246],
                                  [-122.48605459928514, 37.82786596829394]
                              ]
                          }
                      }
                      ///more {} here
                    ]
                  }
              },
              // The identity function does not take a 'stops' property.
              // Instead, the property value (in this case, 'color') on the source will be the direct output.
              'paint': {
                  'line-width': 5,
                  'line-color': {
                      'type': 'identity',
                      'property': 'color'
                  }
              }
          });
      });
      //////


      var geojson = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [this.state.lng, this.state.lat]
          },
          properties: {
            title: 'Mapbox',
            description: 'San Francisco, California'
          }
        }]
      };

      // add markers to map
      geojson.features.forEach(function(marker) {

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
      });


      map.addControl(new mapboxgl.NavigationControl());

  }
// ref={el => this.mapContainer = el}
  render() {
    const { lng, lat} = this.state;

    return (
      <div>
        <div className="whiteLetter">"this.props.lon: "{this.props.lon}, "this.props.lat: "{this.props.lat}</div>
        <div className="inline-block relative w100 mt12 bg-darken75 color-white z1 py6 px12 round-half txt-s txt-bold">
        {/*}<div className="inline-block relative top center mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">*/}
          <div>{`Longitude: ${this.state.lng} Latitude: ${this.state.lat}`}</div>
        </div>
        {/*}<div id="map" className="absolute top right left bottom" />*/}
        <div id="map" className="relative" />
      </div>
    );
  }
}

export default MapBox;
