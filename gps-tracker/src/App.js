import React, { Component } from 'react';
import MapBox from './MapBox';
import "./App.css";
import {FormControl,FormGroup, ControlLabel, Button, Form} from 'react-bootstrap'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: false,
      lat: 38.9911291,
      lon: -98.5436055,
      device: "placeholder"
    }
  }

  componentDidMount = () => {
    console.log("APP.JS componentDidMount")
    const url=`http://localhost:3001/${this.state.device}/api`;
    console.log("URL", url);

    if(this.state.goFetch===true) {
      console.log("FETCHING...")
      fetch(url)
      .then(data =>{
        // console.log(data)
        if (data) {
          return data.json()
        } else {
          throw new Error("DARWIN Server Error")
        }
      }
      )
      .then(data => {
        console.log(data)
        this.setState({
                error: false,
                lat: data.lat,
                lon: data.lon,
                running: true
              })
        setTimeout(this.componentDidMount, 100)
      })
      .catch(err=>{
        console.log("ERROR HERE", err);
        this.setState({error: true, message: "Server Error. Try again"})
      })
    } else {
      console.log("NOT GO FETCH")
    }
  }


  stopTrackingHandle = () => {
    // if (this.state.running) {
      // this.setState({goFetch: false, runnging: false})
    // } else {
      this.setState({goFetch: false, running: false, message: null}, this.componentDidMount)
    // }

    // this.props.endClientClicked();
  }

  startTrackingHandle = () => {
    if (this.state.device ==="placeholder") {
      this.setState({message: "Please select a device"})
    } else {
      this.setState({message: null, goFetch: true, error: false}, this.componentDidMount)
    }

    // this.props.startClientClicked();
  }
  render() {
    return (
      <div className="container">
        <h1 className="App-Header">Location Tracker</h1>



      {/*}  <div className="container">
          {this.state.goFetch ?

            (this.state.error?
              <button className="btn btn-danger btn-block" onClick={() =>this.stopTrackingHandle()}>TRY AGAIN</button>
              :
              <button className="btn btn-warning btn-block" onClick={() =>this.stopTrackingHandle()}>STOP TRACKING</button>)
                :
                <button className="btn btn-success btn-block" onClick={() =>this.startTrackingHandle()}>START TRACKING</button>
              }
        </div>*/}




        // <Form inline>

          <div className="row select-server">
            <div className="col-xs-7 col-sm-7 col-md-7">
              <FormControl
                componentClass="select"
                className="form device-dropdown"
                onChange={(event)=>this.setState({device: event.target.value, message: null}, ()=>console.log("this.state.device",this.state.device))}>
                <option value="placeholder">Select a device</option>
                <option value="server">Mock server</option>
                <option value="phone">Owntracks</option>
              </FormControl>
            </div>
            <div className="col-xs-5">
              {this.state.goFetch ?

                (this.state.error?
                  <Button className="btn btn-danger btn-block" onClick={() =>this.stopTrackingHandle()}>TRY AGAIN</Button>
                  :
                  <Button className="btn btn-warning btn-block" onClick={() =>this.stopTrackingHandle()}>STOP TRACKING</Button>)
                    :
                    <Button className="btn btn-success btn-block" onClick={() =>this.startTrackingHandle()}>START TRACKING</Button>
                  }
            </div>
          </div>
      	// </Form>


        {this.state.message ?
          <div className="alert alert-danger" role="alert">
            {
              this.state.message
            }
          </div>
          : null
        }
        
        {/*}<div className="alert alert-info" role="alert">
          <div>Message: {this.state.device? this.state.device : null}</div>
        </div>*/}

        <div>
          <MapBox lat={this.state.lat} lon={this.state.lon} running={this.state.running}/>
        </div>

        <footer className="bottom text-center">(c) 2018 DatOneDoe.com</footer>
      </div>
    );
  }
}

export default App;
