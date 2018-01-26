import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthServiceProvider } from '../auth-service/auth-service';
 
@Injectable()
export class HistorysProvider {
 
  userID : any;
  constructor(public http: Http, public auth: AuthServiceProvider) {

  }
 
  getTodos(){
 
    return new Promise((resolve, reject) => {
 
      let headers = new Headers();
      console.log('getTodos Token:' , this.auth.token, '// id:', this.auth.getId());
      headers.append('Authorization', this.auth.token);
    
      this.http.get('http://ec2-52-79-125-168.ap-northeast-2.compute.amazonaws.com:3000/api/users/'+this.auth.getId()+'/todos', {headers: headers})
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
 
      this.http.post('http://ec2-52-79-125-168.ap-northeast-2.compute.amazonaws.com:3000/api/users/'+this.auth.getId()+'/todos', JSON.stringify(todo), {headers: headers})
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
 
        this.http.delete('http://ec2-52-79-125-168.ap-northeast-2.compute.amazonaws.com:3000/api/users/'+this.auth.getId()+'/todos/' + id, {headers: headers}).subscribe((res) => {
            resolve(res);
        }, (err) => {
            reject(err);
        });   
 
    });
 
  }
 
}