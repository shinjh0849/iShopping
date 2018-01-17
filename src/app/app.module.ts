//modules
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
import { SalePage } from '../pages/sale/sale';

//providers
import { MemberDataProvider } from '../providers/member-data/member-data';
import { MemberServiceProvider } from '../providers/member-service/member-service';

//native plugins
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { ClothesProvider } from '../providers/clothes/clothes';
import { AddClothPage } from '../pages/add-cloth/add-cloth';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    PicPage,
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
    SalePage,
    HistoryPage,
    AddClothPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MemberDataProvider,
    MemberServiceProvider, 
    Camera,
    File,
    FileTransfer,
    FilePath,
    ClothesProvider,
  ]
})

export class AppModule {}
