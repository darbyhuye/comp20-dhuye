var map;
var myLat = 0;
var myLng = 0;
var infoWindow;

var driverIcon = "car.png";
var passengerIcon = "passenger_icon.png";
var meIcon = "me_icon.png";
var myLogin = "Ein4EIwThk";


var request = new XMLHttpRequest();
var url = "https://jordan-marsh.herokuapp.com/rides";


function buildMap() {
    var init_state = {center: {lat: myLat, lng: myLng}, zoom: 10};
    map = new google.maps.Map(document.getElementById('map'), init_state);
    infoWindow = new google.maps.InfoWindow();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            myLocation = new google.maps.LatLng(myLat, myLng);
            
            map.panTo(myLocation);
            me_marker = new google.maps.Marker({position: myLocation, 
                                    icon: meIcon, map: map, title: myLogin});
            me_marker.setMap(map);
            
           // makeRequest(me_marker); -> write function that makes requests
                    
        });
    }
    else {
        alert("Geolocation is not supported by this web browser!");
    }
}
