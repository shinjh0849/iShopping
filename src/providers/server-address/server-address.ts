//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ServerAddressProvider {

  serverURL: any;
  constructor() {
    console.log('Hello ServerAddressProvider Provider');
    this.serverURL = 'http://ec2-13-124-217-144.ap-northeast-2.compute.amazonaws.com:3000';
  }

}
