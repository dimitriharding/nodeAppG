var http = require('http');
var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');

var timeUrl = 'api.worldweatheronline.com';
var key = 'dd740f40bddb5565cb1d3f42b128e';

var options = {
		  protocol: 'http',
	  	  host: timeUrl,
		  pathname: '/premium/v1/tz.ashx',
		  query: { key: key, q: 'Kingston', format: 'json' }
	};


router.get('/current-date-time', function(req, res){
	var returnUrl = url.format(options);
	
	//or we can pipe
	request(returnUrl, function(err, response, body){
		var obj = JSON.parse(body);
		res.send(extractDateTime(obj));
	});
	
});
//Get current Time
router.get('/current-time', function(req, res) {
	
	var returnUrl = url.format(options);

	//or we can pipe
	request(returnUrl, function(err, response, body){
		if(!err){
			var obj = JSON.parse(body);
			res.status(200);
			res.send(extractTime(obj));
		}else{
			res.status(400);
		}
		
	});
});

router.get('/current-date', function(req, res) {
	
	var returnUrl = url.format(options);
	
	request(returnUrl, function(err, response, body){
		console.log(body);
		var obj = JSON.parse(body);
		res.send(extractDate(obj));
	});
});

function extractTime(obj){
	//console.log(obj.body);
	var date = obj.data.time_zone[0].localtime;
	var arr = date.split(' ');
	return arr[1];
}

function extractDate(obj){
	
	var date = obj.data.time_zone[0].localtime;
	var arr = date.split(' ');
	return arr[0];
}

function extractDateTime(obj){
	
	var date = obj.data.time_zone[0].localtime;
	return date;
}
module.exports = router;