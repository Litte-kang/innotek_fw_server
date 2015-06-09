var restify = require('restify');
var fs = require('fs');
var DevType = require('./node_modules/my_schemas/dev_type');
var DevInfo = require('./node_modules/my_schemas/dev_info');
var RemoteCmd = require('./node_modules/remote_cmd/remote_cmd');
//var command = require('./command');

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

httpServer.use(function(req, res, next){

	console.log(req.method + " " + "http://" + req.headers.host + req.url);
	next();
});

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
			return;
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

	console.log(req.params);
	DevInfo.getDevInfos(req.params.index, req.params.slaveDevType, res);

});

httpServer.post('/db/update_fw_cmd', function(req, res, next){

	var cmd;
	var json = JSON.parse(req.body);

	console.log(req.body);

	if ("null" === json.hostId) //-- update host device --//
	{
		for(var i = 0; i < json.slaveId.length; ++i)
		{
			var midAddress = "";

			midAddress = json.slaveId[i];

			cmd = RemoteCmd.makeFwUpdateCmd(midAddress, [65535], 6888, json.version, json.fwType);

			console.log(cmd);
			//--- add command queue ---//
		}
	}
	else	//-- update slave device --//
	{
		cmd = RemoteCmd.makeFwUpdateCmd(json.hostId, json.slaveId, 6888, json.version, json.fwType);

		console.log(cmd);
		//--- add command queue ---//
	}

	res.writeHead(202);
	res.write("ok");
	res.end()

});

httpServer.post("/db/fw_info", function(req, res, next){
	
	console.log(req.body);

	res.writeHead(202);
	res.write("ok");
	res.end()
});

httpServer.post("/fw/:fwName", function(req, res, next){
	
	console.log(req.params.fwName);

	fs.writeFile(("./public/fw/" + req.params.fwName), req.body, function(err){

		res.writeHead(202);
		res.end()
	});
	
});


//---------------------------------------------------------------------------------------//
httpServer.get('/test_curve_cmd', function(req, res, next){

		fs.readFile("./public/html/curve_cmd.html", function(err, data){
	
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

httpServer.post('/curve_cmd', function(req, res, next){

	console.log(req.body);
	var json = JSON.parse(req.body);
	var cmd;

	cmd = ReomteCmd.makeConfigCurveCmd(json.midid, json.slaveid, json.data[0],json.data[1],json.data[2]);
	console.log(cmd);
/*
	        command.addCommand({midAddress:fwInfo.midAddress, address:fwInfo.address}, {midAddress:fwInfo.midAddress, address:fwInfo.address, infoType:4, command:cmdInfo});

	        command.Event.once('save_suc', function(){

	                console.log('command saved success');
	                res.send(200);
	                next();

	                command.Event.removeAllListeners();
	        });
//*/
	res.end();
	next();
});

httpServer.listen(4040, function(){
	
	console.log(httpServer.name + " " + httpServer.url);
});







