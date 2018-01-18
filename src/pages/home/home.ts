import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';
import { PicPage } from '../pic/pic';
import { SalePage } from '../sale/sale';
import { HistoryPage } from '../history/history';
import { PicHttpPage } from '../pic-http/pic-http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currentLocation: String;
  username = '';
  email = '';

  constructor(public navCtrl: NavController, private auth: AuthServiceProvider) {
    this.currentLocation = "뉴턴 아울렛";
    let info = this.auth.getUserInfo();
    this.username = info['name'];
    this.email = info['email'];
    console.log('username:'+this.username + '/ email:'+this.email);
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage)
    });
  }
  ionViewDidLoad(){
    console.log("ionViewDidLoad HomePage");
  }

  toMapPage(){
    this.navCtrl.push(MapPage, {}, { animate: false });
  }

  toPicPage(){
    this.navCtrl.push(PicHttpPage, {}, { animate: false });
  }

  toSalePage(){
    this.navCtrl.push(SalePage, {}, { animate: false });
  }

  toHistoryPage(){
    this.navCtrl.push(HistoryPage, {}, { animate: false });
  }
}
