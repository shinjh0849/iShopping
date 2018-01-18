import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AddClothPage } from '../add-cloth/add-cloth';
import { ClothesProvider } from '../../providers/clothes/clothes';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  dataList: Array<{ name: any, price: any, location: any }> = [];
  clothes: any;

  searchQuery: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public clothService: ClothesProvider) {
    /*
    memberData.getMembers().then(theResult => {
      this.dataList = theResult;
    })
    */

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad HistoryPage');
    this.clothService.getClothes().then((data) => {
      //console.log(data);
      this.clothes = data;
    })

  }


  getItems(ev) {
    this.clothService.getClothes().then(data => {
      this.clothes = data;
    })

    let queryString = ev.target.value;

    if (queryString !== undefined) {
      if (queryString.trim() == '') { return; }
      this.clothService.getFilteredItems(queryString).then
        (theResult => {
          this.clothes = theResult;
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

  resetList(ev) {
    this.clothService.getClothes().then(theResult => {
      this.clothes = theResult;
    })
  }
}
