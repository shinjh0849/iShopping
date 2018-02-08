import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectModalPage } from './select-modal';

@NgModule({
  declarations: [
    SelectModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectModalPage),
  ],
})
export class SelectModalPageModule {}
