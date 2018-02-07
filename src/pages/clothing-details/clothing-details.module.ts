import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClothingDetailsPage } from './clothing-details';

@NgModule({
  declarations: [
    ClothingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ClothingDetailsPage),
  ],
})
export class ClothingDetailsPageModule {}
