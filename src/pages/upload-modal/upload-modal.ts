import { ImagesProvider } from './../../providers/images/images';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, Loading } from 'ionic-angular';
 
@IonicPage()
@Component({
  selector: 'page-upload-modal',
  templateUrl: 'upload-modal.html',
})
export class UploadModalPage {
  loading: Loading;
  imageData: any;
  desc: string;
 
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController, private imagesProvider: ImagesProvider) {
    this.imageData = this.navParams.get('data');
  }
 
  saveImage() {

    this.showLoading();
    this.imagesProvider.uploadImage(this.imageData, this.desc, 1, 2, 'storeA').then(res => {
      this.loading.dismiss();
      this.viewCtrl.dismiss({reload: true});
    }, err => {
      alert('uploading image failed!');
      this.dismiss();
    });
  }
 
  dismiss() {
    this.viewCtrl.dismiss();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}