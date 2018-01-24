import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
 
//@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { 
    email: '', 
    password: '' 
  };
  data: any;
 
  constructor(private nav: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { 

  }
 
  ionViewDidLoad() {
/* 
    this.showLoading();

    //Check if already authenticated
    this.auth.checkAuthentication().then((res) => {
        console.log("Already authorized");
        this.loading.dismiss();
        this.nav.setRoot(HomePage);
    }, (err) => {
        console.log("Not already authorized");
        this.loading.dismiss();
    });
    */

}

  public createAccount() {
    this.nav.push(RegisterPage); // 이거 막 페이지 컨트롤 잘 모르겠다.. 공부하자
  }
 
  public login() {
    this.showLoading()

    /*
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {        
        this.nav.setRoot(HomePage);
      } else {
        this.showError("Access Denied");
      }
    },
      error => {
        this.showError(error);
      });
      */
      this.auth.login(this.registerCredentials).then((result) => {
        this.loading.dismiss();
        console.log(result);
        this.data = result;
        localStorage.setItem('token', this.data.access_token);
        this.nav.setRoot(HomePage);
    }, (err) => {
        this.loading.dismiss();
        switch(err.statusText) {
          case "Unauthorized": 
          {
            this.showError("회원 정보가 없어요!");
            break;
          }
        }
        alert(err);
    
    });
  }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    //this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    }).present();

    
  }
}