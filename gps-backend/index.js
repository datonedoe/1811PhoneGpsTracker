var express = require('express');
var app = express();
var mqtt = require('mqtt')

const mqtt_url = "mqtt://m14.cloudmqtt.com";
const server = "mqtt://m14.cloudmqtt.com";
const username = "rhckipmh"
const password = "WJ4VoAoyVU7Y";
const port = 15394;

// const mqtt_url = "mqtt://test.mosquitto.org";
var client  = mqtt.connect(mqtt_url, { server, username, password, port });
console.log("//////")
console.log(client)
console.log("//////")

app.get('/', function(req, res){
  res.send("HI THERE FROM EXPRESS!");
})

var stringJson={};
app.get('/api', function(req, res){
  res.send(stringJson);
})


client.on('connect', function () {
  client.subscribe('owntracks/rhckipmh/phone')
  // client.subscribe('presence')
  // client.publish('presence', 'Hello mqtt2')
})
  // client.end()

client.on('error', function() {
  console.log("somethine went wrong");
})
client.on('message', function (topic, message) {
  // message is Buffer
  console.log("message", message.toString())
  // var message = message.toString().
  var data = JSON.parse(message.toString())
  if(data._type==="location") {
    console.log("YES")
    stringJson=message.toString()
  }

})


setTimeout(function () {
  client.end()
  console.log("CLIENT ENDED.....")
}, 1000000);

const backend_port = 3001;
app.listen(backend_port, function(){
  console.log("Process is running on port: ", backend_port);
})

console.log("run")
