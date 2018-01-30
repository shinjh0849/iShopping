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
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';

//providers
import { ImagesProvider } from '../providers/images/images'; 
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ClothesProvider } from '../providers/clothes/clothes';

//native plugins
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation';
import { HistorysProvider } from '../providers/historys/historys';
import { TesttodoPage } from '../pages/testtodo/testtodo';
import { ServerAddressProvider } from '../providers/server-address/server-address';
import { HomeTestPage } from '../pages/home-test/home-test';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    PicPage,
    PicHttpPage,
    SalePage,
    HistoryPage,
    AddClothPage,
    LoginPage,
    RegisterPage,
    TabsPage,
    TesttodoPage, 
    HomeTestPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    //IonicStorageModule.forRoot()
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
    AddClothPage,
    LoginPage,
    RegisterPage,
    TabsPage,
    TesttodoPage,
    HomeTestPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    File,
    FilePath,
    FileTransfer,
    GoogleMaps,
    Geofence,
    Geolocation,

    ClothesProvider,
    ImagesProvider,
    AuthServiceProvider,
    HistorysProvider,
    ServerAddressProvider, 
  ]
})

export class AppModule { }
