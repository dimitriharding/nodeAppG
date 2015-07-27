var express = require('express');
var ObjectID = require('mongodb').ObjectID;
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
    
    db.collection('userlist').findOne({_id: ObjectID.createFromHexString(user)},function(err, result) {
    if (err) { res.status(400).send({msg: 'An error occured: '+err}) };
       res.json(result);
    });
});


router.get('/viewbyage/:age', function(req, res) {
    var db = req.db;
    
    var userage = parseInt(req.params.age);
    
    db.collection('userlist').find({age: userage}).toArray(function(err, items) {
        
       res.json(items);
    
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    
    var sign_in = new Array();
    sign_in.push( {date:"",time_in:"",time_out:"" } );  //initilize an array of objects for sing in data
    
    var user = req.body;
    user["sign_in_data"] = sign_in; //add the sign in objec tto the user data
                console.log
    db.collection('userlist').insert({username: user.username,
                                      email: user.email,
                                      fullname: user.fullname,
                                      age: user.age,
                                      location: user.location,
                                      gender: user.gender,
                                      sign_in_data:[ {
                                          date: user.sign_in_data[0].date,
                                          time_in: user.sign_in_data[0].time_in,
                                          time_out: user.sign_in_data[0].time_out
                                      }],
                                      created_at: new Date(),
                                      updated_at: new Date() }, function(err, result){
        
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
    
    db.collection('userlist').update(
        {_id: ObjectID(user)}, 
        {$set: 
            {username: req.body.username, 
             email: req.body.email,
             fulname: req.body.fullname,
             age: req.body.age,
             location: req.body.location,
             gender: req.body.gender,
             updated_at: new Date()
            } 
        }, function(err, result){
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
            res.status(200).send('Successfully Deleted');
        }
        else{
            res.status(400).send({msg : 'error' + err});
        }
    });
});

router.put('/insertSignIn/:id', function(req, res){
   var db = req.db;
   var user = req.params.id;
   
   db.collection('userlist').update(
       {_id: ObjectID(user), 'sign_in_data.date': ''},   //for signing in, date would be empty
       { $set: 
            {
                'sign_in_data.$.date': req.body.date,
                'sign_in_data.$.time_in': req.body.time
            } 
       },
       function(err, result){
           
       if(result){
            
            res.status(200);
            res.send();
        }
        else{
            res.status(400).send({msg : 'error' + err});
        }
    
    });
     
});

router.put('/insertSignOut/:id', function(req, res){
   var db = req.db;
   var user = req.params.id;
   
   db.collection('userlist').update(
       {_id: ObjectID(user), 'sign_in_data.date': req.body.date},   
       { $set: 
            {
                'sign_in_data.$.date': req.body.date,
                'sign_in_data.$.time_out': req.body.time
            } 
       },
       function(err, result){
           
       if(result){
            
            res.status(200);
            res.send();
        }
        else{
            res.status(400).send({msg : 'error' + err});
        }
    
    });
     
});

 router.put('/insertBlank/:id', function(req, res){
   var db = req.db;
   var user = req.params.id;
   
   db.collection('userlist').update(
       {_id: ObjectID(user)},   //for signing in, date would be empty
       { $push: 
            {
                'sign_in_data': {
                    date:"", 
                    time_in:"",
                    time_out:"" }
            } 
       },
       function(err, result){
           
       if(result){
            
            res.status(200);
            res.send();
        }
        else{
            res.status(400).send({msg : 'error' + err});
        }
    
    });
     
});
module.exports = router;
