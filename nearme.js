var mongo = require('mongodb');

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
	  category_id:null
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

    db.collection(REVIEWS_COLLECTION, function(err, collection) {
        collection.insert(review1, {safe:true}, function(err, result) {
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
       // collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
	    collection.findOne({'sid':parseInt(id)}, function(err, item) {
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

/*
exports.addStudent= function (req,res)
{
	var student = req.body;
	console.log("in addStudent");
	console.log("student="+student);

	
	db.collection('students', function(err, collection) {
        collection.insert(student, {safe:true}, function(err, result) {
		 if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('result: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
	
	
}


exports.updateStudent= function(req, res) {
    var id = req.params.id;
    var student = req.body;
	console.log("updateStudent id="+id);

    console.log(JSON.stringify(student));
	
    db.collection('students', function(err, collection) {
        collection.update({'sid':id}, student, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating users students: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(student);
            }
        });
    });


}


exports.deleteStudent = function(req, res) {
    var id = req.params.id;
    console.log('Deleting student: ' + id);
	 db.collection('students', function(err, collection) {
        collection.remove({'sid':id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
    
}
*/
