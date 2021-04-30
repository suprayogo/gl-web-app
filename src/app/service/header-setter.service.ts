import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderSetterService {
  
  httpHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token') == null ? "" : localStorage.getItem('token')
  });

  constructor() { }

  getHeader(token?: any) {
    let x = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token === undefined ? localStorage.getItem('token') == null ? "" : localStorage.getItem('token') : token
    })
    return x
  }
}