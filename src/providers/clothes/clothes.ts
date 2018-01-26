//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ServerAddressProvider } from '../server-address/server-address';

@Injectable()
export class ClothesProvider {

  data: any = null; 

  ServerUrl: string;
  
  constructor(public http: Http, public serverAddr: ServerAddressProvider) {
    this.ServerUrl = this.serverAddr.serverURL+'/history'; // 매일 바뀐다 .. (눈물을 닦으며)
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
 
  getSearch() {
    return this.getClothes().then(data => {
      return data;
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

  getFilteredItems(queryString) {
    return this.getSearch().then(Items => {
      let theFilteredItems: any = [];
      for (let theItem of Items) {
        
        if(theItem.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1) {
          theFilteredItems.push(theItem);
        }
        
      }
      return theFilteredItems;
    });
  }
}
