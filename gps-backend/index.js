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
var data;
var obj = {
  _type: "location",
  device: "mock_server",
  tid: "se",
  lon: -122.2174881,
  lat: 37.484511
}
app.get('/', function(req, res){
  res.send("HI THERE FROM EXPRESS!");
})

var serverStringJson={};
var phoneStringJson={}

app.get('/server/api', function(req, res){
  res.send(serverStringJson);
})

app.get('/phone/api', function(req, res){
  res.send(phoneStringJson);
})


client.on('connect', function () {
  client.subscribe('owntracks/rhckipmh/phone')
  client.subscribe('server/mock')
  // client.subscribe('presence')
  // client.publish('presence', "messageeeeeeeeeeee")

  setInterval(

    () => {
      console.log("insetinterval")
      if (obj){
        // var latRan=(Math.random()-0.5)/100000
        // var lonRan=(Math.random()-0.5)/100000
        console.log("insetinterval deep")
        var latRan=0.000008
        var lonRan=0
        obj={...obj, lat: obj.lat+(Math.random()>0.8?0:latRan), lon: obj.lon+(Math.random()>0.8?0:lonRan)}
        client.publish('server/mock', JSON.stringify(obj))
      }
    }
    ,100
  )

})
  // client.end()

client.on('error', function() {
  console.log("somethine went wrong");
})
client.on('message', function (topic, message) {
  // message is Buffer
  console.log("WHAT message", message.toString())
  // var message = message.toString().
  try {
    data = JSON.parse(message.toString())
    console.log("HERE")


    if(data.tid==="se") {
      obj = {
        _type: "location",
        tid: "se",
        lat: data.lat,
        lon: data.lon
      }
      console.log("YES")
      // serverStringJson=message.toString()
      serverStringJson=JSON.stringify(obj);
    } else if (data.tid==="ph") {
      phoneStringJson= message.toString();
    }



  } catch (e) {
    console.log("not json String")
    pass
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
