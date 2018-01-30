import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';
import { PicHttpPage } from '../pic-http/pic-http';




@Component({
  selector: 'page-home-test',
  templateUrl: 'home-test.html',
})
export class HomeTestPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeTestPage');
  }

  toMapPage(){
    this.navCtrl.push(MapPage);
  }

  toPicHttpPage(){
    this.navCtrl.push(PicHttpPage);
  }
}
