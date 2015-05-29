var express = require('express');
var ObjectID = require('mongodb').ObjectID
var router = express.Router();

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {

        res.json(items);
    });
});

router.get('/viewuser', function(req, res) {
    var db = req.db;
    var user = req.query.id;
    //res.json(user);
    //var query = '{"_id" : ObjectId("5567580810256268299df7ea")}';
    db.collection('userlist').findOne({_id: ObjectID.createFromHexString(user)},function(err, result) {
    if (err) { res.status(400).send({msg: 'An error occured: '+err}) };
       res.json(result);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    db.collection('userlist').insert(req.body, function(err, result){
        
        if(result){
            res.status(201).json(result);
        }
        else{
            res.status(400).send({msg : 'error' + err});
        }

    });
});

router.put('/edituser', function(req, res) {
    var db = req.db;
    var user = req.query.id;
    db.collection('userlist').update({_id: ObjectID(user)}, req.body, function(err, result){
    //console.log(result);
        if(result){
            res.status(200);
            res.send();
        }
        else{
            res.status(400).send({msg : 'error' + err});
        }

    });
});
/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser', function(req, res) {
    var db = req.db;
    var user = req.query.id;
    db.collection('userlist').removeById(user, function(err, result) {

        if(result === 1){
            res.status(201).send('Successfully Deleted');
        }
        else{
            res.status(400).send({msg : 'error' + err});
        }
    });
});


module.exports = router;
