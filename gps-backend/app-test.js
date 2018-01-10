var mqtt = require('mqtt');

var link = "mqtt://m14.cloudmqtt.com"

// var client = mqtt.createClient();

var client = mqtt.connect(link);

// client.subscribe("");
//
// client.on("message", function(topic, payload) {
//   alert([topic, payload].join(": "));
//   client.end();
// })
//
// client.publish("/", "hello worlds");


client.on('connect', () => {
  // Inform controllers that garage is connected
  client.publish('garage/connected', 'true')
})

console.log("haha")
// const user="rhckipmh";
// const password="WJ4VoAoyVU7Y";
//
// if (client.connect(id,user,passw)) {
// //if (client.connect(clientId.c_str())) {
// Serial.println("connected");
// // Once connected, publish an announcement...
// client.publish("Gateway", "ESP8266-RFM96");
// // ... and resubscribe
// client.subscribe("inTopic");
// }
