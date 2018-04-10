import { Component } from '@angular/core';
import { PicHttpPage } from '../pic-http/pic-http';
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MapPage;
  tab2Root = PicHttpPage;

  constructor() {

  }
}
