//var Packet = require("./libraries/packet");
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var sp = new SerialPort("COM5", {
    baudrate: 9600,
    parser: serialport.parsers.readline("#")
});

sp.on("open", function () {
    console.log('\nConnection open...\n');
    sp.on('data', function(responsePacket) {
        console.log(responsePacket);
        
        // var myPacket = {},
        //     datetime = "",
        //     message = "";

        // myPacket= Packet.parse(responsePacket);
        // console.log(myPacket);

        // datetime = new Date(myPacket.datetime);        
        // datetime = datetime.getDate() + "/" + datetime.getMonth() + "/" + datetime.getFullYear() + " " + datetime.getHours() + ":" + datetime.getMinutes();

        // message = "Nueva Medicion [" + datetime + "] - equipo: " + myPacket.d + " " + myPacket.c + "°C" + " " + myPacket.f + "°F ";
        // console.log(message);
    });
});