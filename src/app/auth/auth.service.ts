import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_KEY } from '../api.key';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError((errorRes) => {
          let error = 'An unknown error occured!';
          if (!errorRes.error || !errorRes.error.error)
            return throwError(error);
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS': {
              error = 'The email address is already in use by another account.';
              break;
            }
            case 'OPERATION_NOT_ALLOWED': {
              error = 'Password sign-in is disabled for this project.';
              break;
            }
            case 'TOO_MANY_ATTEMPTS_TRY_LATER': {
              error =
                'We have blocked all requests from this device due to unusual activity. Try again later.';
              break;
            }
          }
          return throwError(error);
        })
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }
}
