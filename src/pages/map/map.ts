import { Component, ViewChild, ElementRef, } from '@angular/core';
import { NavController, ModalController, Loading, Modal } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagesProvider } from '../../providers/images/images';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { PicHttpPage } from '../pic-http/pic-http';
import { SettingsPage } from '../settings/settings';
import { ClothingDetailsPage } from '../clothing-details/clothing-details';
import { Slides, Events } from 'ionic-angular';

declare let IndoorAtlas: any;
declare var google;

var map: any;

var floorplanURL: any;
var floorplanBottomLeftLat: any;
var floorplanBottomLeftLon: any;
var floorplanTopLeftLat: any;
var floorplanTopLeftLon: any;
var floorplanTopRightLat: any;
var floorplanTopRightLon: any;
var floorplanBearing: any;
var floorplanCenter: any;

var curLat: number;
var curLng: number;
var watchID;
var myLocation: any;

var markers = [];

//복도 쪽 매장
var maejang1 = [
  { lat: 36.10341, lng: 129.38663 },
  { lat: 36.10341, lng: 129.38678 },
  { lat: 36.103302, lng: 129.38678 },
  { lat: 36.103302, lng: 129.38663 },
  { lat: 36.10341, lng: 129.38663 },
];

//부쓰 쪽 매장
var maejang2 = [
  { lat: 36.10330, lng: 129.38663 },
  { lat: 36.10330, lng: 129.38678 },
  { lat: 36.10323, lng: 129.38678 },
  { lat: 36.10323, lng: 129.38663 },
  { lat: 36.10330, lng: 129.38663 },
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

  modalla: any;
  @ViewChild('map') mapElement: ElementRef;

  //어레이!! tq
  images: any = [];

  storeCoords: any = [];

  choochun: any = [];

  showimg: any = [];
  loading: Loading;
  imgLoading: Loading;

  jsonData = null;

  img: any;

  maejang_id: string;

  @ViewChild(Slides) slides: Slides;

  constructor(
    private imagesProvider: ImagesProvider,
    public auth: AuthServiceProvider,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private modalCtrl2: ModalController,
    private camera: Camera,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public events: Events,
  ) {
    events.subscribe('photo:updated', (data) => {
      this.init();
    });
  }

  ionViewDidLoad() {
    this.fetchFloor;
    this.loadMap();

    console.log('auth token: ' + this.auth.token);
    this.slides.pager = true;
    this.slides.paginationType = "fraction";
  }

  ionViewWillEnter() {
    this.init();
  }

  fetchFloor = new Promise(() => {
    try {
      IndoorAtlas.fetchFloorPlanWithId('57e330aa-95f5-4246-ada8-4bc388fc2a1b', this.successCallback, this.onError);
    }
    catch (e) {
      console.log('indoor floorplan fetch catch error: ' + e);
    }
  });

  ionViewDidEnter() {
    this.init();
    this.watchPosition();
  }

  ionViewDidLeave() {
    //this.clearWatch();
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
    var IAoverlay;
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      console.log("bearing: " + floorplanBearing);

      //lat: 36.10357, lng: 129.38620
      var overlayBounds = [
        { "lat": 36.1035, "lng": 129.38630 },
        { "lat": 36.1030, "lng": 129.38620 }
      ];

      // IAoverlay = new google.maps.GroundOverlay(floorplanURL, overlayBounds);
      // console.log("@@@@@@@@@@@@:" + Gfloorplan.url);
      // console.log("bottomLeft: " + Gfloorplan.bottomLeft);
      // console.log("center: " + Gfloorplan.center);
      // console.log("topLeft: " + Gfloorplan.topLeft);


      map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      // map.addGroundOverlay({
      //   'url': floorplanURL,
      //   'bounds': overlayBounds,
      //   'opacity': 0.5
      // }), function (groundOverlay) {
      //     groundOverlay.setBearing(floorplanBearing);
      // }

    }, (err) => {
      console.log('loadMap, getcurrentPosition failed: ' + err);
    }).then(() => {
      // for (var i = 0; i < this.polygon.length; i++) {
      //   this.polygon[i].setMap(map);
      // }
      polygon1.setMap(map);
      polygon2.setMap(map);
      // IAoverlay.setMap(map);
    })
  }

  clearWatch() {
    try {
      IndoorAtlas.clearWatch(watchID);
    }
    catch (e) {
      console.log('indoor clearwatch catch code: ' + e);
    }
  }

  getPosition() {
    try {
      IndoorAtlas.getCurrentPosition(this.onGetPositionSuccess, this.onError)
    }
    catch (e) {
      console.log('indoor getpostion catch code: ' + e);
    }
  }

  watchPosition() {
    try {
      watchID = IndoorAtlas.watchPosition(this.onWatchPositionSuccess, this.onError)
    }
    catch (e) {
      console.log('indoor watch catch code: ' + e);
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
    console.log('Code: ' + error.code + '\n' +
      'Message: ' + error.message);
  }

  successCallback(floorplan) {
    console.log('Floor plan url:' + floorplan.url);
    floorplanURL = floorplan.url;
    floorplanBottomLeftLat = floorplan.bottomLeft;
    // floorplanBottomLeftLon = floorplan.bottomLeft[0];
    floorplanTopLeftLat = floorplan.topLeft;
    // floorplanTopLeftLon = floorplan.topLeft[0];
    floorplanTopRightLat = floorplan.topRight;
    // floorplanTopRightLon = floorplan.topRight[0];
    floorplanBearing = floorplan.brearing;
    floorplanCenter = floorplan.center;
  }

  onSuccess() {
    console.log('IndoorAtlas was successfully initialized');
  }

  getMaeJang() {

    // 이부분 매우 수정해야됨
    this.showLoading('finding maejang..');
    if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(curLat, curLng), polygon1)) {
      this.maejang_id = '5ae675567d0b98e5674ac60f';
      myLocation = '5ae675567d0b98e5674ac60f';
    }
    else if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(curLat, curLng), polygon2)) {
      this.maejang_id = '5a7c10d53e57f0ee8c48f8de';
      myLocation= '5a7c10d53e57f0ee8c48f8de';
    }
    else {
      this.maejang_id = '5a7c10d53e57f0ee8c48f8de';
      myLocation = '5a7c10d53e57f0ee8c48f8de';
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
    this.camera.getPicture(options).then((imagePath) => {
      //this.showLoading('uploading image..');
      let LoadCtrl = this.loadingCtrl.create({
        content: 'uploading image..'
      });
      LoadCtrl.present();
      this.imagesProvider.uploadImage(imagePath, "desc", curLat, curLng, this.maejang_id).then(res => {
        console.log("ABC: "+ res.response);
        this.img = res.response;
        LoadCtrl.dismiss();
        console.log("aa" + this.maejang_id);
        console.log("bb" + myLocation);


        LoadCtrl.onDidDismiss(res => {
          console.log('uploading image success!');
          this.openModal(this.maejang_id, this.img );
          console.log("this img id:" + this.img);
          //this.events.publish('photo:updated', {});
        })

      }, err => {
        this.loading.dismiss();
        console.log('uploading image failed!');
      });
    })
  }

  openModal(store_id, img_id) {
    let modal = this.modalCtrl2.create('SelectModalPage', { store_id: store_id, img_id: img_id});
    modal.present();
    console.log("openModal Function");
  }

  init() {

    // this.imagesProvider.getStores().subscribe(data => {
    //   stores = data;
    //   console.log('' + stores[0].coords);

    //   for (var i = 0; i < this.stores.length; i++) {

    //     this.polygon[i] = new google.maps.Polygon({
    //       paths: this.stores[i].coords,
    //       strokeColor: '#FF0000',
    //       strokeOpacity: 0.8,
    //       strokeWeight: 2,
    //       fillColor: '#FF0000',
    //       fillOpacity: 0.35
    //     });

    //   }

    //   getPoly(stores);
    // });

    // console.log('' + polygon);
    this.imagesProvider.getImages().subscribe(data => {
      this.images = data;

      for (var i = 0; i < this.images.length; i++) {
        var object = this.images[i];
        this.addMarkerList(object);
      }
      console.log("init Loaded!");
      // console.log(this.images);
    });
  }


  addInfoWindowList(marker, obj) {
    let infoWindow = new google.maps.InfoWindow({
      content: '<div>' + '<p><img src="' + obj.url + '" height="50" width="50" (click)="openImage(obj)">' + '</p>' + '</div>'
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

  moreList() {
    this.navCtrl.push(PicHttpPage);
  }

  openImage(img) {
    let modal = this.modalCtrl.create('ClothingDetailsPage', { img: img });
    modal.present();
  }


}


