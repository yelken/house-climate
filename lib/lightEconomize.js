var events = require('events'),
    util   = require('util');

/*
 * LightEconomize
 */
var LightEconomize = function (options) {
  if (!options || !options.arduino) {
    throw new Error('Must supply required options to Button');
  }

  this.arduino    = options.arduino;
  this.pin        = options.pin || 3;
  this.energy     = 0;
  this.luminosity = 0;
  this.down       = false;
  this.value      = false;
  var self        = this;

  this.arduino.pinMode(this.pin, 'out');

  // function of arduino
  this.map = function(x, in_min, in_max, out_min,out_max) {
     var retorno = (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;;
    return retorno;
  };

  this.getEnergyToLight = function(luminosidade) {
    var x = 0;

  if (luminosidade >= 100 && luminosidade >= 700) {
      x = this.map(luminosidade,luminosidade,100,0,255);
    } else if (luminosidade >= 100 && luminosidade < 700) {
      x = this.map(luminosidade,700,100,0,255);
    } 
    else if (luminosidade > 100) {
      x = this.map(luminosidade,700,luminosidade,0,255);    
    }

    return x;
  };

  setInterval(function () {
    this.arduino.aWrite(self.pin, self.energy);
  }.bind(this), 300);
}

util.inherits(LightEconomize, events.EventEmitter);

module.exports = LightEconomize;

