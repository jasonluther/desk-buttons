var port = "/dev/tty.usbmodemfd14431";
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var p = new SerialPort(port, { 
  baudrate: 9600,
  parser: serialport.parsers.readline("\n"),
});

p.on('open', function() {
  p.on('data', handle_serial_data);
  p.write('!PING');
});

function handle_serial_data(d) {
  d = d.trim();
  var type = d.charAt(0);
  switch(type) {
    case '-': 
      console.log("Info: " + d.substring(1));
      break;
    case '*': 
      console.log("Bam!");
      break;
    case '%': 
      var action = d.substring(1).split(':');
      var button_name = action[0].trim();
      var button_value = action[1].trim();
      if (button_value == 0) {
        console.log(button_name + ' was pressed');
        handle_button_press(button_name);
      }
      break;
    default: 
      console.log("Unknown data format: " + d);
  }
}

var mqtt = require('mqtt');
var mqtt_client = mqtt.connect('mqtt://imac.local');

function handle_button_press(button_name) {
  if (button_name == 'Big Red Button') {
    mqtt_client.publish('house/office/pandora', 'toggle');
  }
}
