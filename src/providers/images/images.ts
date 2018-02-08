import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { 
  FileTransfer, 
  FileUploadOptions, 
  FileTransferObject
} from '@ionic-native/file-transfer';
import { ServerAddressProvider } from '../server-address/server-address';
import { AuthServiceProvider } from '../auth-service/auth-service';

declare let IndoorAtlas: any;

var curLat: number;
var curLng: number;

@Injectable()
export class ImagesProvider {

  constructor(public http: Http,
    public auth: AuthServiceProvider,
    private transfer: FileTransfer,
    public serverAddr: ServerAddressProvider
  ) {
    console.log('Hello ImagesProvider Provider');
  }

  selectImages(select) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(
      this.serverAddr.serverURL + '/api/users/'
      + this.auth._id + '/match/' + select._id,
      JSON.stringify(select),
      { headers: headers })
      .subscribe(res => {
        console.log(res.json());
      });
  }

  getStores() {
    return this.http.get(this.serverAddr.serverURL + '/api/stores').map(res => res.json());
  }

  getStoreDB(img){
    return this.http.get(this.serverAddr.serverURL + '/api/stores/' + img.store + '/clothes/' + img.select_id).map(res => res.json());
  }

  getImages() {
    //console.log(this.serverAddr.serverURL);
    return this.http.get(this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/images').map(res => res.json());
  }

  deleteImage(img) {
    return this.http.delete(this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/images/' + img._id);
  }

  getChoice(storeName) {
    return this.http.get(this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/match/' + storeName).map(res => res.json());
  }

  uploadImage(img, desc, curLat, curLng, store) {

    // Destination URL
    let url = this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/images';

    // File for Upload
    var targetPath = img;

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
}
