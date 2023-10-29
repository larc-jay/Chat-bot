import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '../model/AuthResponse';
import { environment } from 'src/environments/environment.prod';
import { Observable, catchError, map, of, timer } from 'rxjs';



const TOKEN = 'token';
const USERNAME = 'username';
const USERID = 'userId';
const MIN15 = 1000 * 60 * 15;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isAuthenticated = false;
  //private privileges: Array<string>;
  //private roles: Array<string>;
  private userId: any;
  //private type;
  getLoggedInUserInfo = new EventEmitter<string>();

  constructor(
    private httpClient: HttpClient,
    private router: Router) { }

  private resetFields() {
    this.isAuthenticated = false;
    //this.privileges = null;
  }

  authenticate(username: string, password: string) {
    return this.httpClient.post<AuthResponse>(`${environment.apiBaseUrl}/login`, { username, password }).pipe(
      map(
        data => {
          this.saveUserAuthInfo(data,true);
          return data;
        }
      )
    );
  }

  refreshTokenSubs = timer(MIN15, MIN15).subscribe(val => {
    this.httpClient.get<AuthResponse>(`${environment.apiBaseUrl}/refreshToken`).subscribe(
      data => {
        this.saveUserAuthInfo(data,false);
      },
      error => {
        if (error.status === 401) {
          this.logOutClient();
        }
      });
  });

  private handleError(err: HttpErrorResponse): Observable<any> {
    console.error(`Status code ${err.status}`);
    //FIXME - check how can we call this.logOutClient();
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USERNAME);
    return of(false);
  }

  private autehticated(): boolean {
    return this.isAuthenticated;
  }

  autehticatedOrValidToken(): Observable<boolean> | boolean {
    if (this.autehticated()) {
      return true;
    }
    const token = this.getToken();
    if (token !== null) {
      return this.httpClient.get<AuthResponse>(`${environment.apiBaseUrl}/validateToken`).pipe(
        map(
          data => {
            this.saveUserAuthInfo(data,false);
            return true;
          }
        ),
        catchError(this.handleError)
      );
    }
    return false;
  }

  getToken() {
    return localStorage.getItem(TOKEN);
  }

  getName() {
    return localStorage.getItem(USERNAME);
  }
  getLoggedInUserId() {
    return localStorage.getItem(USERID);
  }
 
  logOut() {
    this.httpClient.get(`${environment.apiBaseUrl}/logout`)
      .subscribe(
        {
          next: (res) =>{
            this.logOutClient();
          },
          error : () =>{
            this.logOutClient();
          }
        }) ;
  }
  logOutClient() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USERNAME);
    localStorage.removeItem(USERID);
    this.resetFields();
    //this.getLoggedInUserInfo.emit(null);
    this.router.navigate(['/login']);
  }

  hasPrivilege(privilege: string) {
   // return this.privileges && this.privileges.indexOf(privilege) !== -1;
  }

 

  private saveUserAuthInfo(data: AuthResponse , flag: boolean) {
    localStorage.setItem(USERNAME, data.username);
    let tokenStr = `Bearer ${data.token}`;
    localStorage.setItem(TOKEN, tokenStr);
    this.isAuthenticated = true;
    this.getLoggedInUserInfo.emit(data.username);
    if(flag){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy() {
    this.refreshTokenSubs.unsubscribe();
  }
}
