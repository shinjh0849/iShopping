import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ClothesProvider } from '../providers/clothes/clothes';
import { LoginPage } from '../pages/login/login';
import { Geofence } from '@ionic-native/geofence';
import { MapPage } from '../pages/map/map';
import { TabsPage } from '../pages/tabs/tabs';
import { PicHttpPage } from '../pages/pic-http/pic-http';

declare let IndoorAtlas: any;

@Component({
  templateUrl: 'app.html',
  providers: [ClothesProvider]
})

export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.private alertCtrl: AlertController, 
      statusBar.styleDefault();
      splashScreen.hide();

      try {
        IndoorAtlas.initialize(this.onSuccess, this.onError, {
          key: '554846d6-302c-4e66-ba6c-a3d576fd4c39',
          secret: 'QQ2Annx4hBH/Hf2/CHhRUDW49ImXnYE79n0tTTz6alTTFmy9aH8HNzwYkbs88M1zUJq32dxA4CPedJ4KCOpw4AvLzJebCZxHJzLQeyEWO5gMoQ+bu80XPu5lRqkhbg=='
        })
      }
      catch (e) {
        alert('catch error: ' + e);
      }
      
    });
  }

  // onSuccess Callback
  onSuccess() {
    alert('IndoorAtlas was successfully initialized');
    // alert('IndoorAtlas was successfully initialized');
  };

  // onError Callback receives a PositionError object
  onError(error) {
    alert('Code: ' + error.code + '\n' +
      'Message: ' + error.message);
  };

}