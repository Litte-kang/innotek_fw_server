var restify 	= require('restify');
var fs 			= require('fs');
var DevType 	= require('./node_modules/db/schemas/dev_type');
var DevInfo 	= require('./node_modules/db/schemas/dev_info');
var RemoteCmd 	= require('./node_modules/remote_cmd/remote_cmd');
var Command 	= require('./node_modules/db/schemas/command');
var FwInfo 		= require('./node_modules/db/schemas/fw_info');

var httpServer = restify.createServer({
	
	name:"innotek_fw_server",
	version:"0.0.1"
});

httpServer.use(function(req, res, next){

	console.log(req.method + " " + "http://" + req.headers.host + req.url);
	next();
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

httpServer.get('/imgs/favicon.ico', function(req, res, next){

	fs.readFile("./public/imgs/favicon.ico", function(err, data){
	
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

httpServer.get('/top.html', function(req, res, next){

		fs.readFile("./web/top.html", function(err, data){
	
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

httpServer.get('/device.html', function(req, res, next){

		fs.readFile("./web/device.html", function(err, data){
	
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

httpServer.get('/fw.html', function(req, res, next){

		fs.readFile("./web/fw.html", function(err, data){
	
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

httpServer.get('/js/my_http.js', function(req, res, next){

		fs.readFile("./public/js/my_http.js", function(err, data){
	
		if (err)
		{
			console.error(err);			
		}
		
		res.setHeader('Content-Type', 'text/js');
		res.writeHead(200);
		res.write(data);
		res.end();
		next();
	});
});

httpServer.get('/db/device_types', function(req, res, next){

	DevType.getDevTypes(res);

});

httpServer.get('/db/device_infos/:index', function(req, res, next){

	DevInfo.getDevInfos(req.params.index, req.params.slaveDevType, res);

});

httpServer.get('/db/fw_infos/:fwType', function(req, res, next){

	console.log(req.params.fwType);

	FwInfo.getFwInfos(req.params.fwType, res);

});

httpServer.post('/db/device_types', function(req, res, next){

	DevType.setDevType(req.body, res);
});

httpServer.post('/db/device_infos', function(req, res, next){

	DevInfo.setDevInfo(req.body, res);
});

httpServer.post('/db/update_fw_cmd', function(req, res, next){

	var cmd;
	var json = JSON.parse(req.body);

	console.log(json);	

	if ("null" === json.hostId) //-- update host device --//
	{
		var midAddress = "";

		for(var i = 0; i < (json.slaveId.length - 1); ++i)
		{
			
			midAddress = json.slaveId[i];

			cmd = RemoteCmd.makeFwUpdateCmd(midAddress, [65535], 6888, json.version, json.fwType);

			console.log(cmd);

			//--- add command queue ---//
			Command.addCommand({midAddress:midAddress, address:midAddress}, 
				{midAddress:midAddress, address:midAddress, infoType:4, command:cmd}, res, 0);
		}

		midAddress = json.slaveId[i];

		Command.addCommand({midAddress:midAddress, address:midAddress}, 
			{midAddress:midAddress, address:midAddress, infoType:4, command:cmd}, res, 1);
	}
	else	//-- update slave device --//
	{
		cmd = RemoteCmd.makeFwUpdateCmd(json.hostId, json.slaveId, 6888, json.version, json.fwType);

		console.log(cmd);

		//--- add command queue ---//
		Command.addCommand({midAddress:json.hostId, address:json.hostId}, 
			{midAddress:json.hostId, address:json.hostId, infoType:4, command:cmd}, res, 1);	
	}


});

httpServer.post("/db/fw_info", function(req, res, next){
	
	FwInfo.insertFwInfo(req.body, res);
});

httpServer.post("/fw/:fwName", function(req, res, next){
	
	console.log(req.params);

	fs.writeFile((req.params.savePath + req.params.fwName), req.body, function(err){

		if (err)
		{
			res.writeHead(404);
		}
		else
		{
			res.writeHead(200);
		}
		
		res.end()
	});
	
});

httpServer.listen(4040, function(){
	
	console.log(httpServer.name + " " + httpServer.url);
});







