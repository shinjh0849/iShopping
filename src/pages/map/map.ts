import { Component, ViewChild, ElementRef, } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence';
import { HomePage } from '../home/home';

// For camera module
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { ImagesProvider } from '../../providers/images/images';

declare let IndoorAtlas: any;
declare var google;


var map: any;

var curLat;
var curLng;
var watchID;

//화장실쪽 쯤 Geofence 좌표
var latGF = '36.103428706187714';
var lngGF = '129.38643780396947';

function addMarker(latitude, longitude) {
  let marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: {
      lat: latitude,
      lng: longitude
    }
  });
}
var markImage = {
  url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  // This marker is 20 pixels wide by 32 pixels high.
  size: new google.maps.Size(20, 32),
  // The origin for this image is (0, 0).
  origin: new google.maps.Point(0, 0),
  // The anchor for this image is the base of the flagpole at (0, 32).
  anchor: new google.maps.Point(0, 32)
};


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef;

  images: any = [];

  constructor(private imagesProvider: ImagesProvider, public auth: AuthServiceProvider, public navParams: NavParams, private modalCtrl: ModalController, private camera: Camera, public geofence: Geofence, public geolocation: Geolocation, public navCtrl: NavController) {
    this.loadMap();

    geofence.initialize().then(
      () => console.log('Geofence Initialized!'),
      (err) => alert('Geofence Fail Code: ' + err)
    )

  }

  ionViewDidEnter() {

    try {
      IndoorAtlas.fetchFloorPlanWithId('425f8c06-b1ac-4859-ab03-97976b785ec8', this.successCallback, this.onError);
    }
    catch (e) {
      alert('indoor floorplan fetch catch error: ' + e);
    }

    addMarker(latGF, lngGF);

    console.log(this.auth.token);
  }

  public logout() {
    /*
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage)
    });
    */
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
  }

  setGeofence() {

    let enterORleaveFence1 = {
      id: "ANH",
      latitude: latGF,
      longitude: lngGF,
      radius: 5,
      transitionType: 3, //1은 Enter 2는 Leave 3은 Both
      notification: {
        id: 1,
        title: 'you crossed a fence',
        text: 'you just arrived to Newton Hall',
        openAppOnClick: true
      }
    }

    this.geofence.addOrUpdate(enterORleaveFence1).then(
      () => alert('Geofence add successful!'),
      (err) => alert('Geofence add failed: ' + err)
    );

    this.geofence.onTransitionReceived().subscribe(resp => {
      alert('You entered/leaved NTH 314! : ' + resp);
    });


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
      alert('loadMap, getcurrentPosition failed: ' + err);
    });
  }

  clearWatch() {
    try {
      IndoorAtlas.clearWatch(watchID);
    }
    catch (e) {
      alert('indoor clearwatch catch code: ' + e);
    }

  }

  getPosition() {
    try {
      IndoorAtlas.getCurrentPosition(this.onGetPositionSuccess, this.onError)
    }
    catch (e) {
      alert('indoor getpostion catch code: ' + e);
    }
  }

  watchPosition() {
    try {
      watchID = IndoorAtlas.watchPosition(this.onWatchPositionSuccess, this.onError, { timeout: 30000 })
    }
    catch (e) {
      alert('indoor watch catch code: ' + e);
    }
  }

  onWatchPositionSuccess(position) {
    curLat = position.coords.latitude;
    curLng = position.coords.longitude;

    addMarker(curLat, curLng);
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
    alert('Floor plan url:' + floorplan.url);
    // alert("Floor plan url: " + floorplan.url);
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

  onSuccess() {
    alert('IndoorAtlas was successfully initialized');
    // alert('IndoorAtlas was successfully initialized');
  };

  public takePicture() {
    let sourceType = this.camera.PictureSourceType.CAMERA;
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      let modal = this.modalCtrl.create('UploadModalPage', { data: imagePath });
      modal.present();
      modal.onDidDismiss(data => {
        if (data && data.reload) {
          //this.reloadImages();
        }
      });
    }, (err) => {
      console.log('Error: ', err);
    });
  }

  viewData() {
    this.imagesProvider.getImages().subscribe(data => {
      this.images = data;
    });

    for (var i = 0; i < this.images.length; i++) {
      var obj = this.images[i];
      console.log(obj.desc);

      var mLat = obj.lat;
      var mLng = obj.lng;

      var infowindow = new google.maps.InfoWindow({
        content: '<div>' + '<h3>' + obj.desc + '</h3>' + '<img [src]=\"' + obj.url + '\">' +
          +'<p>' + 'color:' + obj.color + 'shape:' + obj.shape + '</div>'
      });

      var listMarker = new google.maps.Marker({
        map: map,
        position: {
          lat: mLat,
          lng: mLng
        },
        icon: markImage
      });
      listMarker.addListener('click', function () {
        infowindow.open(map, listMarker);
      })

    }
  }
}