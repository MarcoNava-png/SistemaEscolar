import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '../services/error.service'; // Servicio de manejo de errores

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', [Validators.required]], 
      contrasena: ['', Validators.required],  
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.triggerErrorAnimation();
      return;
    }
  
    this.isLoading = true;
    setTimeout(() => {
      this.loginService.login(this.loginForm.value).subscribe(
        (response) => {
          if (response?.token) {
            localStorage.setItem('jwt', response.token);
            this.loginService.isLoggedIn = true;
            this.router.navigateByUrl('home/home');
            this.toastr.success('¡Bienvenido!', 'Inicio de sesión exitoso');
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.errorService.msjError(error);
        }
      );
    }, 2000);
  }
  

  triggerErrorAnimation() {
    const container = document.querySelector('.login-card');
    container?.classList.add('shake');
    setTimeout(() => container?.classList.remove('shake'), 500);
  }
}