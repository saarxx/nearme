var mongo = require('mongodb');
var BSON = mongo.BSONPure;



/*
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('studentsdb', server);
*/
var USERS_COLLECTION="users"
var BUSINESS_PLACE_COLLECTION="business_place"
var REVIEWS_COLLECTION="reviews"
var CATEGORIES_COLLECTION="categories"


if(process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
  var mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"", 
    "name":"",
    "db":"db"
  }
}

var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}

var mongourl = generate_mongo_url(mongo);

var db = null;
//var port = (process.env.VMC_APP_PORT || 3000);
//var host = (process.env.VCAP_APP_HOST || 'localhost');
require('mongodb').connect(mongourl, function(err, conn){

	db =conn;
    if(!err) {
        console.log("Connected to 'nearme' database");
        db.collection(USERS_COLLECTION, {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateUsersCollection();
            }else{
				console.log("User collection exits");
			}
        });
		
		db.collection(BUSINESS_PLACE_COLLECTION, {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'business place' collection doesn't exist. Creating it with sample data...");
                populateBusinessPlaceCollection();
            }
        });
		
		db.collection(REVIEWS_COLLECTION, {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'reviews' collection doesn't exist. Creating it with sample data...");
                populateReviewsCollection();
            }
        });
		
		db.collection(CATEGORIES_COLLECTION, {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'categories' collection doesn't exist. Creating it with sample data...");
                populateCategoriesCollection();
            }
        });
    }
});

var populateUsersCollection = function() {

	var user1 = {
      user_name:"moshe",
	  sid:"100",
	  password:"123 ",
	  first_name:"moshe", 
	  last_name:"cohen",
	  gender:"male", 
	  creation_date: new Date(1,2013),
      address: {city:"tel aviv", street:"aba even", street_no:"3"} 
    };

    db.collection(USERS_COLLECTION, function(err, collection) {
        collection.insert(user1, {safe:true}, function(err, result) {
		console.log("user1 result="+result);
		console.log("err="+err);
		});
	 }); 

	//adding an index over the uesr name field
	db.collection(USERS_COLLECTION, function(err, collection) {
		collection.ensureIndex("user_name", function(err, indexName) {
			if (err){
				console.log("error creating index");
			} else {
				console.log("created index for user collection");
			}
		});
    });

};

var populateBusinessPlaceCollection = function() {
	 
	 var business_place1 = {
      name:"cafe cafe",
	  creation_date :new Date(1, 2012),
  	  location:{longitude:"123", latitude:"456"},
	  location:{longitude:"123", latitude:"456"},
	  last_location_upate_time:new Date(789), 
	  business_hours:[{day:"sunday",open:"9:00", close:"16:00"}, {day:"monday",open:"9:00", close:"17:00"}],
	  phothos:{},
	  category_name:"entertainment"
    };

    db.collection(BUSINESS_PLACE_COLLECTION, function(err, collection) {
        collection.insert(business_place1, {safe:true}, function(err, result) {
		console.log("business_place1 result="+result);
		console.log("err="+err);
		});
	 }); 
};

var populateReviewsCollection = function() {
	 
	 var review1 = {
      business_place_id:null,
	  user_id:null,
	  review:"This place rocks!!!", 
	  rank:"10",
	  creation_date :new Date(1, 2012)
    };
	
	 var review2 = {
      business_place_id:"522187dbc768fd8c41000005",
	  user_id:null,
	  review:"This place sucks!!!", 
	  creation_date :new Date(1, 2012)
    };


    db.collection(REVIEWS_COLLECTION, function(err, collection) {
        collection.insert(review1, {safe:true}, function(err, result) {
		console.log("review result="+result);
		console.log("err="+err);
		});
		
        collection.insert(review2, {safe:true}, function(err, result) {
		console.log("review result="+result);
		console.log("err="+err);
		});

	 }); 
};

var populateCategoriesCollection = function() {
	 
	 var category1 = {
      name:"entertainment",
  	  sub_category:["cinema"] 
    };

    db.collection(CATEGORIES_COLLECTION, function(err, collection) {
        collection.insert(category1, {safe:true}, function(err, result) {
		console.log("category result="+result);
		console.log("err="+err);
		});
	 }); 
};




exports.getUser = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
	if (id) 
	{
    db.collection(USERS_COLLECTION, function(err, collection) {
          collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
	    //collection.findOne({'sid':(id)}, function(err, item) {
			res.setHeader("Content-Type", "text/plain");
			console.log("err="+err);
			console.log("item="+item);
            res.send(item);
        });
    });
	}
};


exports.getUserByName = function(req, res) {
    var user_name = req.params.user_name;
    console.log('Retrieving user with name: ' + user_name);
	if (user_name) 
	{
		db.collection(USERS_COLLECTION, function(err, collection) {
			  collection.findOne({'user_name':user_name}, function(err, item) {
				res.setHeader("Content-Type", "text/plain");
				console.log("err="+err);
				console.log("item="+item);
				res.send(item);
			});
		});
	}
};

exports.getUsers = function(req, res) {
    console.log('Retrieving users: ');

    db.collection(USERS_COLLECTION, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });	
};


