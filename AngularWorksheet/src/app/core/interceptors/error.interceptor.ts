import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthCustomService } from '../auth/auth-custom.service';
import { environment } from '../../../environments/environment';

export function friendlyMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0:
      return 'Cannot reach the server. Check that the API is running.';
    case 400:
      return 'Some of the data was not valid.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You are not allowed to do that.';
    case 404:
      return 'The item you asked for could not be found.';
    default:
      return 'Something went wrong on the server. Please try again later.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
    next(req).pipe(
    catchError((error: HttpErrorResponse) => {
        console.error(`HTTP ${error.status} ${req.method} ${req.url}`, error);
        return throwError(() => new Error(friendlyMessage(error)));
        }),
    );

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthCustomService);

  const apiUrl = environment.apiUri
  
  const jwt = authService.token;

  // we don't want to attach our token to a request to any other server
  // so we check that the request is to our own api
  // if so we create a new request with the Bearer token
  // if not we just copy the existing request.

  const authRequest = req.url.startsWith(apiUrl) && jwt
    ? req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } })
    : req;

    return next(authRequest).pipe(
      catchError((err) => {
        console.log('Request failed ' + err.status);

      // Handle missing or invalid JWT (401)

      if (err.status === 401 ) {
        authService.logout(); // Clear any stored tokens
        router.navigate(['/login']); // Redirect to login page
      }

        return throwError(() => err);
      })
    );
}

