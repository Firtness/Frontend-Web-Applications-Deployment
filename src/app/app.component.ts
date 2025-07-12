import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {MatAnchor} from '@angular/material/button';
import {SidebarComponent} from './public/components/sidebar/sidebar.component';
import {User} from "./iam/model/user.entity";
import {AuthService} from "./iam/services/auth.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  imports: [SidebarComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'EduHive-FrontEnd';
  //currentUser: any = null; // Aquí almacenarás los datos del usuario

  constructor(private authService: AuthService,private translate: TranslateService) {
    console.log(localStorage.getItem('auth_user'),'AppComponent cargado');
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('en');  // idioma por defecto
    this.translate.use('en');             // idioma activo
  }

}
