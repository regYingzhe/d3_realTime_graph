var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mqtt = require("mqtt");

var mqttClient = mqtt.connect({host: "localhost", port: 1883});

app.get("/speed", function(req, res) {
    res.sendFile(__dirname + "/speedGraph.html");
})

// app.get("/duration", function(req, res) {
//     res.sendFile(__dirname + "/duration.html")
// })

mqttClient.on("connect", function() {
    console.log("Connect to MQTT Server");
    mqttClient.subscribe("fishbowl/regi/movementstatus");
})

// Manage connections
io.on('connection', function(socket) {
    console.log('handle connection');
    mqttClient.on("message", function(topic, message) {
        if (topic == "fishbowl/regi/movementstatus") {
            console.log("Inside movement status");
            try {
                statusData = JSON.parse(message);
                var speedValue = statusData.speed;
                var timeStamp = new Date();
                var speedData = { value: speedValue, date: timeStamp };
                
                socket.emit("speedRequest", speedData);
                // socket.emit("durationRequest", durationData);
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

server.listen(9100, function(err) {
    console.log("Server started at port 9100");
});
