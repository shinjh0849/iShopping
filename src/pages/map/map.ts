import { Component, ViewChild, ElementRef, } from '@angular/core';
import { NavController, ModalController, Loading } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HomePage } from '../home/home';

// For camera module
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { ImagesProvider } from '../../providers/images/images';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

declare let IndoorAtlas: any;
declare var google;

var map: any;

var curLat: number;
var curLng: number;
var watchID;

var myLocation: any;

//화장실쪽 쯤 Geofence 좌표  , 

var maejang1 = [
  { lat: 36.10347, lng: 129.38645 },
  { lat: 36.10347, lng: 129.38653 },
  { lat: 36.10339, lng: 129.38653 },
  { lat: 36.10339, lng: 129.38645 },
  { lat: 36.10347, lng: 129.38645 },
];

var maejang2 = [
  { lat: 36.10341, lng: 129.38665 },
  { lat: 36.10341, lng: 129.38673 },
  { lat: 36.10333, lng: 129.38673 },
  { lat: 36.10333, lng: 129.38665 },
  { lat: 36.10341, lng: 129.38665 },
];

var polygon1 = new google.maps.Polygon({
  paths: maejang1,
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35
});

var polygon2 = new google.maps.Polygon({
  paths: maejang2,
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35
});

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
  loading: Loading;
  
  constructor(
    private imagesProvider: ImagesProvider,
    public auth: AuthServiceProvider,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private camera: Camera,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {
    this.loadMap();
  }

  ionViewDidEnter() {

    try {
      IndoorAtlas.fetchFloorPlanWithId('425f8c06-b1ac-4859-ab03-97976b785ec8', this.successCallback, this.onError);
    }
    catch (e) {
      alert('indoor floorplan fetch catch error: ' + e);
    }

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
    }).then(() => {
      polygon1.setMap(map);
      polygon2.setMap(map);
    })

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

  onError(error) {
    alert('Code: ' + error.code + '\n' +
      'Message: ' + error.message);
  }

  successCallback(floorplan) {
    console.log('Floor plan url:' + floorplan.url);
    // alert("Floor plan url: " + floorplan.url);
  }


  onSuccess() {
    alert('IndoorAtlas was successfully initialized');
  }

  getMaeJang(){
    
    if(google.maps.geometry.poly.containsLocation({curLat, curLng}, polygon1)){
      myLocation = 'maejang1';
    }
    else if(google.maps.geometry.poly.containsLocation({curLat, curLng}, polygon2)){
      myLocation = 'maejang2';
    }
    else{
      myLocation = '찾을수 없는 매장';
    }
    
  }

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

    //Gets the current location
    this.getMaeJang();

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
    //   let modal = this.modalCtrl.create('UploadModalPage', { data: imagePath });
    //   modal.present();
    //   modal.onDidDismiss(data => {
    //     if (data && data.reload) {
    //       //this.reloadImages();
    //     }
    //   });
    // }, (err) => {
    //   console.log('Error: ', err);
    //});
    this.showLoading();
    this.imagesProvider.uploadImage(imagePath, "desc", curLat, curLng, myLocation).then(res=> {
      this.loading.dismiss();
      alert('uploading success!');
    }, err => {
      alert('uploading image failed!');
    })
    }
  )
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
        content: '<div>' + '<h3>' + obj.desc + '</h3>' + '<p><img src="' + obj.url + '" height="50" width="50"/>' +
          +'<p><br>' + 'color:' + obj.color + 'shape:' + obj.shape + '</div>'
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
      });

    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Uploading Image..'
    });
    this.loading.present();
  }
}