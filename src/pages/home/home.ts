import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';
import { PicPage } from '../pic/pic';
import { SalePage } from '../sale/sale';
import { HistoryPage } from '../history/history';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentLocation: String;

  constructor(public navCtrl: NavController) {
    this.currentLocation = "뉴턴 아울렛";
  }

  ionViewDidLoad(){
    console.log("ionViewDidLoad HomePage");
  }

  toMapPage(){
    this.navCtrl.push(MapPage, {}, { animate: false });
  }

  toPicPage(){
    this.navCtrl.push(PicPage, {}, { animate: false });
  }

  toSalePage(){
    this.navCtrl.push(SalePage, {}, { animate: false });
  }

  toHistoryPage(){
    this.navCtrl.push(HistoryPage, {}, { animate: false });
  }
}
