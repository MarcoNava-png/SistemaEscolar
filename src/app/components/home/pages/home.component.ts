import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../login/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  constructor(public loginService: LoginService,public router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

}
