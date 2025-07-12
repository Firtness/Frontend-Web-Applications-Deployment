import {Component, OnInit} from '@angular/core';
import {Route, Router, RouterOutlet} from '@angular/router';
import {AuthService} from "../../../iam/services/auth.service";
import {LoginComponent} from "../../../iam/pages/login/login.component";
import {RegisterComponent} from "../../../iam/pages/register/register.component";

@Component({
  selector: 'app-auth-layout',
  imports: [
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './auth-layout.component.html',
  standalone: true,
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent implements OnInit {

  isLogin: boolean = true;

  constructor(
      private authService: AuthService,
      private router: Router
  ) {

  }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  handleSwitchEvent(isLogin: boolean): void {
    this.isLogin = isLogin;
  }
}
