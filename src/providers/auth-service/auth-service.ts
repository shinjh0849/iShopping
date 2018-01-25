import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

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
  ServerUrl: string;

  constructor(public http: Http) {
    this.ServerUrl = 'http://ec2-52-79-125-168.ap-northeast-2.compute.amazonaws.com:3000'; // 매일 바뀐다 .. (눈물을 닦으며)
    console.log('Hello AuthServiceProvider Provider');
  }

  //morony
  checkAuthentication() {
    return new Promise((resolve, reject) => {

      //Load token if exists
      localStorage.get('token').then((value) => {
        this.token = value;
        
        let headers = new Headers();
        headers.append('Authorization', this.token);

        this.http.get(this.ServerUrl+ '/api/auth/protected', { headers: headers })
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
 
        this.http.post(this.ServerUrl + '/api/auth/login', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();
            this.token = data.token;
            //this.storage.set('token', data.token);
            localStorage.setItem('token', data.token);
            console.log("auth Token:" + this.token);
            console.log("user:" + data.user.email);
            this.currentUser = new User(data.user.email, data.user.email);

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
 
        this.http.post(this.ServerUrl + '/api/auth/register', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
 
            let data = res.json();
            this.token = data.token;
            //this.storage.set('token', data.token);
            localStorage.setItem('token', data.token);
            console.log("Registered, Returned");
            resolve(data);
 
          }, (err) => {
            reject(err);
          });
 
    });
    }
  

  public getUserInfo() {
    return this.currentUser;
   
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
