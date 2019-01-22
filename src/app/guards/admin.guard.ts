import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from "../sevises/authentication.service";

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private auth: AuthenticationService,
                private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let isAdmin = this.auth.isAdmin();

        if (!isAdmin) {
            this.router.navigate(['/']);
        }

        return isAdmin;
    }
}
