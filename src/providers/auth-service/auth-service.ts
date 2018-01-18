import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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

  constructor() {
    console.log('Hello AuthServiceProvider Provider');
  }

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        let access = (credentials.password === "pass" && credentials.email === "email");
        this.currentUser = new User('Jeehay', 'wisdomjhkwon@gmail.com');
        observer.next(access);
        observer.complete();
      });
    }
  }

  //This is the place to make a POST request to your server and create the new user!
  public register(credentials) {
    if(credentials.email === null || credentials.password === null ) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
