import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
 
//@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = { 
    email: '', 
    password: '' 
  };
 
  loading: any;
  
  constructor(private nav: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, public loadingCtrl: LoadingController) { 
  }

  register(){
    console.log("register");

    this.showLoader();
 
    this.auth.register(this.registerCredentials).then((result) => {
      console.log("inRegi");
      this.loading.dismiss();
      console.log(result);
      this.nav.popToRoot();
    }, (err) => {
        this.loading.dismiss();
    });
 
  }
 
  showLoader(){
 
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
 
    this.loading.present();
 
  }
 

 /*
  public register() {
    this.auth.register(this.registerCredentials).subscribe(success => {
      if (success) {
        this.createSuccess = true;
        this.showPopup("Success", "Account created.");
      } else {
        this.showPopup("Error", "Problem creating account.");
      }
    },
      error => {
        this.showPopup("Error", error);
      });
  }
 
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            //console.log("showPopup Page");
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }
  */
}