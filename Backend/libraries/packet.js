var Packet = {
	getPropertyAndValue: function(data){
		var type = data.substring(0, 1);
		var value = data.substring(1, data.length);

		value = value.replace("\r", "");

		return {
			type: type,
			value: value
		}
	}
};		

var codes = {
	"00":"Sync",
	"01":"Temperature",
	"02":"Sound"
};

function Temperature(packetObject) {
	return packetObject["centigrades"] = (5.0 * packetObject.value * 100.0) / 1024;
}

module.exports = {
	parse: function (packet) {
		var data = packet.split("|");
		
		console.log("code",data[1]);
		var packetObject = {
			device: data[0],
			code: data[1],
			value: data[2],
			datetime: new Date().getTime()
		};

		eval(codes[packetObject.code])(packetObject);

		return packetObject;
	}
};