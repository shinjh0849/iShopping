import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ServerAddressProvider } from '../../providers/server-address/server-address';
import { ImagesProvider } from '../../providers/images/images';

@IonicPage()
@Component({
  selector: 'page-clothing-details',
  templateUrl: 'clothing-details.html',
})
export class ClothingDetailsPage {

  img: any;
  storeImg: any = [] ;
  stores: any = [];

  constructor(
    public serverAddr: ServerAddressProvider, 
    private viewCtrl: ViewController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public imagesProvider: ImagesProvider
  ) {
    this.img = this.navParams.get('img');

    this.imagesProvider.getStoreDB(this.img).subscribe(data => {
      this.storeImg = data;
      console.log("storeimg: " + this.storeImg);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClothingDetailsPage');
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
