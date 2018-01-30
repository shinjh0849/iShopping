import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ServerAddressProvider } from '../server-address/server-address';
import { AuthServiceProvider } from '../auth-service/auth-service';

declare let IndoorAtlas: any;

var curLat: number;
var curLng: number;

@Injectable()
export class ImagesProvider {

  constructor(public http: Http, public auth: AuthServiceProvider, private transfer: FileTransfer, public serverAddr: ServerAddressProvider) {
    console.log('Hello ImagesProvider Provider');
  }

  getImages() {
    //console.log(this.serverAddr.serverURL);
    return this.http.get(this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/images').map(res => res.json());
  }

  deleteImage(img) {
    return this.http.delete(this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/images/' + img._id);
  }

  uploadImage(img, desc, curLat, curLng, store) {

    // Destination URL
    let url = this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/images';

    // File for Upload
    var targetPath = img;

    this.getPosition();

    var options: FileUploadOptions = {
      fileKey: 'image',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'desc': desc, 'lat': curLat, 'lng': curLng, 'store': store }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options);
  }

  getPosition() {
    try {
      IndoorAtlas.getCurrentPosition(this.onGetPositionSuccess, this.onError)
    }
    catch (e) {
      alert('indoor getpostion catch code: ' + e);
    }
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
}
