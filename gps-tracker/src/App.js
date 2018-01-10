import React, { Component } from 'react';
import MapBox from './MapBox';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: false,
      lat: 38.9911291,
      lon: -98.5436055
    }
  }

  componentDidMount = () => {

    const url="http://localhost:3001/api";

    fetch(url)
      .then(data =>data.json())
      .then(data => {
        console.log(data)
        this.setState({lat: data.lat, lon: data.lon})
        setTimeout(this.componentDidMount, 3000)
      })
  }


  stopTrackingHandle = () => {
    this.setState({running: false})
    // this.props.endClientClicked();
  }

  startTrackingHandle = () => {
    this.setState({running: true})
    // this.props.startClientClicked();
  }
  render() {
    return (
      <div className="container">
        <h1 className="App-Header">Location Tracker</h1>
        {this.state.running ?
          <button className="btn btn-warning btn-block" onClick={() =>this.setState({goFetch: false})}>STOP TRACKING</button>
          :
          <button className="btn btn-primary btn-block" onClick={() =>this.setState({goFetch: true})}>START TRACKING</button>
        }


        <div>
          <MapBox lat={this.state.lat} lon={this.state.lon}/>
        </div>

        <footer className="bottom text-center">(c) 2018 DatOneDoe.com</footer>
      </div>
    );
  }
}

export default App;
