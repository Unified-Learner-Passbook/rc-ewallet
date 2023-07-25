import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {
  private _config: any;

  constructor(private httpClient: HttpClient) { }


  get config(): any {
    return this._config;
  }

  public getConfig(): Observable<any> {
    if (this._config) {
      return of(this._config);
    }
    return this.httpClient.get('./assets/config/config.json').pipe(
      shareReplay(1),
      catchError((error) => {
        console.log(error)
        return of(null)
      }),
      map((response) => {
        if (response) {
          this._config = response;
          return response;
        } else {
          return null;
        }
      }));
  }
}
