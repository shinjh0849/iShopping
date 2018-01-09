import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable, BehaviorSubject } from 'rxjs/Rx';


import { HomePage } from '../../pages/home/home';


export class MemberServiceProvider {

    locations: Array<{ title: any, component: any, icon: any }>;
    locationsSubject: BehaviorSubject<Array<{ title: any, component: any, icon: any }>> = new BehaviorSubject([]);
    locations$: Observable<Array<{ title: any, component: any, icon: any }>> = this.locationsSubject.asObservable();

    constructor() {
        this.locations = [
            {
                title: 'Father', component: '010-1234-0000',
                icon: 'person',
            },
            {
                title: 'Mother', component: '010-1234-0001',
                icon: 'person',
            },
            {
                title: 'Sister', component: '010-1234-0002',
                icon: 'person',
            },
            {
                title: 'Brother', component: '010-1234-0003',
                icon: 'person',
            }
        ];
        this.refresh();
    }

    getLocations() {
        return Promise.resolve(this.locations);
    }

    removeLocation(loc: { title: any, component: any, icon: any }) {
        let index = this.locations.indexOf(loc)
        if (index != -1) {
            this.locations.splice(index, 1);
            this.refresh();
        }
    }

    addLocation(loc: { title: any, component: any, icon: any }) {
        this.locations.push(loc);
        this.refresh();
    }

    refresh() {
        this.locationsSubject.next(this.locations);
        console.log(this.locations)
    }
}