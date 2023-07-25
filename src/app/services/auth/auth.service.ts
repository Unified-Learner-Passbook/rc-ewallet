import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';
import * as config from '../../../assets/config/config.json';

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  _currentUser;
  _digilockerAccessToken: string;
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly keycloakService: KeycloakService
  ) {
    // this.baseUrl = environment.baseUrl;
    // this.baseUrl = this.authConfigService.config.bffUrl;
    // this.authConfigService.getConfig().subscribe((config) => {
    //   this.baseUrl = config.bffUrl;
    // })
    this.baseUrl = config.default.bffUrl;
  }

  // Sign-up
  signUp(user): Observable<any> {
    const api = `${this.baseUrl}/v1/sso/student/register`;
    return this.http.post(api, user);
  }


  ssoSignUp(user: any): Observable<any> {
    const api = `${this.baseUrl}/v1/sso/digilocker/register`;
    return this.http.post(api, user).pipe(retry(2));
  }

  verifyAadhar(aadharId: number | string) {
    const api = `${this.baseUrl}/v1/aadhaar/verify`;
    return this.http.post(api, { aadhaar_id: aadharId });
  }

  verifyAccountAadharLink(payload: any) {
    const api = `${this.baseUrl}/v1/sso/digilocker/aadhaar`;
    return this.http.post(api, payload);
  }

  aadhaarKYC(payload: any) {
    const api = `${this.baseUrl}/v1/sso/learner/aadhaar`;
    return this.http.post(api, payload);
  }

  getOTP(aadharId: number): Observable<any> {
    const api = `${this.baseUrl}/v1/aadhaar/otp`;
    return this.http.post(api, { aadhaar_id: aadharId });
  }

  submitOTP(otp: number): Observable<any> {
    const api = `${this.baseUrl}/v1/aadhaar/otp`;
    return this.http.post(api, { otp });
  }

  // Sign-in
  signIn(user): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/v1/sso/student/login`, user)
      .pipe(tap((res: any) => {
        console.log("res", res);

        if (!res.success) {
          throwError('Incorrect username or password')
        }
      }));
  }

  authorizeSSO() {
    //TODO ${this.baseUrl}/v1/sso/digilocker/authorize/ewallet
  }

  getToken() {
    // return localStorage.getItem('accessToken');
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('token');
    return authToken !== null ? true : false;
  }

  get currentUser(): any {
    let user = localStorage.getItem('currentUser');
    if (user) {
      user = JSON.parse(user);
    }
    return user;
  }

  set digilockerAccessToken(token: string) {
    localStorage.setItem('digilockerAccessToken', token);
  }

  get digilockerAccessToken() {
    return localStorage.getItem('digilockerAccessToken');
  }

  doLogout() {
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('currentUser');
    localStorage.clear();

    this.keycloakService.clearToken();
    this.keycloakService.logout(window.location.origin);
    this.router.navigate(['']);
  }

  // User profile
  getUserProfile(): Observable<any> {
    let api = `${this.baseUrl}/v1/sso/user/ewallet`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: any) => {
        console.log("profile res", res);
        if (res?.result?.DID) {
          localStorage.setItem('currentUser', JSON.stringify(res.result));
        }
        return res;
      })
    );
  }


  getStateList(): Observable<any> {
    let api = `${this.baseUrl}/v1/school/stateList`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: any) => {
        console.log("states res", res);
        return res.response;
      })
    );
  }


  getDistrictList(payload: { stateCode: string }) {
    let api = `${this.baseUrl}/v1/school/districtList`;
    return this.http.post(api, payload, { headers: this.headers }).pipe(
      map((res: any) => {
        console.log("districts res", res);
        return res.response;
      })
    );
  }

  getBlockList(payload: { districtCode: string }) {
    let api = `${this.baseUrl}/v1/school/blockList`;
    return this.http.post(api, payload, { headers: this.headers }).pipe(
      map((res: any) => {
        console.log("block res", res);
        return res.response;
      })
    );
  }

  getSchoolList(payload: { "regionType": string, "regionCd": string, "sortBy": string }) {
    let api = `${this.baseUrl}/v1/school/schoolList`;
    return this.http.post(api, payload, { headers: this.headers }).pipe(
      map((res: any) => {
        console.log("schools res", res);
        return res.response;
      })
    );
  }


  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}