var stack = []
var user;

var site_url = '';
$(function() {


    initCategoriesPage();


     $("#categories_page").on('pageshow', function() {
        setlogin();
        initCategoriesPage();
    });

    $("#categories_page").on('pageinit', function() {
        setlogin();
        initCategoriesPage();
    });

    $("#categories_page").on('pagebeforecreate', function() {
        setlogin();
        initCategoriesPage();
    });

 


    $("#places_page").on('pageinit', function() {
        var category = stack.pop();
        // alert(user);
        initPlacesList(category);
    });
    $("#place_page").on('pageinit', function() {
        var place_name = stack.pop();

                $.ajax({
            url: site_url + '/business_places/name/'+place_name,
            type:'GET',
            dataType:'json',
            success: function(data) {
                initPlacePage(data[0]);
            
        }

    });
        
        // console.log(place.name);

    });

    $("#add_review_page").on('pageinit', function() {
       initAddReviewPage();
    });


    $("#show_reviews_page").on('pageinit', function() {
        initShowReviewsPage();
    });
  $("#add_place_page").on('pageinit', function() {
        initAddPlacePage();
    });


    


});

function initAddPlacePage() {
    var cats = stack.pop();
    var items = [];
    cats.cats.forEach(function(cat) {
        items.push('<option value="' + cat._id + '">' + cat.name + '</option>');
    });
    $("#cat_select").html(items).selectmenu('refresh', true);;
}

function initAddReviewPage() {
     var place = stack.pop(place);
        $(".add_review_title").html("<h4>Adding review for " + place.name + "</h4>")
        var element = $(".submit_review_button")[0]; 
        $.data(element, "object", place);
    }



function initShowReviewsPage() {
     var place = stack.pop(place);
     
  $.ajax({
            url: site_url + '/reviews/business_places/'+place._id,
            type:'GET',
            dataType:'json',
            success: function(data) {
                var items = []
                $.each(data, function(i, elem) {
                    items.push('<div class="review_class" id="review_'+i+'"><h4>' + '  review: ' +elem.review +'</h4></div>');
                });
            $("#reviews_list").html(items).listview('refresh');
        }

    });
}

function initPlacePage(place) {
  $("#place_name").html("<h1>"+place.name+"<h1>");
  $("#place_desc").html("<h3>description</h3>");
  var open_hours = '';
  place.business_hours.forEach(function(s) {
    open_hours +="<div>" + s.day + ', ' + s.open + '-' +s.close + "</div>"; 
});
  
  $("#open_hours").html("<div><h3>Openning Hours:</div><div>" + open_hours + "</div></h3>");

  var element = $(".add_review_page_button")[0]; 
  $.data(element, "object", place);


  var element2 = $(".reviews_page_button")[0]; 
  $.data(element2, "object", place);

  if (user == undefined) {
    $(".add_review_page_button").hide();
}
}



function setlogin() {
   if (user == undefined) {
    $(".logout_button").hide();
    $(".login_button").show();
} else {
    $(".login_button").hide();
    $(".logout_button").show();
}
}

function initCategoriesPage(id, requestUrl) {
    setlogin();
    $.ajax({
        url: site_url + '/categories',
        type:'GET',
        dataType:'json',
        success: function(data) {
            var items = []
            var cats = new Object();;
            cats.cats = [];
            $.each(data, function(i, elem) {
                items.push('<li class="category_li" id="cat_li_'+i+'"><a href="#places_page">' + elem.name + '</a></li>');
                cats.cats.push(elem);
            });
            $("#categories_ul").html(items).listview('refresh');
            var element = $(".add_place_button")[0]; 
             $.data(element, "object", cats); 
        }

    });


}

function initPlacesList(category_id) {
    $.ajax({
        url: site_url + '/business_places/category/' + category_id,
        type:'GET',
        dataType:'json',
        success: function(data) {
            var items = []
            $.each(data, function(i, elem) {
                items.push('<li class="place_li" id="place_li_'+i+'"><a href="#place_page">' + elem.name + '</a></li>');
                $("#places_ul").html(items).listview('refresh');
                var element = $("#place_li_" + i)[0]; 
                $.data(element, "object", elem); 
            });
            $("#places_ul").listview('refresh');

        }

    });
    
}

