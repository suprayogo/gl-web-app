import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderSetterService {

  httpHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    // 'X-Authorization': 'sm6yRcrD71wQTTo0ktlAqF4hi5Tn7F6t',
    'Authorization': localStorage.getItem('token') == null? "" : localStorage.getItem('token')
  });

  constructor() { }

  getHeader() {
    let x = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token') == null? "" : localStorage.getItem('token')
    })
    return x
  }
}