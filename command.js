var mongoose = require('./config');
var events = require('events');
var event = events.EventEmitter();

var Schema = mongoose.Schema;

var schema = new Schema({

	infoType: 		{type: Number, default: 12},
	address:   		String,
	midAddress:     String,
	command: 	    Schema.Types.Mixed,
	createdAt:  	{type: Date, default: Date.now}
});

var commands = mongoose.model('commands', schema, 'commands');

module.exports.addCommand = function(options, doc){

 	commands.findOneAndUpdate(options, doc, {upsert: true}, function(err, data){
						   
    		if(err){
    			
    			event.emit('save_failed', err);
    		}else{
    		
    			event.emit('save_suc');
    		}
 	});	
};

module.exports.Event = event;
