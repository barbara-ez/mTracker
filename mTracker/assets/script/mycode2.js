$(document).ready(function(){
        $.get('http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=df5c63dbd121f3e4c5d7ba8302d8a73d', function(data) {
        $("#data").text(JSON.stringify(data));
    });
    
    $("button").click(function(){
        $.post("http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=df5c63dbd121f3e4c5d7ba8302d8a73d",
        {
          name: "Donald Duck",
          city: "Duckburg"
        },
        function(data,status){
            alert("Data: " + data + "\nStatus: " + status);
        });
    });
});

