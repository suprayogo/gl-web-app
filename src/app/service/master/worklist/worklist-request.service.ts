import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorklistRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-worklist') {
      httpBody.respondCode = 'GET-DATA-WORKLIST'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-worklist') {
      httpBody.respondCode = 'APR-DATA-WORKLIST'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } 
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}