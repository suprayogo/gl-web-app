import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartemenRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
<<<<<<< HEAD:src/app/service/master/departemen/departemen-request.service.ts
    if (data === 'g-departemen') {
      httpBody.respondCode = 'GET-DATA-DEPARTEMEN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-departemen') {
      httpBody.respondCode = 'SET-DATA-DEPARTEMEN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-departemen') {
      httpBody.respondCode = 'UPT-DATA-DEPARTEMEN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-departemen') {
      httpBody.respondCode = 'DEL-DATA-DEPARTEMEN'
=======
    if (data === 'g-user') {
      httpBody.respondCode = 'GET-DATA-USER'
      return this.get(httpBody, options)
    } else if (data === 'g-user-otoritas') {
      httpBody.respondCode = 'GET-DATA-USER-OTORITAS'
      return this.get(httpBody, options)
    } else if (data === 'g-user-belum-ada-otoritas') {
      httpBody.respondCode = 'GET-DATA-USER-OTORITAS-NOT-SET'
      return this.get(httpBody, options)
    } else if (data === 'g-user-perusahaan') {
      httpBody.respondCode = 'GET-DATA-USER-PERUSAHAAN'
      return this.get(httpBody, options)
    } else if (data === 'i-user-otoritas') {
      httpBody.respondCode = 'SET-DATA-USER-OTORITAS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-user-otoritas') {
      httpBody.respondCode = 'UPT-DATA-USER-OTORITAS'
>>>>>>> billy:src/app/service/master/user/user-request.service.ts
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}