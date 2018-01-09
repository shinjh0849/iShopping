import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MemberDataProvider } from '../../providers/member-data/member-data';
import { MemberServiceProvider } from '../../providers/member-service/member-service';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  dataList: Array<{ name: any, price: any, location: any }> = [];

  constructor(public ms: MemberServiceProvider, public memberData: MemberDataProvider, public navCtrl: NavController, public navParams: NavParams) {
    memberData.getMembers().then(theResult => {
      this.dataList = theResult;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

  init() {
    this.dataList = [
      {
        name: '사우스페이스 패딩', price: '100,000원',
        location: '@뉴턴 아울렛'
      },
      {
        name: '어디 어그부츠', price: '30,000원',
        location: '@어디'
      },
      {
        name: '어디옷', price: '00원',
        location: '@어디'
      },
      {
        name: '이런 옷', price: '000원',
        location: '@어디'
      }
    ];
  }

  getItems(ev) {
    this.memberData.getMembers().then(theResult => {
      this.dataList = theResult;
    })

    let queryString = ev.target.value;

    if (queryString !== undefined) {

      if (queryString.trim() == '') { return; }
      this.memberData.getFilteredMembers(queryString).then
        (theResult => {
          this.dataList = theResult;
        })
    }
  }


  deleteMember(dl) {
    console.log('deleteMember clicked')
    let index = this.dataList.indexOf(dl);
    if (index > -1) {
      this.dataList.splice(index, 1)
    }

  }
}
