import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickModalPage } from './pick-modal';

@NgModule({
  declarations: [
    PickModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PickModalPage),
  ],
})
export class PickModalPageModule {}
