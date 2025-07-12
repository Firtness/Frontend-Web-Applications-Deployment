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
import {User} from "../../model/user.entity";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatDialogModule, NgIf, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: any = null;
  groupCount: number = 0;
  lastGroupName: string = '0';
  submissionCount: number = 0;
  challengeCount: number = 0;

  studentImg: string = 'https://randomuser.me/api/portraits/lego/1.jpg';
  teacherImg: string = 'https://randomuser.me/api/portraits/lego/2.jpg';



  constructor(
      private authService: AuthService,
      private router: Router,
      private dialog: MatDialog, // 👈 nuevo
      private groupService: GroupService,
      private submissionService: SubmissionApiService,
      private challengeService: ChallengeApiService
  ) {}

  ngOnInit(): void {
    let localUser: User = this.authService.getUser() || new User({});
    if (!localUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserById(localUser.id).subscribe({
      next: (response) => {
        this.user = {
          ...response,
          imageUrl: this.getImageByRole(response.roles?.[0])
        };
        console.log("Usuario cargado:", this.user);

        // Grupos del usuario
        this.groupService.getGroupsByUserId(localUser.id).subscribe({
          next: (groups) => {
            this.groupCount = groups.length;
            const lastGroup = groups[groups.length - 1];
            this.lastGroupName = lastGroup?.name ?? '—';

            if (this.user.roles?.[0] === 'ROLE_TEACHER') {
              this.challengeService.getChallengesByGroupId(lastGroup?.id).subscribe({
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
            console.error('Error al cargar grupos:', err);
          }
        });

        if (this.user.roles?.[0] === 'ROLE_STUDENT') {
          this.submissionService.getByStudentId(localUser.id).subscribe({
            next: (submissions) => {
              this.submissionCount = submissions.length;
            },
            error: (err) => {
              console.error('Error al cargar submissions del usuario:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
      }
    });
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
