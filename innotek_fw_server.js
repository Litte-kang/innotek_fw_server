var restify = require('restify');
var fs = require('fs');
var DevType = require('./node_modules/my_schemas/dev_type');
var DevInfo = require('./node_modules/my_schemas/dev_info');

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

	fs.readFile("./public/html/index.html", function(err, data){
	
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

		fs.readFile("./public/html/top.html", function(err, data){
	
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

		fs.readFile("./public/html/device.html", function(err, data){
	
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

		fs.readFile("./public/html/fw.html", function(err, data){
	
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

httpServer.get('/device_types', function(req, res, next){

	DevType.getDevTypes(res);

});

httpServer.get('/device_infos/:index', function(req, res, next){

	console.log(req.params);
	DevInfo.getDevInfos(req.params.index, req.params.slaveDevType, res);

});

httpServer.listen(4040, function(){
	
	console.log(httpServer.name + " " + httpServer.url);
});







