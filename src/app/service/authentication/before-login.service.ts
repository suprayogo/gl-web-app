import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { ValidateService } from './validate.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeforeLoginService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    let x = this.validate.loggedIn().then(a => {
      if (a == true) {
        this.router.navigateByUrl('/')
      }
      return !a
    })

    return x
  }

  constructor(
    private router: Router,
    private validate: ValidateService,
  ) { }
}