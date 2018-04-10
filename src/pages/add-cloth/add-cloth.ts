import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@Component({
  selector: 'page-add-cloth',
  templateUrl: 'add-cloth.html',
})
export class AddClothPage {

  name: string;
  price: number;
  spot: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddClothPage');
  }

  save(): void {
    let cloth = {
      name: this.name,
      price: this.price,
      spot: this.spot
    };

    this.viewCtrl.dismiss(cloth);
  }

  close(): void {
    this.viewCtrl.dismiss();
  }
}
