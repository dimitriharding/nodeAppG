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

router.get('/viewuser/:id', function(req, res) {
    var db = req.db;
    var user = req.params.id;
    //res.json(user);
    //var query = '{"_id" : ObjectId("5567580810256268299df7ea")}';
    db.collection('userlist').findOne({_id: ObjectID.createFromHexString(user)},function(err, result) {
    if (err) { res.send({msg: 'An error occured: '+err}) };
       res.json(result);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    db.collection('userlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;
