import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
 
@IonicPage()
@Component({
  selector: 'page-preview-modal',
  templateUrl: 'preview-modal.html',
})
export class PreviewModalPage {
  img: any;
  res: any;

  constructor(public http: Http, public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
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
    return this.http.get('http://ec2-52-79-58-177.ap-northeast-2.compute.amazonaws.com:3000/images');
  }
 
}