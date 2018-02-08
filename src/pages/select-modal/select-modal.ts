import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ImagesProvider } from '../../providers/images/images';

@IonicPage()
@Component({
  selector: 'page-select-modal',
  templateUrl: 'select-modal.html',
})
export class SelectModalPage {

  images: any = [];
  res: any;
  store_id: string;

  constructor(
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public imagesProvider: ImagesProvider
  ) {
    this.store_id = this.navParams.get("store_id");
    this.imagesProvider.getChoice(this.store_id).subscribe(data => {
      this.images = data;
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectModalPage');
  }

  select(img){
    this.imagesProvider.selectImages(img);
    alert(img.name + '이(가) 선택 되셨습니다하하핳');
    this.viewCtrl.dismiss();
  }

}
