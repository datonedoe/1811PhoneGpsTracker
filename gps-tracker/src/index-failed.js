import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


// var express = require('express');
// var app = express();
var mqtt = require('mqtt')

const mqtt_url = "mqtt://m14.cloudmqtt.com";
const server = "mqtt://m14.cloudmqtt.com";
const username = "rhckipmh"
const password = "WJ4VoAoyVU7Y";
const port = 15394;

// const mqtt_url = "mqtt://test.mosquitto.org";
var client;

this.startClient = () => {
  console.log("START CLIENT!");
  client  = mqtt.connect("mqtt://m14.cloudmqtt.com", { server, username, password, port });

  client.on('connect', function () {
    client.subscribe('presence')
    client.subscribe('owntracks/rhckipmh/phone')
    var test = client.publish('presence', 'Hello mqtt1')
    console.log(test)
    client.publish('presence', 'Hello mqtt2')
    client.publish('presence3', 'Hello mqtt3')
    client.publish('presence', 'Hello mqtt4')
  })

  client.on('error', function() {
    console.log("somethine went wrong");
  })
  client.on('message', function (topic, message) {
    // message is Buffer
    console.log("message", message.toString())
  })

  setTimeout(function () {
    client.end()
  }, 10000);
}


this.endClient = () => {
  client.end()
  console.log("CLIENT ENDED");
}


console.log("run")

ReactDOM.render(<App
                endClientClicked={this.endClient}
                startClientClicked={this.startClient}/>, document.getElementById('root'));
registerServiceWorker();
