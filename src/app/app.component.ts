import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

declare let IndoorAtlas: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(private alertCtrl: AlertController, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      IndoorAtlas.initialize(this.onSuccess, this.onError, { 
        key: '694725c5-ee99-4df8-bdca-5a99acd97ced', 
        secret: 'vGysPwqifKc8lNXtclLALN8BXKNLXeRrugroW3aDdGA0XYRRt1rfNlnBtSfid3KBCoVVBRtbPvI5Jb7qJg0cS4XvtSleQHm1NoP/adLNxx1Oe0DFve1hkGdiTxAh6w==' })
    });
  }

  // onSuccess Callback
  onSuccess() {
    let alert = this.alertCtrl.create({
      title: 'IA initialization',
      subTitle: 'IndoorAtlas was successfully initialized!!',
      buttons: ['Dismiss']
    });
    alert.present();
  };

  // onError Callback receives a PositionError object
  onError(error) {
    let alert = this.alertCtrl.create({
      title: 'IA initialization failed...',
      subTitle: 'Code: ' + error.code + '\n' + 'Message: ' + error.message,
      buttons: ['Dismiss']
    });
    alert.present();
  };

}

