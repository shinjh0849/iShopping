import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ServerAddressProvider } from '../../providers/server-address/server-address';

@IonicPage()
@Component({
  selector: 'page-clothing-details',
  templateUrl: 'clothing-details.html',
})
export class ClothingDetailsPage {

  img: any;

  constructor(public serverAddr: ServerAddressProvider, public http: Http, private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.img = this.navParams.get('img');

    console.log("response: " + this.getRecomm(this.img));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClothingDetailsPage');
  }


  close(){
    this.viewCtrl.dismiss();
  }

  getRecomm(img) {
    console.log('id: ' + img._id);
    return this.http.get(this.serverAddr.serverURL+'/images');
  }
}
