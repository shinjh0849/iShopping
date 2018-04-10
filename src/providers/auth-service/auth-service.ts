import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ServerAddressProvider } from '../server-address/server-address';

// storage

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthServiceProvider {

  currentUser: User;
  public token: any;
  _id: any;
  _email: any;

  constructor(public http: Http, public serverAddr: ServerAddressProvider) {
    console.log('Hello AuthServiceProvider Provider');
  }

  getId() {
    if(!this._email) return 'id not found';
    return this._id;
  }

  getEmail() { 
    if(!this._email) return 'email not found';
    return this._email;
  }

  //morony
  checkAuthentication() {
    return new Promise((resolve, reject) => {

      //Load token if exists
      localStorage.get('token').then((value) => {
        this.token = value;
        
        let headers = new Headers();
        headers.append('Authorization', this.token);

        this.http.get(this.serverAddr.serverURL+ '/api/auth/protected', { headers: headers })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    });
  }

  public login(credentials) {
   
    /*
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      
      return Observable.create(observer => {
        let access = (credentials.password === "pass" && credentials.email === "email");
        this.currentUser = new User('Jeehay', 'wisdomjhkwon@gmail.com');
        observer.next(access);
        observer.complete();
      });
      */
      return new Promise((resolve, reject) => {
 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
 
        this.http.post(this.serverAddr.serverURL + '/api/auth/login', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();
            this.token = data.token;
            //this.storage.set('token', data.token);
            //localStorage.setItem('token', data.token); // 거의 안되는거나 다를바 없는거 아닌가..
            //console.log("auth Token:" + this.token);
            //console.log("user:" + data.user.email);
            //console.log("user Id: "+ data.user._id);
            //this.currentUser = new User(data.user.email, data.user.email);
            this._id = data.user._id;
            this._email = data.user.email;

            resolve(data); 
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
 
    });
  }
  

  //This is the place to make a POST request to your server and create the new user!
  public register(credentials) {
    /*
    if(credentials.email === null || credentials.password === null ) {
      return Observable.throw("Please insert credentials");
    } else {
      
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
      */
      return new Promise((resolve, reject) => {
 
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log('here');
        
        this.http.post(this.serverAddr.serverURL + '/api/auth/register', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();
            this.token = data.token;
            //this.storage.set('token', data.token);
            localStorage.setItem('token', data.token);
            console.log("Registered, Returned");
            resolve(data);
 
          }, (err) => {
            alert(err);
          });
 
    });
    }
  

  public getUserInfo() {
   /*
    return new Promise((resolve, reject) => {
 
      let headers = new Headers();
      headers.append('Authorization', this.token);
 
      this.http.get(this.ServerUrl+ '/api/auth/login', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          console.log("getUserData: " + data);
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
*/

  }

  public logout() {
    
    /*
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
    */

    //return this.storage.set('token', '');
    return localStorage.setItem('token', '');
  }
}
