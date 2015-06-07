var mongoose = require('mongoose');
var URL = 'mongodb://localhost/innotek_device_fw';

mongoose.connect(URL);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
	console.log('Database connect success');
});

module.exports = mongoose;