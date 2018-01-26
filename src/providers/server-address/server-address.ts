//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ServerAddressProvider {

  serverURL: any;
  constructor() {
    console.log('Hello ServerAddressProvider Provider');
    this.serverURL = 'http://ec2-52-79-125-168.ap-northeast-2.compute.amazonaws.com:3000';
  }

}
