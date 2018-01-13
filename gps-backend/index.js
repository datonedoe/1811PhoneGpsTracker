var express = require('express');
var app = express();
var mqtt = require('mqtt')

const mqtt_url = "mqtt://m14.cloudmqtt.com";
const server = "mqtt://m14.cloudmqtt.com";
const username = "rhckipmh"
const password = "WJ4VoAoyVU7Y";
const port = 15394;
const PI = Math.PI;
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

  let eighth=Math.floor(Math.random()*8)+1;
  let angleInEighthPI=Math.random()*1/8*Math.PI;
  let angle=(eighth-1)*PI/8+angleInEighthPI;
  let movement_speed=0.00001;
  setInterval(

    () => {
      if (obj){
        // var latRan=(Math.random()-0.5)/100000
        // var lonRan=(Math.random()-0.5)/100000
        if (!angle) {
          console.log("NULL ANGLE")
        }
        // eighth=Math.random()>0.96?(((Math.floor(Math.random()*5)+1)+(eighth+5)))%8:eighth;
        // eighth=(eighth===0)?8:eighth;
        eighth=Math.random()>0.98?(Math.random()>0.5?eighth+1:eighth-1):eighth;
        if (eighth>8) {eighth=1}
        else if (eighth<1) {eighth=8}

        angleInEighthPI=Math.random()>0.6?Math.random()*1/8*2*PI:angleInEighthPI;
        angle=(eighth-1)*2*PI/8+angleInEighthPI;
        // eighth = (((Math.floor(Math.random()*5)+1)+(eighth+5)))%8;
        // if
        console.log("ANGLE", angle);
        obj={...obj, lat: obj.lat+Math.sin(angle)*movement_speed, lon: obj.lon+Math.cos(angle)*movement_speed}
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
  // console.log("WHAT message", message.toString())
  // var message = message.toString().
  try {
    data = JSON.parse(message.toString())


    if(data.tid==="se") {
      obj = {
        _type: "location",
        tid: "se",
        lat: data.lat,
        lon: data.lon
      }
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
