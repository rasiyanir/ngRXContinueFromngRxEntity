import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { autoLogin, loginStart, loginSuccess, logout, signupStart, signupSuccess } from "./auth.actions";
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from "src/app/services/auth.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { setErrorMessage, setLoadingSpinner } from "src/app/store/shared/shared.actions";
import { of } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions, private authService: AuthService, private store: Store<AppState>, private router: Router){}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.authService.login(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({status: false}));
            this.store.dispatch(setErrorMessage({ message: ''}));
            const user = this.authService.formatUser(data);
            this.authService.setUserInLocalStorage(user);
            return loginSuccess({ user, redirect: true });
          }),
          catchError((errResp) => {
            this.store.dispatch(setLoadingSpinner({status: false}));
            // console.log(errResp.error.error.message);
            const errorMessage = this.authService.getErrorMessage(errResp.error.error.message)
            return of(setErrorMessage({message: errorMessage}));
          })
        );
      })
    );
  });

  loginRedirect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[loginSuccess, signupSuccess]),
      tap((action) => {
        if(action.redirect){
          this.router.navigate(['/']);
        }
      })
    )
  }, {dispatch: false});

  signup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signupStart),
      exhaustMap((action) => {
        return this.authService.signUp(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({status: false}));
            this.store.dispatch(setErrorMessage({ message: ''}));
            const user = this.authService.formatUser(data);
            this.authService.setUserInLocalStorage(user);
            return signupSuccess({ user, redirect: true});
          }),
          catchError((errResp) => {
            this.store.dispatch(setLoadingSpinner({status: false}));
            // console.log(errResp.error.error.message);
            const errorMessage = this.authService.getErrorMessage(errResp.error.error.message)
            return of(setErrorMessage({message: errorMessage}));
          })
        );
      })
    );
  });

  // signUpRedirect$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(signupSuccess),
  //     tap((action) => {
  //       this.router.navigate(['/']);
  //     })
  //   )
  // }, {dispatch: false});

  autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(autoLogin),
      exhaustMap((action) => {
      const user = this.authService.getUserFromLocalStorage();
      return of(loginSuccess({ user, redirect: false }));
    }))
  })

  logout$ = createEffect(() => {
    return this.actions$.pipe(ofType(logout), map((action) => {
      this.authService.logout();
      this.router.navigate(['auth']);
    }))
  }, {dispatch: false})
}
