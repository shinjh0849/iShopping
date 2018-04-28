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

// URI /api/clothes

  // 선택된 의류 정보를 받아온다. (Detail page에서 사용)
  getDetailDB(img) {
    return this.http.get(this.serverAddr.serverURL + '/api/clothes/' + img.select_id).map(res => res.json());
  }

  getRecommend(img, choice_num) {
    return this.http.get(this.serverAddr.serverURL + '/api/clothes/' + img.select_id + '/recommend/' + choice_num).map(res=>res.json());
  }

// URI /api/stores

  // 매장 전체 목록 받아옴 (화면에 매장 위치 띄우기 위한 용도임)
  getStores() {
    return this.http.get(this.serverAddr.serverURL + '/api/stores').map(res => res.json());
  }

  // 선택된 특정 매장 정보를 받아온다. (Detail page에서 store id 보내는 것)
  getStoreDB(store_id){
    return this.http.get(this.serverAddr.serverURL + '/api/stores/' + store_id).map(res => res.json());
  }

// URI api/users/user_id/match

  // 5개 목록 받아올때 쓴다.
  getChoice(store_id) {
    return this.http.get(this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/match/' + store_id).map(res => res.json());
  }

  // 5개의 매장 디비 사진 중 선택된 디비를 저장하는 과정 
  selectImages(select) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(
      this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/match/' + select._id, JSON.stringify(select), { headers: headers })
      .subscribe(res => {
        console.log(res.json());
      });
  }
  
// URI api/users/user_id/images

  // 유저의 전체 이미지 목록 받아올 때 사용.
  getImages() {
    return this.http.get(this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/images').map(res => res.json());
  }

  // 선택된 이미지 삭제 시 사용.
  deleteImage(img) {
    return this.http.delete(this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/images/' + img._id);
  }

  // 사진 업로드하는 과정
  uploadImage(img, desc, curLat, curLng, store_id) {

    // Destination URL
    let url = this.serverAddr.serverURL + '/api/users/' + this.auth._id + '/images';

    // File for Upload
    var targetPath = img;

    var options: FileUploadOptions = {
      fileKey: 'image',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'desc': desc, 'lat': curLat, 'lng': curLng, 'store_id': store_id }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    console.log("uplode image");
    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options);
  }
}
