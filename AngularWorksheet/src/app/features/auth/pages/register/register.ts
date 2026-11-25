import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthCustomService } from '../../../../core/auth/auth-custom.service';
import { RegisterUserDto } from '../../../../core/models/user';
import { notBlank } from '../../../../shared/validators/not-blank.validator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthCustomService);
  private router = inject(Router);

  saving = signal(false);
  saveError = signal<string | null>(null);

  registerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, notBlank]],
    email: ['', [Validators.required, Validators.email, notBlank]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    const user: RegisterUserDto = this.registerForm.getRawValue();

    this.authService.addUser(user).subscribe({
      next: () => this.router.navigate(['/cars']),
      error: (error: Error) => {
        this.saveError.set(error.message);
        this.saving.set(false);
      },
    });
  }
}