import { Component } from '@angular/core';
import { PicHttpPage } from '../pic-http/pic-http';
import { HistoryPage } from '../history/history';
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
