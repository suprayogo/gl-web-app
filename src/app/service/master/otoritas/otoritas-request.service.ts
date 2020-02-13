import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OtoritasRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-otoritas') {
      httpBody.respondCode = 'GET-DATA-OTORITAS'
      return this.get(httpBody, options)
    } 
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
