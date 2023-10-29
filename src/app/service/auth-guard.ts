import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { Observable, isObservable, map } from "rxjs";

export class AuthGuard   {

    constructor(private router: Router,
      private authService: AuthenticationService) { }
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
      return this.checkAuthentication(route);
    }
  
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
      return this.canActivate(route, state);
    }
  
    checkAuthentication(route: ActivatedRouteSnapshot) {
      const result = this.authService.autehticatedOrValidToken();
      if (isObservable(result)) {
        return result.pipe(
          map(data => {
            if (data === true) {
              return this.checkAuthorization(route);
            }
            this.router.navigate(['/login']);
            return false;
          })
        );
      } else if (result === true) {
        return this.checkAuthorization(route);
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  
    checkAuthorization(route: ActivatedRouteSnapshot) {
      if (!route.data) {
        return true;
      }
      this.router.navigate(['/search/unauthorized']);
      return false;
    }
}
  