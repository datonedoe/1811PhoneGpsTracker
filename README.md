## PROBLEM STATEMENT
The Problem Statement is to publish Location data from your smartphone (we will assume, your smartphone is the autonomous vehicle), receive that in a web service and visualize the location on a map within a web app.

- For the smartphone side, you can use Owntracks (https://itunes.apple.com/us/app/owntracks/id692424691?mt=8) (https://play.google.com/store/apps/details?id=org.owntracks.android) or Zanzito (https://play.google.com/store/apps/details?id=it.barbaro.zanzito)
- For communication, I would like you to use MQTT. You can setup a free cloud MQTT Broker using CloudMQTT (https://www.cloudmqtt.com/)
- For the web service, try out Spring Boot framework
- For the web app, use a Single Page App framework like React.js. For mapping, you can use Mapbox. It is a relatively simple mapping utility.

## SUGGESTED SOLUTIONS AND DEMOS
DEMO with OwnTracks
![OwnTracks](./media/owntrack-demo.png)

### EXTRA:
- Autonomous simulation added to the problem.
  - Given a GPS location of a device (ex: car), display that location on the map then make that device change its locations in such away that it mimics a vehicle moving on street
DEMO with autonomous simulation:
![Autonomous Driving Example](./media/demo.gif)
