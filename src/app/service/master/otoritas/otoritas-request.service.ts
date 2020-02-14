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
<<<<<<< HEAD
    } else if (data === 'g-detail-otoritas') {
      httpBody.respondCode = 'GET-DATA-DETAIL-OTORITAS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-otoritas-menu') {
      httpBody.respondCode = 'GET-DATA-OTORITAS-MENU'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }else if (data === 'g-otoritas-user') {
      httpBody.respondCode = 'GET-DATA-OTORITAS-USER'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-otoritas') {
      httpBody.respondCode = 'SET-DATA-OTORITAS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-otoritas') {
      httpBody.respondCode = 'UPT-DATA-OTORITAS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-otoritas') {
      httpBody.respondCode = 'DEL-DATA-OTORITAS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
=======
    } 
>>>>>>> billy
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> billy
