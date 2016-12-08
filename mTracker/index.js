var express=require("express");
var app= express();
var path = require('path');
var bodyParser= require("body-parser");
var admin= require("firebase-admin");
var firebase=require("firebase");
var session=require('express-session');

admin.initializeApp({
  credential: admin.credential.cert("sample-node.json"),
  databaseURL: "https://maintenance-tracker-fdea0.firebaseio.com"
});


//bodyparser helps to get form data passed in request
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret:"secret"}));


app.use(express.static(__dirname + '/assets'));
app.use("/assets", express.static(__dirname + '/assets'));

//configure express with ejs template engine

app.set('view engine','ejs');
var ref= admin.database().ref('/mTrackerApp');

app.get('/',function(req,res){
	res.render('adminLogin');
});

app.get('/signedin', function(req, res) {
    res.render('signedin');
});

app.get('/index', function(req, res) {
    res.render('index');
});

app.get('/viewRequests', function(req, res) {
	var user = req.session.currentuser;
	var myrequests = [];
	var myrequestsc = [];
 
    if (user===undefined || user== null)
    {
    	res.redirect("/");
    }
    else{
    	if(user.role=="Admin")
    	{
    
    	    ref.child('Request').on('value', function(data){
		    	var requests= data.val();
		    	
		    	for(var keys in requests){
		    		if(requests[keys].Status==""){
		    			myrequests.push(requests[keys]);
		    		}
		    		if(requests[keys].Completed=="NO"){
		    			myrequestsc.push(requests[keys]);
		    		}
		    	}
		    	res.render('viewRequests', {personalrequests: myrequests,personalrequestsc: myrequestsc});
		    });


    	}
    	else
    	{

		    

    	}
    }

});

app.get('/completeRequest', function(req, res) {
    res.render('completeRequest');
});

app.get('/addRepairMan', function(req, res) {
        var user = req.session.currentuser;
    var repairmen=[];

    if (user===undefined || user== null)
    {
    	res.redirect("/");
    }
    else
    {

	    ref.child('Repairman').on('value', function(data){
		    	var repair= data.val();
		    	
		    	for(var keys in repair){
		            repairmen.push(repair[keys]);
		    	
		    	}

		   		console.log(repairmen);
		    	res.render('addRepairMan', {mpersonel: repairmen});
		});
	   
 
	     	
    }
});


app.get('/about', function(req, res) {
    res.render('about us');
});


app.get('/logout', function (req, res) {
	delete req.session.currentuser;
	res.redirect('/');
});


app.get('/dashboard', function(req, res) {
	var user = req.session.currentuser;
	var myrequests = [];

    if (user===undefined || user== null)
    {
    	res.redirect("/");
    }
    else{
    	if(user.role=="Admin")
    	{
    		res.render('index',{user:user});

    	}
    	else
    	{
		    ref.child('Request').on('value', function(data){
		    	var requests= data.val();
		    	
		    	for(var keys in requests){
		    		console.log(requests[keys])
		    		if(user.username==requests[keys].username){
		    			myrequests.push(requests[keys]);
		    		}
		    	}
		    	res.render('makeRequest', {personalrequests: myrequests,user:user});
		    });

		    


    	}
    }
    
});

app.get('/makeRequest', function(req, res) {
    res.render('makeRequest');
});

app.get('/acceptedRequests', function(req, res) {
    res.render('acceptedRequests');
});


app.post('/register', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var username= req.body.username;
    var role=req.body.role;


    var userobj={
    	'username': username,
        'password': password,
        'role': role,
        'email':email
    }
    ref.child('Users').push(userobj);
    req.session.currentuser = userobj;
    res.redirect("/dashboard");
    

        // ref.child("Users").on('value', function(data){
        // var users = data.val();
        // var foundUser = null;
        // for (var keys in users)
        // {
        // 	var user = users[keys];
        // 	if(email==user.email)
        // 	{
        // 		if (password==user.password)
        // 		{
        // 			foundUser = user;
        // 			break;
        // 		}
        // 	}
        // }

        // if (foundUser == null) {
        // 	console.log('user not found')
        //     res.redirect('/');
        // } else {
        // 	console.log('user found')
        // 	req.session.currentuser = foundUser;
        // 	res.redirect("/dashboard");
        // }


        // });


});

app.post('/request', function (req, res) {
    var user = req.session.currentuser;

    if (user===undefined || user== null)
    {
    	res.redirect("/");
    }
    else
    {
	    var request = req.body.request;
	    var date = req.body.date;

	    var reqt = {
	        'username': user.username,
	        'request': request,
	        'date': date,
	        'Status':"",
	        'Completed':"NO"
	    };
	    
	    ref.child('Request').push(reqt);
		res.redirect("/dashboard");     	
    }
});

app.post('/updaterequest', function (req, res) {
    var user = req.session.currentuser;

    if (user===undefined || user== null)
    {
    	res.redirect("/");
    }
    else
    {
	    var request = req.body.request;
	    var date = req.body.date;
	    var status = req.body.Status;
	    var date = req.body.Completed;
	    var date = req.body.Comments;


	    var reqt = {
	        'username': user.username,
	        'request': request,
	        'date': date,
	        'Status':"",
	        'Completed':"NO",
	        'Comments':"None"
	    };
	    
	    ref.child('Request').push(reqt);
		res.redirect("/dashboard");     	
    }
});

app.post('/repairman', function (req, res) {
    var user = req.session.currentuser;
    var repairmen=[];

    if (user===undefined || user== null)
    {
    	res.redirect("/");
    }
    else
    {
	    var repairman = req.body.name;
	    var rank = req.body.rank;
	    var phone=req.body.phone;

	    var repm = {
	        'Name': repairman,
	        'Rank': rank,
	        'Pnone No':phone
    };
	    
	    ref.child('Repairman').push(repm);
	    res.redirect("/addRepairMan")
 
	     	
    }
});

;

var session="";

app.post('/login', function (req, res) {
    var email = req.body.email_log;
    var password = req.body.passwordlog;

    ref.child("Users").on('value', function(data){
        var users = data.val();
        var foundUser = null;
        for (var keys in users)
        {
        	var user = users[keys];
        	if(email==user.email)
        	{
        		if (password==user.password)
        		{
        			foundUser = user;
        			break;
        		}
        	}
        }

        if (foundUser == null) {
        	console.log('user not found');
            res.redirect('/');
        } else {
        	console.log('user found')
        	req.session.currentuser = foundUser;
        	res.redirect("/dashboard");
        }


    });
});
app.listen(3000,function(){
	console.log("Server started on port 3000");
});
