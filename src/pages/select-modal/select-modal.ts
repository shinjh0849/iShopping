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
  img_id: string;

  //test: any = [{"_id":"5b0675442522ec45cfbdfc56","shape2":"blouse","url":"http://image-kr.uniqlo.com/goods/31/11/19/90/408654003_COL_COL10_228.jpg","store_id":"5a7c10d53e57f0ee8c48f8de","p2":"0.009679245","shape1":"poloshirt","shape":"tshirt","price":12900,"size":"XS-XL","p":"0.90268856","name":"SOUNDS OF DISNEY그래픽T(반팔)","color":"PINK","p1":"0.07322248"},{"_id":"5b06754c2522ec45cfbdfc72","shape2":"longsleevetshirt","url":"http://image-kr.uniqlo.com/goods/31/11/23/97/405816002_COL_COL10_228.jpg","store_id":"5a7c10d53e57f0ee8c48f8de","p2":"0.00063925504","shape1":"crewneck","shape":"tshirt","price":19900,"size":"XS-XL","p":"0.9875907","name":"Minnie Mouse BFF그래픽T(반팔)","color":"PINK","p1":"0.010912998"},{"_id":"5b06755c2522ec45cfbdfcaa","shape2":"jersey","url":"http://image-kr.uniqlo.com/goods/31/11/24/37/409819002_COL_COL10_228.jpg","store_id":"5a7c10d53e57f0ee8c48f8de","p2":"0.17232181","shape1":"blouse","shape":"tshirt","price":12900,"size":"XS-XL","p":"0.51023537","name":"Kyo Karacho그래픽T(반팔)","color":"PINK","p1":"0.29662195"},{"_id":"5b0675642522ec45cfbdfcc6","shape2":"longsleevetshirt","url":"http://image-kr.uniqlo.com/goods/31/11/09/25/404728001_COL_COL10_228.jpg","store_id":"5a7c10d53e57f0ee8c48f8de","p2":"0.018946163","shape1":"jersey","shape":"tshirt","price":12900,"size":"XS-XL","p":"0.9092645","name":"Peanuts그래픽T(반팔)","color":"PINK","p1":"0.06373965"},{"_id":"5b0675bd2522ec45cfbdfdce","shape2":"jersey","url":"http://image-kr.uniqlo.com/goods/31/11/25/97/412468002_COL_COL10_228.jpg","store_id":"5a7c10d53e57f0ee8c48f8de","p2":"0.007985463","shape1":"crewneck","shape":"tshirt","price":19900,"size":"XS-XL","p":"0.97180724","name":"KAKAO FRIENDS그래픽T(반팔)","color":"PINK","p1":"0.008319001"}] ;

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
    this.img_id = this.navParams.get('img_id');

    this.imagesProvider.getChoice(this.store_id).subscribe(data => {
      this.images = data;
    });

    //this.images = this.test;
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

  select(img) {
    this.imagesProvider.selectImages(img);
    this.presentAlert(img.name + '이(가) 선택되었습니다!');
    this.viewCtrl.dismiss();
  }

  cancelButton() {
    let alert = this.alertCtrl.create({
      title: '확인',
      subTitle: '이미지가 삭제됩니다.',
      buttons: ['확인']
    });
    alert.present().then(res => {
      this.imagesProvider.deleteImage(this.img_id).subscribe(data => {});
    })
    this.viewCtrl.dismiss();

  }
}
