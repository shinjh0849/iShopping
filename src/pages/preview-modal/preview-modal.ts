import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ServerAddressProvider } from '../../providers/server-address/server-address';
 
@IonicPage()
@Component({
  selector: 'page-preview-modal',
  templateUrl: 'preview-modal.html',
})
export class PreviewModalPage {
  img: any;
  res: any;

  constructor(public http: Http, public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, public serverAddr: ServerAddressProvider) {
    this.img = this.navParams.get('img');
    //this.getRecomm(this.img);
    alert("response: " + this.getRecomm(this.img));
    console.log(this.getRecomm(this.img));
  }
 
  close() {
    this.viewCtrl.dismiss();
  }

  getRecomm(img) {
    console.log('id: ' + img._id);
    return this.http.get(this.serverAddr.serverURL+'/images');
  }
 
}