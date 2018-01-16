//Load required packages
var express = require('express');
var app = express();
var axios = require("axios"); //ajax request
var request = require("request"); //ajax request
var mqtt = require('mqtt')
var helper = require('./vectorHelper.js');


//MQTT LOGIN INFO
const mqtt_url = "mqtt://m14.cloudmqtt.com";
const server = "mqtt://m14.cloudmqtt.com";
const username = "rhckipmh"
const password = "WJ4VoAoyVU7Y";
const port = 15394;
const PI = Math.PI;
const CLIENT_TIMER = 100000000; //time of running

// MOCK SERVER CONSTANTS
// const GOOGLE_MAP_API = "AIzaSyCvYTdT0e60-GPa-9gXgwGE2BOy-b68GBo"; //Google Snap To Road API
// const GOOGLE_MAP_API = "AIzaSyByF015mtxaEQGeL1HYxkD3vGW8t763_Qw"; //Google Snap To Road API
const GOOGLE_MAP_API = "AIzaSyBFfkN0CR2DdTtiO_YTdqKCJF9mfk_SiVA"; //Google Snap To Road API

const DEFAULT_LOOKOUT_DISTANCE = 0.000670582325045536;  //0.003970582325045536~1200ft
const DEFAULT_DIRECTION_VECTOR = {x:DEFAULT_LOOKOUT_DISTANCE*Math.sqrt(2)/1200, y:DEFAULT_LOOKOUT_DISTANCE*Math.sqrt(2)/1200,}
const DEFAULT_LOOKOUT_AMPLITUDE = 0.5*DEFAULT_LOOKOUT_DISTANCE;
var INITIAL_COORDINATE = {lon: -122.023011, lat: 37.410281} //initial coord for mock server

//BACKEND CONSTANTS
const BACKEND_PORT = 3001;

//connect to cloudMQTT
var client  = mqtt.connect(mqtt_url, { server, username, password, port });

// JSON string to be posted to API
var serverStringJson={}; //for mock server
var phoneStringJson={}; //for owntracks/phone


//mock server variables
let currentDirUnitVector = DEFAULT_DIRECTION_VECTOR; //direction unit vector
let currentPoint = {x:INITIAL_COORDINATE.lon, y:INITIAL_COORDINATE.lat}; //current point


function getSnapToRoadAPIURL (prevUnitVector, currentPoint, nextTurningAngle) {
    currentDirUnitVector = helper.getRotatedVector(currentDirUnitVector, nextTurningAngle);
    console.log("currentDirUnitVector", currentDirUnitVector);
    var p=[{x:currentPoint.x, y:currentPoint.y}];

    for (var i=1;i<=8;i++){
        p[i]={
          x: p[0].x+currentDirUnitVector.x*i/8*DEFAULT_LOOKOUT_DISTANCE,
          y: p[0].y+currentDirUnitVector.y*i/8*DEFAULT_LOOKOUT_DISTANCE
        };
    }

    p= p.map((pair, index) => {
      if (index%2===0) {
        return pair
      } else {
        var x=pair.x;
        var y=pair.y;
        let perpenUnitVector ={};
        if (index===1 || index===5) {
          perpenUnitVector=helper.getLeftUnitVectorPerpendicularTo(currentDirUnitVector);
        } else if (index===3 || index===7){
          perpenUnitVector=helper.getRightUnitVectorPerpendicularTo(currentDirUnitVector);
        }
        var fraction = Math.random() >0.5?2:3;
        return {
          // x: pair.x + perpenUnitVector.x/4*DEFAULT_LOOKOUT_DISTANCE,
          // y: pair.y + perpenUnitVector.y/4*DEFAULT_LOOKOUT_DISTANCE
          x: pair.x + perpenUnitVector.x/fraction*DEFAULT_LOOKOUT_DISTANCE,
          y: pair.y + perpenUnitVector.y/fraction*DEFAULT_LOOKOUT_DISTANCE
        }
      }
    })

    p = p.filter((pair, index) => [0,1,3,5,7,8].indexOf(index)>-1)

    var temp_string ="";
    p.forEach((pair, index) => {
      temp_string+=`${pair.y},${pair.x}${index===p.length-1?"":"|"}`
    })
    // console.log("tempstring:", temp_string);
    var google_url =`https://roads.googleapis.com/v1/snapToRoads?path=${temp_string}&interpolate=true&key=${GOOGLE_MAP_API}`
    console.log("URL",google_url)
    return google_url;
}

