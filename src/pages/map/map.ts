import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';

declare let IndoorAtlas: any;
declare var google;

var curLat;
var curLng;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public geolocation: Geolocation, public navCtrl: NavController) {

  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }, (err) => {
      alert(err);
    });
  }

  getPosition() {
    try {
      IndoorAtlas.getCurrentPosition(this.onSuccess, this.onError)
    }
    catch (e) {
      console.log(e);
    }
  }

  

  onSuccess(position){

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

    return position
  }

  // onError Callback receives a PositionError object
  onError(error) {
    alert('Code: ' + error.code + '\n' +
      'Message: ' + error.message);
  }

  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: {
        lat: curLat,
        lng: curLng
      }
    });

    
    let content = "<h4> Me! </h4>";
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.map.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
}