import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
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
    public imagesProvider: ImagesProvider,
    public alertCtrl: AlertController
  ) {
    console.log("select modal page");
    this.store_id = this.navParams.get('store_id');
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

  presentAlert(txt) {
    let alert = this.alertCtrl.create({
      title: '선택 완료!',
      subTitle: txt,
      buttons: ['확인']
    });
    alert.present();
  }
  
  select(img){
    this.imagesProvider.selectImages(img);
    this.presentAlert(img.name + '이(가) 선택 되셨습니다하하핳');
    this.viewCtrl.dismiss();
  }

}
