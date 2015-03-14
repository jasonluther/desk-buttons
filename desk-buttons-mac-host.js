var mqtt = require('mqtt');
var mqtt_client = mqtt.connect('mqtt://imac.local');

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
    case '#': 
      console.log("LED set: " + d);
      break;
    default: 
      console.log("Unknown data format: " + d);
  }
}

function handle_button_press(button_name) {
  if (button_name == 'Big Red Button') {
    mqtt_client.publish('house/office/pandora', 'toggle');
  } else if (button_name == "White Button") {
    mqtt_client.publish('house/info', 'I love you');
  } else if (button_name == "Yellow Button") {
    mqtt_client.publish('house/info', 'You are a little bit stinky');
  }
}

mqtt_client.subscribe('house/office/desk/led/#');
mqtt_client.on('message', function (topic, message) {
  var which_led = topic.split('/').pop();
  var led_value = message.toString().trim();
  console.log(which_led + ' = ' + led_value);
  if (which_led == 'big-red-button') {
    p.write('@L=' + led_value);
  } else if (which_led == 'rgb') {
    var re = /#?(..)(..)(..)/;
    var m = re.exec(led_value);
    console.log(m);
    var r = parseInt(m[1], 16);
    var g = parseInt(m[2], 16);
    var b = parseInt(m[3], 16);
    p.write('@R=' + r);
    p.write('@G=' + g);
    p.write('@B=' + b);
  }
});

