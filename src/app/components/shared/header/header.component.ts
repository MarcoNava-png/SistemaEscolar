import { Component, OnInit } from '@angular/core';
import { TimeService } from './service/time.service';
import { LoginService } from '../../login/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentDate!: string;
  currentTime!: string;

  constructor(
    private timeService: TimeService,
    public loginService: LoginService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.timeService.getMexicoCurrentDate().subscribe({
      next: (date) => this.currentDate = date,
      error: (err) => console.error('Error obteniendo la fecha:', err)
    });

    this.timeService.getMexicoCurrentTime().subscribe({
      next: (time) => this.currentTime = time,
      error: (err) => console.error('Error obteniendo la hora:', err)
    });
  }

  getFullUserName(): string {
    const user = this.loginService.userData;
    return `${user?.nombreEmpleado || ''} ${user?.apellidoPaterno || ''} ${user?.apellidoMaterno || ''}`.trim();
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
