import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (resData: AuthResponseData) => {
  const expirationDate = new Date(
    new Date().getTime() + +resData.expiresIn * 1000
  );
  const user = new User(
    resData.email,
    resData.localId,
    resData.idToken,
    expirationDate
  );
  localStorage.setItem('userData', JSON.stringify(user));
  return {
    type: AuthActions.AUTHENTICATE_SUCCESS,
    payload: {
      email: resData.email,
      userId: resData.localId,
      token: resData.idToken,
      expirationDate,
      redirect: true,
    },
  };
};

const handleError = (errorRes) => {
  let error = 'An unknown error occured!';
  if (!errorRes.error || !errorRes.error.error)
    return of(new AuthActions.AuthenticateFail(error));
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
    case 'EMAIL_NOT_FOUND': {
      error =
        'There is no user record corresponding to this identifier. The user may have been deleted.';
      break;
    }
    case 'INVALID_PASSWORD': {
      error = 'The password is invalid or the user does not have a password.';
      break;
    }
    case 'USER_DISABLED': {
      error = 'The user account has been disabled by an administrator.';
      break;
    }
  }
  return of(new AuthActions.AuthenticateFail(error));
};

@Injectable()
export class AuthEffects {
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimmer(+resData.expiresIn * 1000);
            }),
            map((resData) => {
              return handleAuthentication(resData);
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((sigupStart: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
            {
              email: sigupStart.payload.email,
              password: sigupStart.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimmer(+resData.expiresIn * 1000);
            }),
            map((resData) => {
              return handleAuthentication(resData);
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authActions: AuthActions.AuthenticateSuccess) => {
          if (authActions.payload.redirect) this.router.navigate(['/']);
        })
      ),
    {
      dispatch: false,
    }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) return { type: 'DUMMY' };

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expDur =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimmer(expDur);
          return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            token: loadedUser.token,
            userId: loadedUser.id,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        }
        return { type: 'DUMMY' };
      })
    )
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
