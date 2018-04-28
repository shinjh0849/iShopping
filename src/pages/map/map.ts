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


declare let IndoorAtlas: any;
declare var google;

var map: any;
var floorplanURL: any;

var curLat: number;
var curLng: number;
var watchID;
var myLocation: any;

var markers = [];

var maejang1 = [
  { lat: 36.10357, lng: 129.38620 },
  { lat: 36.10357, lng: 129.38638 },
  { lat: 36.10342, lng: 129.38638 },
  { lat: 36.10342, lng: 129.38620 },
  { lat: 36.10357, lng: 129.38620 },
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

function setMapOverlay (floorplan) {
  // Needed to calculate the coordinates for floorplan that has not yet been rotated
  var center = floorplan.center;
  var pixelsToMeters = floorplan.pixelsToMeters;
  var heightForCoordinates = floorplan.bitmapHeight / 2;
  var widthForCoordinates = floorplan.bitmapWidth / 2;

  // Amount of meters of how much the coordinates have to be moved from the centre.
  var metersHorizontal = widthForCoordinates * pixelsToMeters;
  var metersVertical = heightForCoordinates * pixelsToMeters;

  // This function returns the length of one degree of latitude and same for longitude for the given latitude
  var metersPerLatLonDegree = calculateMetersPerLatLonDegree(center[1]);

  // Amounts of how much the coordinates need to be moved from the centre
  var longitudes = metersHorizontal / metersPerLatLonDegree.metersPerLongitudeDegree;
  var latitudes = metersVertical / metersPerLatLonDegree.metersPerLatitudeDegree;

  // Calculate the new south-west and north-east coordinates
  var swCoords = new google.maps.LatLng({ lat: center[1] - latitudes, lng: center[0] - longitudes });
  var neCoords = new google.maps.LatLng({ lat: center[1] + latitudes, lng: center[0] + longitudes });

  // Get the bound of the unrotated image
  var bounds = new google.maps.LatLngBounds(swCoords, neCoords);

  // Options for custom class GroundOverlayEX
  var options = {
    // Rotates image counter-clockwise and floorplan.bearing has rotation clockwise therefore 360-[degrees] is needed
    rotate: 360 - floorplan.bearing
  };
}

  function calculateMetersPerLatLonDegree (latitude) {
    var EARTH_RADIUS_METERS = 6.371e6;
    var METERS_PER_LAT_DEGREE = EARTH_RADIUS_METERS * Math.PI / 180.0;
    var METERS_PER_LONG_DEGREE = METERS_PER_LAT_DEGREE * Math.cos(latitude / 180.0 * Math.PI);

    var metersPerLatLonDegree = { metersPerLatitudeDegree: METERS_PER_LAT_DEGREE, metersPerLongitudeDegree: METERS_PER_LONG_DEGREE };
    return metersPerLatLonDegree;
  }

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
  ) {}

  ionViewDidLoad() {
    this.fetchFloor;
    this.loadMap();
 
    console.log('auth token: ' + this.auth.token);
  }

  ionViewWillEnter(){
    
  }

  fetchFloor = new Promise(() => {
    try {
      IndoorAtlas.fetchFloorPlanWithId('57e330aa-95f5-4246-ada8-4bc388fc2a1b', this.successCallback, this.onError);
    }
    catch (e) {
      alert('indoor floorplan fetch catch error: ' + e);
    }
  });

  ionViewDidEnter() {
    this.init();
    this.watchPosition();
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
    var IAoverlay;
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      //lat: 36.10357, lng: 129.38620
      let overlayBounds = {
        north: 36.1000,
        south: 36.0000,
        east: 129.3000,
        west: 129.2000
      };

      IAoverlay = new google.maps.GroundOverlay(
        floorplanURL,
        overlayBounds);
      console.log("@@@@@@@@@@@@:" + floorplanURL);

      map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }, (err) => {
      alert('loadMap, getcurrentPosition failed: ' + err);
    }).then(() => {
      // for (var i = 0; i < this.polygon.length; i++) {
      //   this.polygon[i].setMap(map);
      // }
      polygon1.setMap(map);
      polygon2.setMap(map);
      IAoverlay.setMap(map)
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
    floorplanURL = floorplan.url;
    // setMapOverlay(floorplan);
  }

  onSuccess() {
    console.log('IndoorAtlas was successfully initialized');
  }

  getMaeJang() {

    // 이부분 매우 수정해야됨
    this.showLoading('finding maejang..');
    if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(curLat, curLng), polygon1)) {
      myLocation = 'Mae Jang 1';
    }
    else if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(curLat, curLng), polygon2)) {
      myLocation = 'Mae Jang 2';
    }
    else {
      myLocation = 'uniqlo';
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
    //this.getMaeJang();

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      this.showLoading('uploading image..');
      this.imagesProvider.uploadImage(imagePath, "desc", curLat, curLng, '5a7c10d53e57f0ee8c48f8de').then(res => {
        this.loading.dismiss();
        alert('uploading image success!');
        this.openModal('5a7c10d53e57f0ee8c48f8de');
      }, err => {
        this.loading.dismiss();
        alert('uploading image failed!');
      })
    })
  }

  openModal(store_id) {
    let modal = this.modalCtrl2.create('SelectModalPage', { store_id: store_id });
    modal.present();
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

  moreList() {
    this.navCtrl.push(PicHttpPage);
  }

  openImage(img) {
    let modal = this.modalCtrl.create('ClothingDetailsPage', { img: img });
    modal.present();
  }

  
}


