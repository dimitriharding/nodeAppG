var should = require('should');
var supertest = require('supertest');
var app = require('../app.js');

describe('Time-Date', function(){
	it('should return current date', function(done){
		
		supertest(app)
		.get('/time/current-time')
		.expect(200)
		.end(function (err, res){
			res.status.should.equal(200);
			done();
		});
		
	});
	
});