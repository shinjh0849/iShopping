import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare let IndoorAtlas: any;
declare var google;

var map: any;

var curLat;
var curLng;
var watchID;

function addMarker(){
  let marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: {
      lat: curLat,
      lng: curLng
    }
  });

  let content = "<h4> Me! </h4>";
  this.addInfoWindow(marker, content);
}

function addInfoWindow(marker, content) {
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
  google.map.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });
}

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  
  constructor(public geolocation: Geolocation, public navCtrl: NavController) {
    
  }

  ionViewDidEnter() {
    this.loadMap();

    try{
      IndoorAtlas.fetchFloorPlanWithId('09b2f61e-224b-415c-81b1-7f86dee65486', this.successCallback, this.onError);
    }
    catch(e){
      alert('catch error: ' + e);
    }
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }, (err) => {
      alert(err);
    });
  }

  getPosition() {
    try {
      IndoorAtlas.getCurrentPosition(this.onGetPositionSuccess, this.onError)
    }
    catch (e) {
      console.log(e);
    }
  }

  watchPosition() {
    try {
      watchID = IndoorAtlas.watchPosition(this.onWatchPositionSuccess, this.onError, { timeout: 30000 })
    }
    catch (e) {
      console.log(e);
    }
  }

  onWatchPositionSuccess(position) {
    curLat = position.coords.latitude;
    curLng = position.coords.longitude;

    addMarker();
  }

  onGetPositionSuccess(position) {

    curLat = position.coords.latitude;
    curLng = position.coords.longitude;

    alert('Latitude: ' + position.coords.latitude + '\n' +
      'Longitude: ' + position.coords.longitude + '\n' +
      'Altitude: ' + position.coords.altitude + '\n' +
      'Accuracy: ' + position.coords.accuracy + '\n' +
      'Heading: ' + position.coords.heading + '\n' +
      'Floor: ' + position.coords.floor + '\n' +
      'Timestamp: ' + position.timestamp
    );
  }

  // onError Callback receives a PositionError object
  onError(error) {
    alert('Code: ' + error.code + '\n' +
      'Message: ' + error.message);
  }

  successCallback(floorplan) {
    alert("Floor plan url: " + floorplan.url);
  }

  // addMarker() {
  //   let marker = new google.maps.Marker({
  //     map: map,
  //     animation: google.maps.Animation.DROP,
  //     position: {
  //       lat: curLat,
  //       lng: curLng
  //     }
  //   });


  //   let content = "<h4> Me! </h4>";
  //   this.addInfoWindow(marker, content);
  // }

  // addInfoWindow(marker, content) {
  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });
  //   google.map.event.addListener(marker, 'click', () => {
  //     infoWindow.open(map, marker);
  //   });
  // }

}