//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ClothesProvider {

  data: any; 

  ServerUrl: string;
  
  constructor(public http: Http) {
    this.ServerUrl = 'http://ec2-13-125-138-255.ap-northeast-2.compute.amazonaws.com:80/history'; // 매일 바뀐다 .. (눈물을 닦으며)
    console.log('Hello ClothesProvider Provider');
    this.data = null;
  }

  getClothes(){
 
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    return new Promise(resolve => {
 
      this.http.get(this.ServerUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
 
  }
 
  createCloth(cloth){
 
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
 
    this.http.post(this.ServerUrl, JSON.stringify(cloth), {headers: headers})
      .subscribe(res => {
        console.log(res.json());
      });
 
  }
 
  deleteCloth(id){
 
    this.http.delete(this.ServerUrl + '/' + id).subscribe((res) => {
      console.log(res.json());
    });   
 
  }
}
