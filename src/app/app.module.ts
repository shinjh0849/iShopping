//generals & modules
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

//pages
import { HomePage } from '../pages/home/home';
import { HistoryPage } from '../pages/history/history';
import { MapPage } from '../pages/map/map';
import { PicPage } from '../pages/pic/pic';
import { PicHttpPage } from '../pages/pic-http/pic-http';
import { SalePage } from '../pages/sale/sale';
import { AddClothPage } from '../pages/add-cloth/add-cloth';

//providers
import { MemberDataProvider } from '../providers/member-data/member-data';
import { ImagesProvider } from '../providers/images/images';
import { ClothesProvider } from '../providers/clothes/clothes';

//native plugins
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    PicPage,
    PicHttpPage,
    SalePage,
    HistoryPage,
    AddClothPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage,
    PicPage,
    PicHttpPage,
    SalePage,
    HistoryPage,
    AddClothPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MemberDataProvider,
    Camera,
    File,
    FileTransfer,
    FilePath,
    ClothesProvider,
    GoogleMaps,
    ImagesProvider,
  ]
})

export class AppModule { }
