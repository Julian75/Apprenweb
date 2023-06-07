import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  readonly APIUrl="http://localhost:8800/api";
  readonly direccionUrl = "http://localhost:4200/"
  // readonly direccionUrl = "http://152.200.162.154/apprenweb"
  // readonly APIUrl="http://152.200.162.154:8080/apprenweb-2.7.10/api";

  constructor() { }
}
