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
  storeImg: any = [];
  storeDB: any ;
  recomm: any = [];
  constructor(
    public serverAddr: ServerAddressProvider, 
    private viewCtrl: ViewController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public imagesProvider: ImagesProvider
  ) {
    this.img = this.navParams.get('img');

    this.imagesProvider.getDetailDB(this.img).subscribe(data => {
      this.storeImg = data;
      //console.log("DATA: " + this.storeImg[0].store_id);
      
      this.imagesProvider.getStoreDB(this.storeImg[0].store_id).subscribe(res => {
        this.storeDB = res;
        console.log("bbbbb");
      })
    })

    // 화면에 버튼 만들어놓고 하면 좋을듯, 1: 형태만, 2:색깔만, 3:둘다
    this.imagesProvider.getRecommend(this.img, 3).subscribe(data => {
      this.recomm = data;
      console.log('recomm'+ this.recomm);
    })

    
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClothingDetailsPage');
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
