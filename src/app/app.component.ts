import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { ClothesProvider } from '../providers/clothes/clothes';
import { LoginPage } from '../pages/login/login';
import { Geofence } from '@ionic-native/geofence';
import { MapPage } from '../pages/map/map';
import { TabsPage } from '../pages/tabs/tabs';
import { PicHttpPage } from '../pages/pic-http/pic-http';
import { HomeTestPage } from '../pages/home-test/home-test';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

declare let IndoorAtlas: any;


@Component({
  templateUrl: 'app.html',
  providers: [ClothesProvider]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;

  username = '';
  //pages: Array<{ title: string, component: any }>;

  constructor(private auth: AuthServiceProvider, platform: Platform) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.private alertCtrl: AlertController, 
      try {
        IndoorAtlas.initialize(this.initOnSuccess, this.onError, {
          key: '7c7a357e-cb5d-4e5c-a7f9-8062a371488d',
          secret: 'sYAbkVh3rn/zMujKQJSPxgBLCRxhEaA+aV6WviRiag21xRNACmQpitf6zKOSQtAD3BJj0sQazilwq85I1QXLRei5YXCjjVFY7oJePaisI7U0Cv7DHJ4QvOaaHW0nqw=='
        })
      }
      catch (e) {
        alert('IA Init error\n' + e);
      }
    });

    
    this.username = auth.getEmail();

  }

  // onSuccess Callback
  initOnSuccess() {
    console.log('IndoorAtlas was successfully initialized');
    // alert('IndoorAtlas was successfully initialized');
  };

  // onError Callback receives a PositionError object
  onError(error) {
    alert('Code: ' + error.code + '\n' +
      'Message: ' + error.message);
  };

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}