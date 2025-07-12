import { Component } from '@angular/core';
import {LanguageSwitcherComponent} from "../../../public/components/language-switcher/language-switcher.component";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AuthService} from "../../../iam/services/auth.service";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-main-layout',
    imports: [
        LanguageSwitcherComponent,
        MatAnchor,
        MatIconButton,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent,
        MatToolbar,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        MatIcon
    ],
    templateUrl: './main-layout.component.html',
    standalone: true,
    styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

  options = [
        { link: '/dashboard', label: 'Dashboard' },
        { link: '/profile', label: 'Profile' },
    ];

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {
    }

    LogOut() {
        this.authService.logout()
    }

    IsUserConnected() {
        return this.authService.getUser() !== null;
    }
}
