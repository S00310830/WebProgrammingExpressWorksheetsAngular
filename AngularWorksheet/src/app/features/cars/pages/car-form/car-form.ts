import { Component, inject, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Car } from '../../models/car.model';
import { CarService } from '../../services/car.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})

export class CarForm {

  private formBuilder = inject(FormBuilder);
  private carService = inject(CarService);
  private router = inject(Router);

  readonly currentYear = new Date().getFullYear();

  carForm = this.formBuilder.nonNullable.group({
    make: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    model: ['', [Validators.required, Validators.maxLength(30)]],
    year: this.formBuilder.control<number | null>(null, [Validators.min(1950), Validators.max(this.currentYear + 1),]),
  });

  readonly saving = signal(false);
  private snackBar = inject(MatSnackBar);

  onSubmit(): void {

    this.saving.set(true);
    const carData: Car = this.carForm.value as Car;
    console.log('Submitted Car:', carData);

    this.carForm.disable();

    this.carService.addCar(carData).subscribe({
      next: (response) => {
        this.snackBar.open(`${carData.make} ${carData.model} saved`, 'Close', { duration: 10000 });
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']);
      },

      error: (error) => {
        this.saving.set(false);
        console.error('Error adding car:', error);
        this.snackBar.open('Error adding car', 'Close', { panelClass: ['error-snackbar'] });
        this.carForm.enable();
      }
    });
  }
}

