import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthSetterService {

  auth: Object = {
    user_id: localStorage.getItem('user_id') == null? "" : localStorage.getItem('user_id')
  }

  constructor() { }

  getAuth() {
    let x = {
      user_id: localStorage.getItem('user_id') == null? "" : localStorage.getItem('user_id')
    }
    return x
  }
}