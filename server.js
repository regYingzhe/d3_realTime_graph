var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mqtt = require("mqtt");

var host = "104.197.173.194";
var port = "1883";
var username = "toggmqtt";
var password = "togg4ever";

var mqttClient = mqtt.connect({host: host, port: port, username: username, password: password});

app.get("/intensity", function(req, res) {
    res.sendFile(__dirname + '/realTime1.html');
})

app.get("/speed", function(req, res) {
    res.sendFile(__dirname + "/speedGraph.html");
})

mqttClient.on("connect", function() {
    console.log("Connect to MQTT Server");
    // mqttClient.subscribe("fishbowl/rpi1/intensity");
    mqttClient.subscribe("fishbowl/rpi2/intensity");
    mqttClient.subscribe("fishbowl/regi/movementstatus");
})

// Manage connections
io.on('connection', function(socket) {

    console.log('handle connection');
    mqttClient.on("message", function(topic, message) {
        var data2;
        if (topic == "fishbowl/rpi2/intensity") {
            console.log("Inside rpi2 topic");
            try {
                data2 = JSON.parse(message);
                var value2 = data2.intensity;
                var date2 = new Date();
                var newData2 = { value: value2, date: date2  };
                socket.emit("serverRequest1", newData2);
            } catch (e) {
                console.log(e);
            }
        }
        // } else if (topic == "fishbowl/regi/movementstatus")  {
        //     console.log("Inside movement status");
        //     try {
        //         statusData = JSON.parse(message);
        //         var speedValue = statusData.speed;
        //         var durationValue = statusData.duration;
        //         var timeStamp = new Date();
        //         var speedData = { value: speedValue, date: timeStamp };
        //         var durationData = { value: durationValue, date: timeStamp };
        //         socket.emit("speedRequest", speedData);
        //         socket.emit("durationRequest", durationData);
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }
        //Hello world
    })
});

server.listen(9000, function(err) {
    console.log("Server started at port 9000/intensity");
});
