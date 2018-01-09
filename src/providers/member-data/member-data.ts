import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class MemberDataProvider {

  data: any = null;

  constructor(public http: Http) {
    console.log('Hello MemberDataProvider Provider');
  }

  load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get('assets/data/data.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  getMembers() {
    return this.load().then(data => {
      return data;
    });
  }

  getFilteredMembers(queryString) {
    return this.load().then(member => {
      let theFilteredMembers: any = [];
      for (let theMember of member) {
        if (theMember.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1) {
          theFilteredMembers.push(theMember);
        }
      }
      return theFilteredMembers;
    });
  }
}
