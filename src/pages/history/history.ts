import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { MemberDataProvider } from '../../providers/member-data/member-data';
import { AddClothPage } from '../add-cloth/add-cloth';
import { ClothesProvider } from '../../providers/clothes/clothes';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  dataList: Array<{ name: any, price: any, location: any }> = [];
  clothes: any;

  constructor(public memberData: MemberDataProvider, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public clothService: ClothesProvider) {
    /*
    memberData.getMembers().then(theResult => {
      this.dataList = theResult;
    })
    */

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad HistoryPage');
    this.clothService.getClothes().then((data) => {
      console.log(data);
      this.clothes = data;
    })

  }
/*
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
*/

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


  deleteMember(cloth) {

    console.log('deleteMember clicked')

    let index = this.clothes.indexOf(cloth);
    if (index > -1) {
      this.clothes.splice(index, 1)
    }

    this.clothService.deleteCloth(cloth._id);

  }

  zzim() {
   let modal = this.modalCtrl.create(AddClothPage);

   modal.onDidDismiss(cloth => {
     if(cloth) {
       this.clothes.push(cloth);
       this.clothService.createCloth(cloth);
     }
   })

   modal.present();

  }
}
