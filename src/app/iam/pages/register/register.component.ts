import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  @Output() loginEvent = new EventEmitter<boolean>();

  form: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['student'],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid){
      alert('Formulario invalido');
      return;
    }

    switch (this.form.value.role)
    {
      case 'student':
        this.form.value.role = "ROLE_STUDENT"
        break;
      case 'teacher':
        this.form.value.role = "ROLE_TEACHER"
        break;
    }

    this.auth.register(this.form.value).subscribe({
      next: (user) => {
        alert('Registrado con éxito');
        this.form.reset({ role: 'student' });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
        this.error = err.message
      }
    });

  }

  switchToLogin() {
    this.loginEvent.emit(true);
  }
}