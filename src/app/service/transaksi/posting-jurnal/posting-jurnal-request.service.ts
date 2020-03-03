import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostingJurnalRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-posting') {
      httpBody.respondCode = 'GET-DATA-POSTING'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-jurnal-belum-posting') {
      httpBody.respondCode = 'GET-DATA-JURNAL-BELUM-POSTING'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-posting-jurnal') {
      httpBody.respondCode = 'SET-POSTING-JURNAL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-unposting-jurnal') {
      httpBody.respondCode = 'SET-UNPOSTING-JURNAL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
