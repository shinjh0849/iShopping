import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TesttodoPage } from './testtodo';

@NgModule({
  declarations: [
    TesttodoPage,
  ],
  imports: [
    IonicPageModule.forChild(TesttodoPage),
  ],
})
export class TesttodoPageModule {}
