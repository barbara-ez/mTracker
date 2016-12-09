var express=require("express");
var app= express();
var path = require('path');
var bodyParser= require("body-parser");
var admin= require("firebase-admin");
var firebase=require("firebase");
var session=require('express-session');
var nodemailer = require('nodemailer');

admin.initializeApp({
  credential: admin.credential.cert("sample-node.json"),
  databaseURL: "https://maintenance-tracker-fdea0.firebaseio.com"
});

var transporter = nodemailer.createTransport('SMTP', {
    service: "Gmail",
    auth: {
        user: "barbie.ezomo@gmail.com",
        pass: "Pegasuses1"
    }
});
var mailOptions = {from: "barbie.ezomo@gmail.com"};


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
    res.redirect('/dashboard');
});

app.get('/viewRequests', function(req, res) {
	var user = req.session.currentuser;
	var myrequests = [];
	var myrequestsc = [];
	var keysdone=[];
	var keysaccept=[];
 
    if (user===undefined || user== null)
    {
    	res.redirect("/");
    }
    else{
    	if(user.role=="Admin")
    	{
    
    	    ref.child('Request').once('value', function(data){
		    	var requests= data.val();
		    	
		    	for(var keys in requests){
		    		if(requests[keys].Status==""||requests[keys].Completed=="NO"){
		    			requests[keys].id = keys;
		    			myrequests.push(requests[keys]);
		    		}
		    		
		    	}
		    	console.log(myrequests);
		    	res.render('viewRequests', {personalrequests: myrequests,personalrequestsc: myrequestsc});
		    });


    	}
    	else
    	{

		    

    	}
    }

});


app.get('/completeRequest', function(req, res) {
		
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
    
    	    ref.child('Request').once('value', function(data){
		    	var requests= data.val();
		    	
		    	for(var keys in requests){
		    		
		    			myrequests.push(requests[keys]);
		    		
		    		
		    	}
		    	console.log(myrequests);
		    	res.render('completeRequest', {personalrequests: myrequests,personalrequestsc: myrequestsc});
		    });


    	}
    	else
    	{

		    

    	}
    }
   
});


app.get('/completeRequest/:requestid', function(req, res) {
	console.log(req.params.requestid);
	var ureq=req.params.requestid;
	ref.child('Request').child(ureq).update({Status:"Accepted"});
	
// 	mailOptions.html="Your Request has been accepted";
// 		ref.child('Request').child(ureq).on('value', function(snap) {
// 		var username = snap.val().username;
// 		ref.child('Users').on('value', function(snap) {
// 			var users=snap.val();
// 			for(var keys in users)

// 			{
// 				if(users.username==username){
// 					var email=users.email;
// 					break;
// 				}
// 			}
// 			mailOptions.to="bodunadebiyi";
// 			mailOptions.html = "Slash a hole";
// 		    mailOptions.subject = "Me";
// 		    transporter.sendMail(mailOptions, function(error, response) {
// 		        if(error) {
// 		            console.log(error);
// 		        }
// 		        else {
// 		            console.log("Message sent: " + response.message);
// 		        }
// 		        transporter.close();



// 		});

// 	});
// });
    res.redirect('/viewRequests');
});

app.get('/rejectRequest/:requestid', function(req, res) {
	console.log(req.params.requestid);
	var ureq=req.params.requestid;
	ref.child('Request').child(ureq).update({Status:"Rejected"});
    res.redirect('/viewRequests');
});

app.get('/updateRequest/:requestid', function(req, res) {
	console.log(req.params.requestid);
	var ureq=req.params.requestid;
	ref.child('Request').child(ureq).update({Completed :"Yes"});
	

    res.redirect('/viewRequests');
});


app.get('/addRepairMan', function(req, res) {
        var user = req.session.currentuser;
    

    if (user===undefined || user== null)
    {
    	res.redirect("/");
    }
    else
    {

		   		
		    	res.render('addRepairMan');
	
	   
 
	     	
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
		    ref.child('Request').once('value', function(data){
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
	        'Completed':"NO",
	        'Maintenance_Personel':""
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
            res.redirect('/signedin');
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
