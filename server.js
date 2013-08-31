var express = require('express');
var nearme = require('./nearme');
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

var app = express();
app.configure(function () {
    app.use(express.logger('dev'));    
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: '1234'}));
});

app.get('/users/:id',nearme.getUser);
app.get('/users/name/:user_name',nearme.getUserByName);

app.get('/users',nearme.getUsers);
app.post('/users',nearme.addUser);

app.put('/users/:id',nearme.updateUser);
app.post('/reviews/',nearme.addReview);
app.delete('/users/:id',nearme.deleteUser);
app.delete('/business_places/:id',nearme.deleteBusinessPlace);
app.post('/business_places',nearme.addBusinessPlace);
app.get('/business_places',nearme.getBusinessPlaces);
app.get('/business_places',nearme.getBusinessPlaces);
app.get('/business_places/:id',nearme.getBusinessPlaceById);
app.get('/reviews',nearme.getReviews);
app.get('/business_places/category/:category_name',nearme.getBusinessPlaceByCategory);
app.get('/reviews/business_places/:biz_place_id',nearme.getReviewsByBizPlaceId);
app.get('/business_places/name/:biz_name',nearme.getBusinessPlaceByName);

app.get('/drop_all_collections',nearme.dropAllCollections);

app.post('/users/login/:name',nearme.logIn);
app.post('/users/logout/',nearme.logout);

app.listen(port,host);
