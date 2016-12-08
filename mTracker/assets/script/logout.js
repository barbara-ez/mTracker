(function(){
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyBGf2SqanTpW9NgpMD_VsUcWrqiTqjjIsY",
        authDomain: "js-example-e85d8.firebaseapp.com",
        databaseURL: "https://js-example-e85d8.firebaseio.com",
        storageBucket: "js-example-e85d8.appspot.com",
        messagingSenderId: "193174301026"
      };
      firebase.initializeApp(config);
  
  
   
      btnlogout.addEventListener('click', e => {
       
      firebase.auth().signOut();
      
       
   });
   
   
   firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser){
            console.log(firebaseUser);
            var user = firebase.auth().currentUser;
            var email;

            if (user != null) {
              email = user.email;
              document.getElementById("username").innerHTML=email;
            }
                  
          
      }   
      else{
            console.log('not logged in');
            window.location="adminLogin.html";
       
      }
   });
   

  
  
    
}());

