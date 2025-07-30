import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { User } from '../interfaces/usuarios';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoggedIn: boolean = false;
  public userData: any = null;
  private myAppUrl: string = environment.apiWSLogin;

  constructor(private http: HttpClient) {
    this.isLoggedIn = !!localStorage.getItem('jwt');

    const token = this.getToken();
    if (token) {
      this.userData = this.decodeToken(token); // Decodificar el token
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
    }
  }

  login(loginRequest: any): Observable<any> {
    console.log("gola");
    return this.http.post(`${this.myAppUrl}/Auth/login`, loginRequest).pipe(
      tap((response: any) => {
        const jwtToken = response.token;
        const userData = response.user;

        if (jwtToken) {
          localStorage.setItem('jwt', jwtToken);
          localStorage.setItem('user', JSON.stringify(userData));
          this.isLoggedIn = true;
          this.userData = userData;
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.userData = null; 
    //window.location.reload();
  }
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  createAuthorizationHeader(): HttpHeaders {
    const jwtToken = this.getToken();
    if (jwtToken) {
      return new HttpHeaders().set("Authorization", "Bearer " + jwtToken);
    } else {
      return new HttpHeaders();
    }
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token); 
    } catch (error) {
      return null;
    }
  }
}
