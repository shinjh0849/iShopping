import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';


@IonicPage()
@Component({
  selector: 'page-pick-modal',
  templateUrl: 'pick-modal.html',
})
export class PickModalPage {

  images: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.images = this.navParams.get('res');
    alert('ionViewDidLoad PickModalPage!! ㅗ,.ㅗ');
  }


  close() {
    this.viewCtrl.dismiss();
  }

}
