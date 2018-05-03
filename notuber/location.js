/*
 *      Darby Huye
 *      Comp20; Assignment 2: Ride Sharing Service
 *      The file contains the javascript code that implements the following:
 *      If the user is a driver, all passengers (that requested a ride in
 *      the past five minutes) will appear on a map. If the user is a passenger
 *      the same holds but with drivers on the map. If you click on youself 
 *      (maked by "me") it will tell you how close the nearest driver/passenger
 *      is to you. If you click on a driver/passenger, it will tell you their 
 *      distance to you.   
 */
 
var map;
var myUsername = "Ein4EIwThk";
var myLocation;
var myLat = 0;
var myLng = 0;
var infoWindow;
//used to find closest passenger/driver:
var minDist = 1000;
var minIndex;

var driverIcon = "car.png";
var passengerIcon = "passenger_icon.png";
var meIcon = "me_icon.png";
//used as a bool:
var am_I_driver;

var request = new XMLHttpRequest();
//var url = "https://jordan-marsh.herokuapp.com/rides";
var url = "https://warm-stream-49490.herokuapp.com/rides"; /* MINE */
//var url = "https://pure-basin-27130.herokuapp.com/rides";

function buildMap() {
    mypos = {lat: myLat, lng: myLng};
    var init_state = {center: mypos, zoom: 10};
    map = new google.maps.Map(document.getElementById('map'), init_state);
    infoWindow = new google.maps.InfoWindow();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            myLocation = new google.maps.LatLng(myLat, myLng);
            
            map.panTo(myLocation);
            me_marker = getMarker(myLocation, meIcon, myUsername);
            me_marker.setMap(map);
            makeRequests(me_marker);         
        });
    }
    else {
        alert("Geolocation is not supported by this web browser!");
    }
}

function makeRequests(me)
{
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", 
                                        "application/x-www-form-urlencoded");

    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
            data = JSON.parse(request.responseText);
            passengers = data["passengers"];
            addPassengers(passengers);
            vehicles = data["vehicles"];
            addVehicles(vehicles);
            mycontent = getMyContent(minDist, am_I_driver);
            setInfoWindow(me_marker, mycontent);
        }
    }
    //params = "username=" + myUsername + "&lat=" + myLat + "&lng=" + myLng;
    params = "username=JANET" + "&lat=" + myLat + "&lng=" + myLng;
    request.send(params)

}

function addPassengers(passengers)
{
    if(passengers != null){
        for(i = 0; i < passengers.length; i++) {
            passenger = passengers[i];
            username = passenger["username"];
            thislat = passenger["lat"];
            thislng = passenger["lng"];
            pos = {lat: thislat, lng: thislng};
            marker = getMarker(pos, passengerIcon, username);
            marker.setMap(map); 

            thiscontent = getContent(pos, username, false);
            setInfoWindow(marker, thiscontent);
            thisdist = computeDist(pos);
            if(thisdist < minDist) {
                minDist = thisdist;
                minIndex = i;
            }
        }
        am_I_driver = true;
    }

}

function addVehicles(vehicles)
{
    if(vehicles != null) {  
        for(i = 0; i < vehicles.length; i++) {
            vehicle = vehicles[i];
            username = vehicle["username"];
            thislat = vehicle["lat"];
            thislng = vehicle["lng"];
            pos = {lat: thislat, lng: thislng};
            marker = getMarker(pos, driverIcon, username); 
            marker.setMap(map); 

            thiscontent = getContent(pos, username, true);
            setInfoWindow(marker, thiscontent);
            thisdist = computeDist(pos);
            if(thisdist < minDist) {
                minDist = thisdist;
                minIndex = i;
            }
        }
        am_I_driver = false;
    }
}

function setInfoWindow(marker, content)
{
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(content);
        infoWindow.open(map, this);
    });
}

function computeDist(pos) {
    return google.maps.geometry.spherical.computeDistanceBetween(myLocation,  
                new google.maps.LatLng(pos["lat"], pos["lng"])) * 0.000621371;
}

function getContent(position, username, vehicle)
{
    dist = computeDist(position);
    if(vehicle) return "<p>Driver: " + username + "</p><p>Distance from me: " 
                                                        + dist + " miles</p>";
    return "<p>Passenger: " + username + "</p><p>Distance from me: " + dist 
                                                                + " miles</p>";
}

function getMyContent(dist, vehicle)
{
    if(dist == 1000 && vehicle != true) 
            return "<p> There are no available drivers at this time. </p>";
    if(dist == 1000 && vehicle == true)
        return "<p> There are no available passengers at this time. </p>";
    if(vehicle) return "<p> My Username: " + myUsername + 
                "</p><p> Closest passenger is " + dist + " miles away. </p>";
    if(!vehicle) 
        return "<p>My Username: " + myUsername + "</p><p> Closest driver is " 
            + dist + " miles away. </p>";
}

function getMarker(pos, Icon, title)
{
    return new google.maps.Marker({position: pos, icon: Icon, 
                                                    map: map, title: title});
}

