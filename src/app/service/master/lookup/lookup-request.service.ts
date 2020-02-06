import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LookupRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object){
    if(data === 'g-nama-perusahaan'){
      httpBody.respondCode = 'GET-DATA-NAMA-PERUSAHAAN'
      return this.get(httpBody, options)
    }else if(data === 'g-home-url'){
      httpBody.respondCode = 'GET-MST-HOME-URL'
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}