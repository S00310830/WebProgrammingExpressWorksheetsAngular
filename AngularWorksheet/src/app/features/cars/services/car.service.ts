import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Car, UpdateCarDto } from '../models/car.model';
import type { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class CarService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/cars'; // this should be read from an env variable we will leave it for now.

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl)
  }

  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`)
  }

  addCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car)
  }
  
  updateCar(id: string, changes: UpdateCarDto): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, changes);
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
