import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { ServerAddressProvider } from '../server-address/server-address';
 
@Injectable()
export class HistorysProvider {
 
  userID : any;
  constructor(public http: Http, public auth: AuthServiceProvider, public serverAddr: ServerAddressProvider) {

  }
 
  getTodos(){
 
    return new Promise((resolve, reject) => {
 
      let headers = new Headers();
      console.log('getTodos Token:' , this.auth.token, '// id:', this.auth.getId());
      headers.append('Authorization', this.auth.token);
    
      this.http.get(this.serverAddr.serverURL+'/api/users/'+this.auth.getId()+'/todos', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
 
  }
 
  createTodo(todo){
 
    return new Promise((resolve, reject) => {
 
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.auth.token);
 
      this.http.post(this.serverAddr.serverURL+'/api/users/'+this.auth.getId()+'/todos', JSON.stringify(todo), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
 
    });
 
  }
 
  deleteTodo(id){
 
    return new Promise((resolve, reject) => {
 
        let headers = new Headers();
        headers.append('Authorization', this.auth.token);
 
        this.http.delete(this.serverAddr.serverURL+'/api/users/'+this.auth.getId()+'/todos/' + id, {headers: headers}).subscribe((res) => {
          console.log("deleted!");
          resolve(res);
        }, (err) => {
          console.log("delete failed!");
            reject(err);
        });   
 
    });
 
  }
 
}