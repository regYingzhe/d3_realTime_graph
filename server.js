var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mqtt = require("mqtt");

var mqttClient = mqtt.connect({host: "localhost", port: 1883});

app.get("/intensity", function(req, res) {
    res.sendFile(__dirname + '/realTime1.html');
})

app.get("/speed", function(req, res) {
    res.sendFile(__dirname + "/speedGraph.html");
})

app.get("/duration", function(req, res) {
    res.sendFile(__dirname + "/duration.html")
})
mqttClient.on("connect", function() {
    console.log("Connect to MQTT Server");
    mqttClient.subscribe("fishbowl/rpi1/intensity");
    mqttClient.subscribe("fishbowl/rpi2/intensity");
    mqttClient.subscribe("fishbowl/regi/movementstatus");
})

// Manage connections
io.on('connection', function(socket) {

    console.log('handle connection');
    mqttClient.on("message", function(topic, message) {
        var data1;
        var data2;
        // if (topic == "fishbowl/rpi1/intensity") {
        //     console.log("Inside rpi1 topic");
        //     try {
        //         data1 = JSON.parse(message);
        //         var value1 = data1.intensity;
        //         var date1 = new Date();
        //         newData1 = { value: value1, date: date1  };
        //         socket.emit("serverRequest1", newData1);
        //     } catch (e) {
        //         console.log(e);
        //     }
        // } else if ( topic == "fishbowl/rpi2/intensity") {
        //     console.log("Inside rpi2 topic");
        //     try {
        //         data2 = JSON.parse(message);
        //         var value2 = data2.intensity;
        //         var date2 = new Date();
        //         newData2 = { value: value2, date: date2 };
        //         socket.emit("serverRequest2", newData2);
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }
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
        } else if (topic == "fishbowl/regi/movementstatus") {
            console.log("Inside movement status");
            try {
                statusData = JSON.parse(message);
                var speedValue = statusData.speed;
                var durationValue = statusData.duration;
                var timeStamp = new Date();
                var speedData = { value: speedValue, date: timeStamp };
                var durationData = { value: durationValue, date: timeStamp };
                socket.emit("speedRequest", speedData);
                socket.emit("durationRequest", durationData);
            } catch (e) {
                console.log(e);
            }
        }
    })

    // var periodInMilliseconds = 1000;
    // var timeoutId1 = -1;
    
    // /**
    //  * Handle "disconnect" events.
    //  */
    // var handleDisconnect = function() {
    //     console.log('handle disconnect');
    //     clearTimeout(timeoutId1);
    //     clearTimeout(timeoutId2);
    // };
    
    // /**
    //  * Generate a request to be sent to the client.
    //  */
    // var generateServerRequest1 = function() {
    //     console.log('generate server request');
    
    //     socket.emit('serverRequest1', {
    //         date: new Date(),
    //         value: Math.pow(Math.random(), 2)
    //     });
    
    //     timeoutId1 = setTimeout(generateServerRequest1, periodInMilliseconds);
    // };
    
    // var generateServerRequest2 = function() {
    //     console.log('generate server request');
    
    //     socket.emit('serverRequest2', {
    //         date: new Date(),
    //         value: Math.pow(Math.random(), 2)
    //     });
    
    //     timeoutId2 = setTimeout(generateServerRequest2, periodInMilliseconds);
    // };
    
    // socket.on('disconnect', handleDisconnect);
    
    // timeoutId1 = setTimeout(generateServerRequest1, periodInMilliseconds);
    // timeoutId2 = setTimeout(generateServerRequest2, periodInMilliseconds);

});

server.listen(9000, function(err) {
    console.log("Server started at port 9000");
});
