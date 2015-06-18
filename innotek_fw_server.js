var restify 	= require('restify');
var fs 			= require('fs');
//var Buffer		= require('buffer');
var DevType 	= require('./node_modules/db/schemas/dev_type');
var DevInfo 	= require('./node_modules/db/schemas/dev_info');
var RemoteCmd 	= require('./node_modules/remote_cmd/remote_cmd');
var Command 	= require('./node_modules/db/schemas/command');
var FwInfo 		= require('./node_modules/db/schemas/fw_info');
var WebFile 	= require('./node_modules/web_file/web_file');

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

	WebFile.sendWebFile("./web/index.html", res, next);
});

httpServer.get('/imgs/favicon.ico', function(req, res, next){

	WebFile.sendWebFile("./public/imgs/favicon.ico", res, next);
});

httpServer.get('/imgs/back.gif', function(req, res, next){

	WebFile.sendWebFile("./public/imgs/back.gif", res, next);
});

httpServer.get('/imgs/index_01.gif', function(req, res, next){

	WebFile.sendWebFile("./public/imgs/index_01.gif", res, next);
});

httpServer.get('/imgs/index_02.gif', function(req, res, next){

	WebFile.sendWebFile("./public/imgs/index_02.gif", res, next);
});

httpServer.get('/imgs/index_03.gif', function(req, res, next){

	WebFile.sendWebFile("./public/imgs/index_03.gif", res, next);
});

httpServer.get('/imgs/index_05.gif', function(req, res, next){

	WebFile.sendWebFile("./public/imgs/index_05.gif", res, next);
});

httpServer.get('/imgs/index_06.gif', function(req, res, next){

	WebFile.sendWebFile("./public/imgs/index_06.gif", res, next);
});

httpServer.get('/imgs/index_07.gif', function(req, res, next){

	WebFile.sendWebFile("./public/imgs/index_07.gif", res, next);
});

httpServer.get('/imgs/spacer.gif', function(req, res, next){

	WebFile.sendWebFile("./public/imgs/spacer.gif", res, next);
});

httpServer.get('/top.html', function(req, res, next){

	WebFile.sendWebFile("./web/top.html", res, next);
});

httpServer.get('/device.html', function(req, res, next){

	WebFile.sendWebFile("./web/device.html",res, next);
});

httpServer.get('/upload.html', function(req, res, next){

	WebFile.sendWebFile("./web/upload.html", res, next);
});

httpServer.get('/search.html', function(req, res, next){

	WebFile.sendWebFile("./web/search.html", res, next);
});

httpServer.get('/js/my_http.js', function(req, res, next){

	WebFile.sendWebFile("./public/js/my_http.js", res, next);
	
});

httpServer.get('/db/device_types/:type', function(req, res, next){

	DevType.getDevTypes(req.params, res);

});

httpServer.get('/db/device_infos/:index', function(req, res, next){

	DevInfo.getDevInfos(req.params, res);

});

httpServer.get('/db/fw_infos/:fwType', function(req, res, next){

	FwInfo.getFwInfos(req.params, res);

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
	var ver;

	console.log(json);	

	FwInfo.FwInfo.findOne({fwType:json.fwType,  version:json.version}, function(err, data){

		if (err)
		{
			res.writeHead(404);
			res.write("失败");
			res.end()
		}
		else
		{
			console.log(data);
			if ("null" === json.hostId) //-- update host device --//
			{
				var midAddress = "";
				var i = 0;

				for(i = 0; i < (json.slaveId.length - 1); ++i)
				{
					
					midAddress = json.slaveId[i];

					cmd = RemoteCmd.makeFwUpdateCmd(midAddress, [65535], data.fwSize, json.version, json.fwType);
					console.log(cmd);

					//--- add command queue ---//
					Command.addCommand({midAddress:midAddress, address:midAddress}, 
						{midAddress:midAddress, address:midAddress, infoType:4, command:cmd}, res, 0);
				}

				midAddress = json.slaveId[i];

				cmd = RemoteCmd.makeFwUpdateCmd(midAddress, [65535], data.fwSize, json.version, json.fwType);
				console.log(cmd);

				Command.addCommand({midAddress:midAddress, address:midAddress}, 
					{midAddress:midAddress, address:midAddress, infoType:4, command:cmd}, res, 1);
			}
			else	//-- update slave device --//
			{
				cmd = RemoteCmd.makeFwUpdateCmd(json.hostId, json.slaveId, data.fwSize, json.version, json.fwType);
				console.log(cmd);

				//--- add command queue ---//
				Command.addCommand({midAddress:json.hostId, address:json.hostId}, 
					{midAddress:json.hostId, address:json.hostId, infoType:4, command:cmd}, res, 1);	
			}
		}
	});

});

httpServer.post("/fw/:fwName", function(req, res, next){
	
	var body = JSON.parse(req.body);
	var fwData = new Buffer(body.fw, 'base64');

	console.log(fwData.length);

	fs.writeFile((req.params.savePath + req.params.fwName), fwData, function(err){

		if (err)
		{
			res.writeHead(404);
			res.end();
		}
		else
		{
			var fwInfo = 
			{
				fwType:body.fwType,
				version:body.version,
				info:body.info,
				fwSize:fwData.length,
				createAt:body.createAt
			};

			FwInfo.insertFwInfo(fwInfo, res);
		}
	});
});

httpServer.listen(4040, function(){
	
	console.log(httpServer.name + " " + httpServer.url);
});