function retrievePoint(url) {
  console.log("SNAP_TO_ROAD URL:", url);
  axios.get(url)
    .then((response) => {
      console.log(response.data.snappedPoints); // ex.: { user: 'Your User'}
      console.log(response.status); // ex.: 200
      printOut(response.data.snappedPoints, () =>attemptMovingForward(), () => attemptMovingBackward() );

    })
    .catch(error => {
      console.log("ERROR", error.code);
    })
}

function attemptMovingForward() {
  retrievePoint(getSnapToRoadAPIURL(currentDirUnitVector, currentPoint, 0))
}

function attemptMovingBackward() {
  retrievePoint(getSnapToRoadAPIURL(currentDirUnitVector, currentPoint, Math.PI))
}


const printOut = (coordinateList, moveForwardCallback, cantMoveCallback) => {
  console.log("[printOut]");

  //if it can't move forward, turn back and try to find a new way
  if (coordinateList.length<=2) {
    cantMoveCallback();
  } else {
    var index=0;
    var tim=setInterval( ()=> {
      var point = coordinateList[index++]
      console.log("Index:", index, "Lat:", point.location.latitude, ", Lon: ", point.location.longitude);
      var pointObj = {tid: "se", lat: point.location.latitude, lon: point.location.longitude}
      client.publish('server/mock', JSON.stringify(pointObj))
      console.log(JSON.stringify(pointObj))
      if (index===coordinateList.length){
        clearInterval(tim)
        var length = coordinateList.length;
        var lastPoint_n = {x: coordinateList[length-1].location.longitude, y: coordinateList[length-1].location.latitude}
        console.log("lastPoint_n", lastPoint_n);

        var lastPoint_nsub;
        for (var i=index-2; i>=0; i--) {
          lastPoint_nsub = {x: coordinateList[i].location.longitude, y: coordinateList[i].location.latitude}
          console.log("lastPoint_nsub", lastPoint_nsub);
          if (Math.abs(lastPoint_nsub.x-lastPoint_n.x)>0.00000001 || Math.abs(lastPoint_nsub.y-lastPoint_n.y)>0.00000001 ) {
            break
          }
          if (i==0){
            console.log("call CANT_MOVE_CALLBACK")
            cantMoveCallback()
          }
        }
        currentDirUnitVector = helper.getUnitVectorOfLineBetweenTwoPoints(lastPoint_nsub, lastPoint_n);
        console.log("currentDirUnitVector", currentDirUnitVector);
        //update front point
        currentPoint={x:coordinateList[coordinateList.length-1].location.longitude, y:coordinateList[coordinateList.length-1].location.latitude};
        moveForwardCallback()
      }
    },300)
  }
}


// When client is connected, listen to special topics
client.on('connect', function () {
  if (process.argv.length===3 && process.argv[2]==='mock') {
    client.subscribe('server/mock')
    attemptMovingForward();
  } else if (process.argv.length===3 && process.argv[2]==='phone') {
    client.subscribe('owntracks/rhckipmh/phone')
  } else {
    client.subscribe('owntracks/rhckipmh/phone')
  }
})


// GET: /, not used in this project
app.get('/', function(req, res){
  res.send("HOME PAGE");
})

// GET: /server/api
app.get('/server/api', function(req, res){
  res.send(serverStringJson);
})

// GET: /phone/api
app.get('/phone/api', function(req, res){
  res.send(phoneStringJson);
})


// CASE: client encounters error
client.on('error', function() {
  console.log("somethine went wrong");
})

// CASE: server receives message from mqtt
client.on('message', function (topic, message) {
  console.log("message", message.toString())

  try {
    let jsonData = JSON.parse(message.toString())
    if(jsonData.tid==="se") {
      let obj = {
        _type: "location",
        tid: "se",
        lat: jsonData.lat,
        lon: jsonData.lon
      }
      serverStringJson=JSON.stringify(obj);
    } else if (jsonData.tid==="ph") {
      phoneStringJson= message.toString();
    }

  } catch (e) {
    console.log("not json String")
    pass
  }


})


//Timer to close MQTT CLIENT
setTimeout(function () {
  client.end()
  console.log("CLIENT ENDED.....")
}, CLIENT_TIMER);


//LISTEN TO APP
app.listen(BACKEND_PORT, function(){
  console.log("Process is running on port: ", BACKEND_PORT);
})
