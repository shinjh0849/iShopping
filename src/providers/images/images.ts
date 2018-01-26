import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ServerAddressProvider } from '../server-address/server-address';
 
/*
  Generated class for the ImagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImagesProvider {

  constructor(public http: Http, private transfer: FileTransfer, public serverAddr: ServerAddressProvider) {
    console.log('Hello ImagesProvider Provider');
  }

  getImages() {
    return this.http.get(this.serverAddr.serverURL + '/images').map(res => res.json());
  }

  deleteImage(img){
    return this.http.delete(this.serverAddr.serverURL + '/images/' + img._id);
  }

  uploadImage(img, desc){
    
    // Destination URL
    let url = this.serverAddr.serverURL + '/images';

    // File for Upload
    var targetPath = img;

    var options : FileUploadOptions = {
      fileKey: 'image',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'desc': desc }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options);
  }
}
