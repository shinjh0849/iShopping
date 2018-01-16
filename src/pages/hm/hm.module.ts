import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HmPage } from './hm';

@NgModule({
  declarations: [
    HmPage,
  ],
  imports: [
    IonicPageModule.forChild(HmPage),
  ],
})
export class HmPageModule {}
