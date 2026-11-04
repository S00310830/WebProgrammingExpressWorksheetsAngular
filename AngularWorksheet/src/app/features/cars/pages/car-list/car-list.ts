import { Component, inject } from '@angular/core';
import { CarService } from '../../services/car.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { withLoadState } from '../../../../shared/load-state';
import { RouterLink } from '@angular/router';
import { CarCard } from '../car-card/car-card';

@Component({
  selector: 'app-car-list',
  imports: [RouterLink, CarCard],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})

export class CarList  {
  private carService = inject(CarService);
  state = toSignal(withLoadState(this.carService.getCars()), { requireSync: true });
}
