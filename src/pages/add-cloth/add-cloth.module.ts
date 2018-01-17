import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddClothPage } from './add-cloth';

@NgModule({
  declarations: [
    AddClothPage,
  ],
  imports: [
    IonicPageModule.forChild(AddClothPage),
  ],
})
export class AddClothPageModule {}
