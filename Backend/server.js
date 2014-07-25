var Packet = require("./libraries/packet");
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var sp = new SerialPort("COM5", {
    baudrate: 9600,
    parser: serialport.parsers.readline("#")
});

sp.on("open", function () {
    console.log('\nConnection open...\n');
    sp.on('data', function(responsePacket) {
        var myPacket = {},
            datetime = "",
            message = "";

        myPacket = Packet.parse(responsePacket);

        if(myPacket){
            datetime = new Date(myPacket.datetime);  

            var day = datetime.getDate() + "/" + datetime.getMonth() + "/" + datetime.getFullYear();
            var hours =  (datetime.getHours() < 10) ? '0' + datetime.getHours() : datetime.getHours(); 
            var minutes =  (datetime.getMinutes() < 10) ? '0' + datetime.getMinutes() : datetime.getMinutes(); 
            var seconds =  (datetime.getSeconds() < 10) ? '0' + datetime.getSeconds() : datetime.getSeconds(); 
            var fullDay = day + " " + hours + ":" + minutes + ":" + seconds;

            message = "Nueva Medicion [" + fullDay + "] - equipo: " + myPacket.device + ", " + myPacket.description + ": " + myPacket.value + " " + myPacket.unit;
            console.log(message);    
        }
    });
});