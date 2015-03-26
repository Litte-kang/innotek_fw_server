var restify = require('restify');
var fs = require('fs');
var remoteCmd = require('./remote_cmd');
var command = require('./command');


var httpServer = restify.createServer({
	
	name:"innotek_web_server",
	version:"0.0.1"
});

httpServer.use(restify.acceptParser(httpServer.acceptable));
httpServer.use(restify.authorizationParser());
httpServer.use(restify.dateParser());
httpServer.use(restify.queryParser());
httpServer.use(restify.jsonp());
httpServer.use(restify.gzipResponse());
httpServer.use(restify.bodyParser());

httpServer.get('/', function(req, res, next){

	fs.readFile("./web/index.html", function(err, data){
	
		if (err)
		{
			console.error(err);			
			return;
		}
		
		res.setHeader('Content-Type', 'text/html');
		res.writeHead(200);
		res.write(data);
		res.end();
		next();
	});
});

httpServer.post({path:'/fw'}, function(req, res, next){

	var fwInfo;
	
	console.log(req.body);
	
	fwInfo = JSON.parse(req.body);
	
	var cmdInfo = remoteCmd.makeFwUpdateCmd(fwInfo.midAddress, fwInfo.address, fwInfo.fwSize, fwInfo.fwVersion, fwInfo.fwType);
	
	command.addCommand({midAddress:fwInfo.midAddress, address:fwInfo.address}, {midAddress:fwInfo.midAddress, address:fwInfo.address, infoType:4, command:cmdInfo});
		
	command.Event.once('save_suc', function(){
	
		console.log('command saved success');
		res.send(200);
		next();
		
		command.Event.removeAllListeners();
	});
	
	command.Event.once('save_failed', function(err){
	
		console.log('command saved failed');
		res.send(500);
		next(err);	
		
		command.Event.removeAllListeners();	
	});
});

httpServer.listen(4040, function(){
	
	console.log(httpServer.name + " " + httpServer.url);
});







