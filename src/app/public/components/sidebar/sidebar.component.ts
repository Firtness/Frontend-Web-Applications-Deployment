import {Component, OnInit} from '@angular/core';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {LanguageSwitcherComponent} from "../language-switcher/language-switcher.component";
import {AuthService} from "../../../iam/services/auth.service";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-sidebar',
    imports: [
        MatAnchor,
        RouterOutlet,
        RouterLink,
        MatSidenavContainer,
        MatToolbar,
        MatIcon,
        MatIconButton,
        MatSidenav,
        MatSidenavContent,
        LanguageSwitcherComponent,
        RouterLinkActive,
        NgOptimizedImage,
    ],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  options = [
    { link: '/dashboard', label: 'Dashboard' },
  ];

  constructor(
      private authService: AuthService,
      private router: Router,
  ) {
  }

  LogOut() {
      this.authService.logout()
      this.router.navigate(['auth']);
  }

  IsUserConnected() {
      return this.authService.getUser() !== null;
  }
}
