import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RekeningPerusahaanRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-rekening-perusahaan') {
      httpBody.respondCode = 'GET-DATA-REKENING-PERUSAHAAN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-rekening-perusahaan') {
      httpBody.respondCode = 'SET-DATA-REKENING-PERUSAHAAN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-rekening-perusahaan') {
      httpBody.respondCode = 'UPT-DATA-REKENING-PERUSAHAAN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-rekening-perusahaan') {
      httpBody.respondCode = 'DEL-DATA-REKENING-PERUSAHAAN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
