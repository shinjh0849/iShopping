import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

const options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE
}

@Component({
  selector: 'page-pic',
  templateUrl: 'pic.html',
})


export class PicPage {

  constructor(private camera: Camera, public navCtrl: NavController, public navParams: NavParams) {
    
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PicPage');
    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log("error occourred during getPicture");
    })
  }

}
