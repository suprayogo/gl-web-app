import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
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
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    	console.log('HTTP POST request to:', this.url);
		console.log('HTTP Body PART1:', httpBody);
		console.log('HTTP Options:', options);
    return this.http.post(this.url, httpBody, options);
  }a
}