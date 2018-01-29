import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ServerAddressProvider } from '../server-address/server-address';
import { AuthServiceProvider } from '../auth-service/auth-service';
 
/*
  Generated class for the ImagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImagesProvider {

  constructor(public http: Http, public auth: AuthServiceProvider, private transfer: FileTransfer, public serverAddr: ServerAddressProvider) {
    console.log('Hello ImagesProvider Provider');
  }

  getImages() {
    //console.log(this.serverAddr.serverURL);
    return this.http.get(this.serverAddr.serverURL + '/api/users/'+ this.auth._id +'/images').map(res => res.json());
  }

  deleteImage(img){
    return this.http.delete(this.serverAddr.serverURL + '/api/users/'+ this.auth._id + '/images/' + img._id);
  }

  uploadImage(img, desc){
    
    // Destination URL
    let url = this.serverAddr.serverURL + '/api/users/'+ this.auth._id + '/images';

    // File for Upload
    var targetPath = img;

    var options : FileUploadOptions = {
      fileKey: 'image',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'desc': desc , 'lat': 36.10337052095497, 'lon': 129.38652623754345}
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options);
  }
}
