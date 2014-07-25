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
	"00": {
		description: "Sync"	
	},
	"01": {
		description: "Temperature",
		unit:"°c"
	},
	"02":{
		description: "Humidity",
		unit:"%"
	},
	"03":{
		description: "Sound",
		unit:"db"
	}
};

module.exports = {
	parse: function (packet) {
		var data = packet.split("|");

		if (data.length == 0)
			return null;

		var packetObject = {
			device: data[0],
			code: data[1],
			value: data[2],
			description: (codes[data[1]]).description,
			unit: (codes[data[1]]).unit,
			datetime: new Date().getTime()
		};

		return packetObject;
	}
};