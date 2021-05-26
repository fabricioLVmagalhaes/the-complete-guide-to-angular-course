import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.isLoading = true;
    if (this.isLoginMode) {
      this.isLoading = false
    } else {
      const email = form.value.email;
      const password = form.value.password;

      this.authService.signup(email, password)
        .pipe(finalize(()=> {
          this.isLoading = false
        }))
        .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          this.error = 'An error occurred!'

        }
      );
    }

    form.reset();
  }
}
