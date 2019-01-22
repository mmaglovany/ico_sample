import {Injectable} from '@angular/core';
import {HttpResponse, HttpClient} from '@angular/common/http';
import {Response} from '@angular/http';
import {Observable} from 'rxjs';
import {AuthHttp} from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Router} from "@angular/router";

@Injectable()
export class AuthenticationService {
    public token: string;
    public admin: boolean;
    private checkIsAdmin = new ReplaySubject<any>();
    private checkIsLoggedIn = new ReplaySubject<any>();

    constructor(private http: HttpClient, public authHttp: AuthHttp, private router: Router) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && currentUser.is_admin) {
            this.admin = currentUser.is_admin;

        }
        this.token = currentUser && currentUser.token;
    }

    setIsLoggedIn(value) {
        this.checkIsLoggedIn.next(value);
    }

    getIsLoggedIn(): Observable<any> {
        return this.checkIsLoggedIn.asObservable();
    }

    setIsAdmin(value) {
        this.checkIsAdmin.next(value);
    }

    getIsAdmin(): Observable<any> {
        return this.checkIsAdmin.asObservable();
    }

    isAdmin(): Observable<boolean> {
        return this.authHttp.get('auth/is-admin/')
            .map((response: Response) => {
                return response.json().is_admin;
            });
    }

    isAuthenticated(): boolean {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return !!currentUser;
    }

    login(email: string, password: string): Observable<boolean> {
        let postBody = {
            email: email,
            password: password
        };

        return this.http.post('/auth/login', postBody)
            .map((response: HttpResponse<any>) => {
                if (response.status) {
                    let token = (<any>response).token;
                    let resp_email = (<any>response).email;
                    if (token) {
                        // set token property
                        this.token = token;
                        let user_name = (<any>response).username;
                        // store username and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify({
                            user_name: user_name,
                            email: resp_email,
                            token: token
                        }));
                        this.setIsLoggedIn(true);
                    }
                    return (<any>response);
                }
                return (<any>response);
            })
            .catch(err => {
                return Observable.of(false);
            });
    }
    adminLogin(email: string, password: string): Observable<boolean> {
        let postBody = {
            email: email,
            password: password
        };

        return this.http.post('/auth/admin-login', postBody)
            .map((response: HttpResponse<any>) => {
                if (response.status) {
                    let token = (<any>response).token;
                    let resp_email = (<any>response).email;
                    if (token) {
                        // set token property
                        this.token = token;
                        let user_name = (<any>response).username;
                        // store username and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify({
                            user_name: user_name,
                            email: resp_email,
                            token: token
                        }));
                        this.setIsLoggedIn(true);
                    }
                    return (<any>response);
                }
                return (<any>response);
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    sendResetPassEmail(email: string): Observable<boolean> {
        let postBody = {
            email: email
        };
        return this.http.post('/auth/send-reset-pass-email', postBody)
            .map((response: HttpResponse<any>) => {
                return (<any>response);
            })
            .catch(err => {
                return Observable.of(false);
            });
    }
    sendEmailConfirmation(email: string): Observable<boolean> {
        let postBody = {
            email: email
        };
        return this.http.post('/auth/send-email-confirmation', postBody)
            .map((response: HttpResponse<any>) => {
                return (<any>response);
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    resetPass(model: any): Observable<boolean> {
        let postBody = {
            reset_pass_token: model.reset_pass_token,
            email: model.email,
            password: model.password
        };
        return this.http.post('/auth/reset-pass', postBody)
            .map((response: HttpResponse<any>) => {
                return (<any>response);
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    passConfirmTFA(password: string, action: string): Observable<boolean> {
        let postBody = {
            password: password,
            action: action
        };
        return this.authHttp.post('/auth/pass-confirm', postBody)
            .map((response: Response) => {
                return response.json();
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    getSettings(password: string, action: string): Observable<boolean> {

        return this.authHttp.post('/auth/get-settings', {})
            .map((response: Response) => {
                return response.json();
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    verifyCode(auth_code, action) {
        let postBody = {
            auth_code: auth_code,
            action: action
        };
        return this.authHttp.post('/auth/verify-code', postBody)
            .map((response: Response) => {
                return response.json();
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    loginVerifyCode(auth_code, email) {
        let postBody = {
            auth_code: auth_code,
            email: email
        };

        return this.http.post('/auth/login/verify-code', postBody)
            .map((response: HttpResponse<any>) => {
                if (response.status) {
                    let token = (<any>response).token;
                    let resp_email = (<any>response).email;
                    let user_name = (<any>response).username;
                    if (token) {
                        // set token property
                        this.token = token;
                        // store username and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify({
                            user_name: user_name,
                            email: resp_email,
                            token: token
                        }));
                        this.setIsLoggedIn(true);
                    }
                    return (<any>response);
                }
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    register(model: any): Observable<boolean> {
        let postBody = {
            email: model.email,
            password: model.password,
            confirm_password: model.confirm_password,
            phone_country: model.phone_country,
            user_name: model.user_name,
            referral: model.referral,
            phone_number: model.phone_number
        };

        return this.http.post('/auth/register', postBody)
            .map((response: HttpResponse<any>) => {
                return (<any>response);
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    resendEmail(email: any): Observable<boolean> {
        let postBody = {
            email: email
        };

        return this.http.post('/auth/resend_email', postBody)
            .map((response: HttpResponse<any>) => {
                return (<any>response);
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    activate_email(confirmation_email: any, confirmation_code: any): Observable<boolean> {
        let postBody = {
            confirmation_email: confirmation_email,
            confirmation_code: confirmation_code,
        };

        return this.http.post('/auth/activate_email', postBody)
            .map((response: HttpResponse<any>) => {
                return (<any>response);
            })
            .catch(err => {
                return Observable.of(false);
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
