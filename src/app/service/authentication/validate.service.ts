import { Injectable } from '@angular/core';
import { RequestDataService } from '../request-data.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor(
    private request: RequestDataService
  ) { }

  loggedIn(): any {
    return this.request.authenticate('validate', {})
  }
}