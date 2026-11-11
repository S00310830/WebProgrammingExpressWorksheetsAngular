import { Component, inject, input, OnInit, signal } from '@angular/core';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CreateCarDto } from '../../models/car.model';
import { CarService } from '../../services/car.service';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { notBlank } from '../../../../shared/validators/not-blank.validator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})

export class CarForm implements OnInit {

  private formBuilder = inject(FormBuilder);
  private carService = inject(CarService);
  private router = inject(Router);

  readonly id = input<string>(); 
   
  carForm = this.formBuilder.nonNullable.group({
    make: ['', [Validators.required, notBlank]],
    model: ['', [Validators.required, notBlank]],
    year: this.formBuilder.control<number|null> (null)
  });

  saving = signal(false);
  saveError = signal<string | null>(null);

  onSubmit(): void {

    const { make, model, year } = this.carForm.getRawValue();
    const newCar: CreateCarDto = { make, model, year: year ?? undefined };

    const id = this.id();
    const request = id
      ? this.carService.updateCar(id, newCar)
      : this.carService.addCar(newCar);

    this.saving.set(true);
    this.saveError.set(null);

    request.subscribe({
      next: (response) => {
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']);
      },

    error: (err: Error) => {
      this.saveError.set(err.message);
      this.saving.set(false);
    },

    });
  }

  ngOnInit(): void {

    const id = this.id();
    if (!id) return; // adding a new car, nothing to load

    this.carService.getCarById(id).subscribe({
      next: (car) =>
        this.carForm.patchValue({ make: car.make, model: car.model, year: car.year ?? null }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }
}

export function forbiddenValue(word: string): Validators {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (typeof value !== 'string') {
      return null;
    }

    if (value.trim().toLowerCase() === word.trim().toLowerCase()) {
      return { forbiddenValue: { value: word } };
    }

    return null;
  };
}