$(document).on("click", '.category_li', function(event, ui) {
    stack.push(event.target.innerText);
})

$(document).on("click", '.add_place_button', function(event, ui) {
    var cats = $.data(this, "object");
    stack.push(cats);
})




$(document).on("click", '.place_li', function(event, ui) {
    // var place = $.data(this, "object");
    // stack.push(place);
    stack.push(event.target.innerText);
})

$(document).on("click", '.submit_login_button', function(event, ui) {
    var username =  $("#username").val();
    
    $.ajax({
        url: site_url + '/users/login/' + username,
        type:'POST',
        dataType:'json',
        success: function(data) {
            user = data;
            $.mobile.changePage("#categories_page", "slideup");

        },
        error:function(data) {


        }

    });
});

function login(username) {
    $.ajax({
        url: site_url + '/users/login/' + username,
        type:'POST',
        dataType:'json',
        success: function(data) {
            user = data;
            $.mobile.changePage("#categories_page", "slideup");

        },
        error:function(data) {


        }

    });
}

$(document).on("click", '.logout_button', function(event, ui) {

    $.ajax({
        url: site_url + '/users/logout/',
        type:'POST',
        dataType:'json',
        error:function(data) {
            if (data.status == 200) {
                user = undefined;
                
                $.mobile.changePage($("#categories_page"), {
                    allowSamePageTransition: true,
                    transition: 'none',
                    reloadPage: true
                });

            }

        }

    });
});


$(document).on("click", '.add_review_page_button', function(event, ui) {

    var place = $.data(this, "object");
    // console.log(place);
    stack.push(place);

});

$(document).on("click", '.reviews_page_button', function(event, ui) {

    var place = $.data(this, "object");
    // console.log(place);
    stack.push(place);

});



$(document).on("click", '.submit_review_button', function(event, ui) {


    var place = $.data(this, "object");
    var ttext = $("#review_text").val();
    var review = new Object();
    review.business_place_id = place._id;
    review.review = ttext;
    review.user_id = user._id;
    // var review = {business_place_id:place.id, review: ttext, user_id: user.id}

    $.ajax({
        url: site_url + '/reviews/',
        type:'POST',
        data: review,
        success: function(data) {
            stack.push(place);

            $.mobile.changePage($("#show_reviews_page"), {
                    allowSamePageTransition: true,
                    transition: 'none',
                    reloadPage: true    
                });

       },
       error:function(data) {
        alert(1);
    }

});

});

$(document).on("click", '.submit_add_place_button', function(event, ui) {


    
    var place = new Object();
    place.name = $("#add_place_name").val();
    place.description = $("#add_place_desc").val();
    place.business_hours = [];
    place.business_hours[0] = new Object();
    place.business_hours[0].open= $("#add_place_open").val();
    place.business_hours[0].close= $("#add_place_close").val();
    place.category_name = $("#cat_select").text();
    // var review = {business_place_id:place.id, review: ttext, user_id: user.id}

    $.ajax({
        url: site_url + '/business_places',
        type:'POST',
        data: place,
        success: function(data) {
            // stack.push(place);

            $.mobile.changePage($("#categories_page"), {
                    allowSamePageTransition: true,
                    transition: 'none',
                    reloadPage: true    
                });

       },
       error:function(data) {
        alert(1);
    }

});

});


$(document).on("click", '.submit_signin_button', function(event, ui) {

    var user = new Object();
    user.first_name = $("#firstname").val();
    user.last_name = $("#lastname").val();
    user.user_name = $("#signin_username").val();
    user.address = new Object();
    user.address.city = $("#signin_city").val();
    user.address.street = $("#signin_street").val();
    user.address.street_no = $("#signin_street_no").val();


    $.ajax({
        url: site_url + '/users',
        type:'POST',
        data: user,
        success: function(data) {
            // stack.push(place);

            $.mobile.changePage($("#categories_page"), {
                    allowSamePageTransition: true,
                    transition: 'none',
                    reloadPage: true    
                });

            initCategoriesPage();

       },
       error:function(data) {
        alert(1);
    }

});

});







