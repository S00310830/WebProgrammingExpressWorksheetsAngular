import { Component, inject, input, signal } from '@angular/core';

import { CarService } from '../../services/car.service';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-details',
  imports: [],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
})
export class CarDetails {

  private carService = inject(CarService);

    readonly id = input.required<string>();

   readonly car = signal<Car | null>(null);

    ngOnInit(): void {
    this.carService.getCarById(this.id()).subscribe(car => {
      this.car.set(car);
    });

  }
}