exports.addUser= function (req,res)
{
	var user = req.body;
	console.log("in addUser");
	console.log("user="+user);

	
	db.collection(USERS_COLLECTION, function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
		 if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('result: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}


exports.updateUser= function(req, res) {
    var id = req.params.id;
    var user = req.body;
	console.log("updateUser id="+id);

    console.log(JSON.stringify(user));
	
    db.collection(USERS_COLLECTION, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating users : ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });


}


exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
	 db.collection(USERS_COLLECTION, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}	
exports.deleteBusinessPlace = function(req, res) {
    var id = req.params.id;
    console.log('Deleting business place: ' + id);
	 db.collection(BUSINESS_PLACE_COLLECTION, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
	}
	
exports.addBusinessPlace= function (req,res)
{
	var businessPlace = req.body;
	console.log("in addBusinessPlace");
	console.log("business place="+businessPlace);

	
	db.collection(BUSINESS_PLACE_COLLECTION, function(err, collection) {
        collection.insert(businessPlace, {safe:true}, function(err, result) {
		 if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('result: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });	
}    


exports.getBusinessPlaces = function(req, res) {
    console.log('Retrieving business places: ');

    db.collection(BUSINESS_PLACE_COLLECTION, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.getReviewsWithRank = function(req, res) {
    
    db.collection(REVIEWS_COLLECTION, function(err, collection) {
        //collection.find({ 'rank' : { $gt: parseInt(rank) } } ).toArray(function(err, items) {
        collection.find({ rank:  {$exists:true}} ).toArray(function(err, items) {

            res.send(items);
        });
    });
};

exports.getReviews = function(req, res) {
    console.log('Retrieving business places: ');

   db.collection(REVIEWS_COLLECTION, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.dropAllCollections = function(req, res) {
	var drop = function(name) {
		db.dropCollection(name, function(err) {
		if(!err) {
			console.log( name + " dropped");
		} else {
             console.log("!ERROR! " + err.errmsg);
        }
     });
	}

	drop(USERS_COLLECTION);
	drop(BUSINESS_PLACE_COLLECTION);
	drop(REVIEWS_COLLECTION);
	drop(CATEGORIES_COLLECTION);
	res.send("ok");
};



exports.getBusinessPlaceByCategory = function(req, res) {
    var category_name = req.params.category_name;
    console.log('Retrieving business place with category name: ' + category_name);
    if (category_name) 
    {
    db.collection(BUSINESS_PLACE_COLLECTION, function(err, collection) {
          collection.find({'category_name':(category_name)}).toArray(function(err, bizPlaces){
            res.setHeader("Content-Type", "text/plain");
            console.log("category name"+category_name);
            console.log("err="+err);
            console.log("="+bizPlaces);
            res.send(bizPlaces);
        });
    });
    }
};

exports.getBusinessPlaceByName = function(req, res) {
    var biz_name = req.params.biz_name;
    console.log('Retrieving business place with name: ' + biz_name);
    if (biz_name) 
    {
    db.collection(BUSINESS_PLACE_COLLECTION, function(err, collection) {
          collection.find({'name':(biz_name)}).toArray(function(err, bizPlaces){
            res.setHeader("Content-Type", "text/plain");
            console.log("name"+biz_name);
            console.log("err="+err);
            console.log("="+bizPlaces);
            res.send(bizPlaces);
        });
    });
    }
};

exports.getReviewsByBizPlaceId = function(req, res) {
    console.log('Retrieving business place by biz place id');
    var biz_place_id = req.params.biz_place_id;
    console.log('Retrieving business place with id: ' + biz_place_id);
    if (biz_place_id) 
    {
        db.collection(REVIEWS_COLLECTION, function(err, collection) {
              collection.find({'business_place_id':biz_place_id}).toArray(function(err, reviews){
                console.log("biz place id"+biz_place_id);
                console.log("err="+err);
                console.log("="+reviews);
                res.setHeader("Content-Type", "text/plain");
                res.send(reviews);
            });
        });
    }
};

exports.getBusinessPlaceById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving business place with id: ' + id);
    if (id) 
    {
    db.collection(BUSINESS_PLACE_COLLECTION, function(err, collection) {
          collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
        //collection.findOne({'sid':(id)}, function(err, item) {
            res.setHeader("Content-Type", "text/plain");
            console.log("err="+err);
            console.log("item="+item);
            res.send(item);
        });
    });
    }
};

exports.addReview= function (req,res)
{
    if (!req.session.user){
        res.send("{error:'not logged in'}");
        return;
    }

    var review = req.body;
    review.user_id=req.session.user_id;
    console.log("in addReview");
    console.log("review="+review);

    
    db.collection(REVIEWS_COLLECTION, function(err, collection) {
        collection.insert(review, {safe:true}, function(err, result) {
         if (err) {
                res.send({'error':'An error has occurred'});
                console.log("error adding review " + err)
            } else {
                console.log('result: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.logIn = function(req, res) {
    var user_name = req.params.name;
    console.log('Retrieving user with name: ' + user_name);
    if (user_name) 
    {
        db.collection(USERS_COLLECTION, function(err, collection) {
              collection.findOne({'user_name':user_name}, function(err, item) {
                res.setHeader("Content-Type", "text/plain");
                console.log("err="+err);
                console.log("user " + item);
                if (item){
                    req.session.user = user_name;
                    req.session.user_id = item._id;
                }
                res.send(item);
            });
        });
    }
};

exports.logout = function(req, res) {
    req.session.user = null;
    req.session.user_id = null;
    res.send("{result:'user logged out'}");
};

