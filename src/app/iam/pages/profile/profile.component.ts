import { Component, OnInit } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { AuthService } from '../../services/auth.service'; // Asegúrate de que esta ruta sea correcta
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Router } from '@angular/router';
import {EditProfileDialogComponent} from "../edit-profile-dialog/edit-profile-dialog.component";
import {GroupService} from "../../../group/services/group.service";
import {SubmissionApiService} from "../../../challenges/services/submission-api.service";
import {ChallengeApiService} from "../../../challenges/services/challenge-api.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatDialogModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: any = null;
  groupCount: number = 0;
  lastGroupName: string = '0';
  submissionCount: number = 0;
  challengeCount: number = 0;

  private imageOptions: string[] = [
    'https://randomuser.me/api/portraits/men/15.jpg',
    'https://randomuser.me/api/portraits/men/22.jpg',
    'https://randomuser.me/api/portraits/men/33.jpg',
    'https://randomuser.me/api/portraits/women/10.jpg',
    'https://randomuser.me/api/portraits/women/18.jpg',
    'https://randomuser.me/api/portraits/women/35.jpg'
  ];

  constructor(
      private authService: AuthService,
      private router: Router,
      private dialog: MatDialog, // 👈 nuevo
      private groupService: GroupService,
      private submissionService: SubmissionApiService,
      private challengeService: ChallengeApiService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser(); // <- aquí usamos tu método existente

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = {
      ...user,
      imageUrl: this.getImageByRole(user.role)
    };

    // 🔥 Obtener grupos del usuario
    this.groupService.getGroupsByUserId(user.id).subscribe({
      next: (groups) => {
        // ✅ solo contamos los grupos
        this.groupCount = groups.length;

        // ✅ Obtener el último grupo creado (último de la lista)
        const lastGroup = groups[groups.length - 1];
        this.lastGroupName = lastGroup?.name ?? '—'; // Puedes mostrarlo en el HTM

        // 👨‍🏫 Si es profesor, obtener retos del último grupo
        if (this.user.role === 'ROLE_TEACHER') {
          this.challengeService.getChallengesByGroupId(lastGroup.id).subscribe({
            next: (challenges) => {
              this.challengeCount = challenges.length;
            },
            error: (err) => {
              console.error('Error al cargar retos:', err);
            }
          });
        }

      },
      error: (err) => {
        console.error('Error al cargar grupos del usuario:', err);
      }
    });

    // 🔥 Obtener submissions por estudiante
    this.submissionService.getByStudentId(user.id).subscribe({
      next: (submissions) => {
        this.submissionCount = submissions.length;
      },
      error: (err) => {
        console.error('Error al cargar submissions del usuario:', err);
      }
    });




    console.log("Perfil cargado:", this.user);
  }

  getRandomImage(): string {
    const index = Math.floor(Math.random() * this.imageOptions.length);
    return this.imageOptions[index];
  }

  edit():void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      data: {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.updateUserProfile(this.user.id, result).subscribe({
          next: (updatedUser) => {
            this.authService.setUser(updatedUser); // actualiza localStorage
            this.user = {
              ...updatedUser,
              imageUrl: this.user.imageUrl // mantiene la imagen aleatoria
            };
            alert('Perfil actualizado');
          },
          error: () => {
            alert('Error al actualizar perfil');
          }
        });
      }
    });
  }

  getImageByRole(role: string): string {
    if (role === 'ROLE_TEACHER') {
      return 'https://randomuser.me/api/portraits/men/1.jpg'; // imagen de profesor
    }
    if (role === 'ROLE_USER') {
      return 'https://randomuser.me/api/portraits/women/18.jpg'; // o una imagen fija de estudiante
    }
    return 'https://randomuser.me/api/portraits/lego/1.jpg'; // imagen por defecto
  }
}
