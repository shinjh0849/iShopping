import { Component, ViewChild, ElementRef, } from '@angular/core';
import { NavController, ModalController, Loading } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { ImagesProvider } from '../../providers/images/images';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { PicHttpPage } from '../pic-http/pic-http';
import { ClothingDetailsPage } from '../clothing-details/clothing-details';

declare let IndoorAtlas: any;
declare var google;
var map: any;

var curLat: number;
var curLng: number;
var watchID;
var myLocation: any;

var markers = [];

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

// Adds a marker to the map and push to the array.
function addMarker(latitude, longitude) {
  let marker = new google.maps.Marker({
    map: map,
    position: {
      lat: latitude,
      lng: longitude
    },
    icon: 'assets/icon/mapCursor.png'
  });
  markers.push(marker);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

var markImage = {
  url: 'assets/imgs/shirt.png',
  // This marker is 20 pixels wide by 32 pixels high.
  size: new google.maps.Size(20, 32),
  // The origin for this image is (0, 0).
  //origin: new google.maps.Point(0, 0),
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
  showimg: any = [];
  loading: Loading;
  imgLoading: Loading;

  constructor(
    private imagesProvider: ImagesProvider,
    public auth: AuthServiceProvider,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private camera: Camera,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    
  ) {
    this.loadMap();
  }

  ionViewDidLoad() {
    try {
      IndoorAtlas.fetchFloorPlanWithId('425f8c06-b1ac-4859-ab03-97976b785ec8', this.successCallback, this.onError);
    }
    catch (e) {
      alert('indoor floorplan fetch catch error: ' + e);
    }
    console.log('auth token: ' + this.auth.token);
  }

  ionViewDidEnter() {
    this.viewData();
    this.watchPosition();
    //this.reloadImages();
  }

  ionViewDidLeave() {
    this.clearWatch();
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
      watchID = IndoorAtlas.watchPosition(this.onWatchPositionSuccess, this.onError)
    }
    catch (e) {
      alert('indoor watch catch code: ' + e);
    }
  }

  onWatchPositionSuccess(position) {
    curLat = position.coords.latitude;
    curLng = position.coords.longitude;

    deleteMarkers();
    addMarker(curLat, curLng);
  }

  onGetPositionSuccess(position) {

    curLat = position.coords.latitude;
    curLng = position.coords.longitude;

    console.log('Latitude: ' + position.coords.latitude + '\n' +
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
  }


  onSuccess() {
    console.log('IndoorAtlas was successfully initialized');
  }

  getMaeJang() {
    this.showLoading('finding maejang..');
    if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(curLat, curLng), polygon1)) {
      myLocation = 'Mae Jang 1';
    }
    else if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(curLat, curLng), polygon2)) {
      myLocation = 'Mae Jang 2';
    }
    else {
      myLocation = '찾을수 없는 매장';
    }

    this.loading.dismiss();
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

    //Gets the current store in strings
    this.getMaeJang();

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {      //   let modal = this.modalCtrl.create('UploadModalPage', { data: imagePath });
      //   modal.present();
      //   modal.onDidDismiss(data => {
      //     if (data && data.reload) {
      //       //this.reloadImages();
      //     }
      //   });
      // }, (err) => {
      //   console.log('Error: ', err);
      //});
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
      this.showLoading('uploading image..');
      this.imagesProvider.uploadImage(imagePath, "desc", curLat, curLng, myLocation).then(res => {
        this.loading.dismiss();
        alert('uploading image success!');
      }, err => {
        alert('uploading image failed!');
      })
    }
    )
  }

  viewData() {

    this.imagesProvider.getImages().subscribe(data => {
      this.images = data;
      
      for (var i = 0; i < this.images.length; i++) {
        var object = this.images[i];
        this.addMarkerList(object);
      }

      console.log("viewData Loaded!");
      console.log(this.images);

    });
  }

  addInfoWindowList(marker, obj) {
    let infoWindow = new google.maps.InfoWindow({
      content: '<div>' + '<h3>' + obj.store + '</h3>' + '<p><img src="' + obj.url + '" height="50" width="50" >'
        + '</p>' + 'color: ' + obj.color + ', shape: ' + obj.shape + '</div>'
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);
    })
  }

  addMarkerList(obj) {
    let marker = new google.maps.Marker({
      map: map,
      position: {
        lat: obj.lat,
        lng: obj.lng
      },
      icon: 'assets/imgs/shirt2.png'
    });
    this.addInfoWindowList(marker, obj);
  }



  showLoading(text) {
    this.loading = this.loadingCtrl.create({
      content: text
    });
    this.loading.present();
  }

  // reloadImages() {
  //   this.imgLoading = this.loadingCtrl.create({
  //     content: 'loading images...'
  //   });
  //   this.imgLoading.present();

  //   this.imagesProvider.getImages().subscribe(data => {
  //     console.log("reloaded images!");
  //     this.images = data;
  //     console.log(this.images.color);
  //     this.imgLoading.dismiss();
  //   });
  // }

  moreList() {
    this.navCtrl.push(PicHttpPage);
  }


  openImage(img) {
    let modal = this.modalCtrl.create('ClothingDetailsPage', { img: img });
    modal.present();
  }
}


