import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { RegisterUserDto, User } from '../models/user'; 


  @Injectable({
  providedIn: 'root',
})
export class AuthCustomService {

  private readonly apiUrl = 'http://localhost:3000/api/v1/auth/register'; // this should be read from an env variable we will leave it for now.

  private http = inject(HttpClient);

  
  addUser(user: RegisterUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

}
