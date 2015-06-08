
exports.findById = {
  'spec': {
    description : "Find users by ID",  
    path : "/users/viewuser?id={userId}",
    method: "GET",
    summary : "Find users by ID",
    notes : "Returns a user based on ID",
    type : "User",
    nickname : "getUserById",
    produces : ["application/json"],
    parameters : [params.path("userId", "ID of user that needs to be fetched", "string")],
    responseMessages : [swe.invalid('id'), swe.notFound('user')]
  },
  'action': function (req,res) {
    if (!req.query.id) {
      throw swe.invalid('id'); }
    var id = parseInt(req.query.id);
    var user = userData.getUserById(id);

    if(user) res.send(JSON.stringify(user));
    else throw swe.notFound('user', res);
  }
};



