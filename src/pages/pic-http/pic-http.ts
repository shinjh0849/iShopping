import { ImagesProvider } from './../../providers/images/images';
import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController, Loading } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
 
@Component({
  selector: 'page-pic-http',
  templateUrl: 'pic-http.html',
})
export class PicHttpPage {
  images: any = [];
  username = '';
  loading: Loading;

  constructor(public loadingCtrl: LoadingController, private auth: AuthServiceProvider, public navCtrl: NavController, private imagesProvider: ImagesProvider, private camera: Camera, private actionSheetCtrl: ActionSheetController, private modalCtrl: ModalController) {
    console.log('loading');
    this.showLoading();
    this.reloadImages();
    console.log('this.auth.token: ', this.auth.token);
    this.username = this.auth.getEmail();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
      //,dismissOnPageChange: true
    });
    this.loading.present();
  }

  refresh() {
    this.showLoading();
    this.reloadImages();
  }
  
  reloadImages() {
    this.imagesProvider.getImages().subscribe(data => {
      this.images = data;
      this.loading.dismiss();
      });
  }
 
  deleteImage(img) {
    this.showLoading();
    this.imagesProvider.deleteImage(img).subscribe(data => {
      this.reloadImages();
    });
  }
 
  openImage(img) {
    let modal = this.modalCtrl.create('PreviewModalPage', { img: img });
    modal.present();
  }
 
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
 
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
 
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      let modal = this.modalCtrl.create('UploadModalPage', { data: imagePath });
      modal.present();
      modal.onDidDismiss(data => {
        this.showLoading();
        if (data && data.reload) {
          this.reloadImages();
        }
      });
    }, (err) => {
      console.log('Error: ', err);
    });
  }
    public logout() {
    /*
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage)
    });
    */
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
  }
}