import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidateService } from './validate.service';
import { RequestDataService } from '../request-data.service';

@Injectable({
  providedIn: 'root'
})
export class AfterLoginService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    let x = this.validate.loggedIn().then(a => {
      if (a == false) {
        this.router.navigateByUrl('/auth/login')
      }
      return a
    })

    return x
  }

  constructor(
    private router: Router,
    private validate: ValidateService,
  ) { }
}