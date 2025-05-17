import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../iam/services/auth.service";
import {GroupService} from "../../services/group.service";
import {User} from "../../../iam/model/user.entity";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {GroupJoinCodeService} from "../../services/group-join-code.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GroupJoinCode} from "../../model/group-join-code.entity";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {catchError, firstValueFrom, of} from "rxjs";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-group-members-view',
  imports: [
    MatButton,
    RouterLink,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatTooltip
  ],
  templateUrl: './group-members-view.component.html',
  standalone: true,
  styleUrl: './group-members-view.component.css'
})
export class GroupMembersViewComponent implements OnInit {

  user: User = new User({});

  teacher: User = new User({});
  
  studentList: Array<User> = [];
  groupId!: number;

  groupJoinCode: string = '';
  showCodeInput: boolean = false;
  newCode: string = '';

  constructor(
      private authService: AuthService,
      private route: ActivatedRoute,
      private groupJoinCodeService: GroupJoinCodeService,
      private snackBar: MatSnackBar,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.user = this.authService.getUser() || new User({});
    this.loadData();
    this.loadGroupJoinCode();

    console.log('Is logged in:', this.authService.isUserLoggedIn());
    console.log('Is in group:', this.authService.userIsInGroup(this.groupId));

    if (!this.authService.userIsInGroup(this.groupId) || !this.authService.isUserLoggedIn()) {
      this.router.navigate(['no-access']);
    }
  }

  private loadData(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId')) || 0; console.log(this.groupId);
    this.getUserListForGroup(this.groupId)
  }

  private loadGroupJoinCode(): void {
    this.groupJoinCodeService.getByGroupId(this.groupId).subscribe({
      next: (code: GroupJoinCode) => {
        this.groupJoinCode = code.key;
      },
      error: () => {
        this.groupJoinCode = '';
      }
    });
  }

  generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async createJoinCode(): Promise<void> {
    try {
      if (!this.newCode) {
        this.newCode = await this.generateUniqueCode();
      } else {
        // Verificar si el código manual ya existe
        const exists = await firstValueFrom(
            this.groupJoinCodeService.codeExists(this.newCode).pipe(
                catchError(() => of(false))
            ))

        if (exists) {
          this.snackBar.open('Este código ya está en uso', 'Cerrar', { duration: 3000 });
          return;
        }
      }

      const newJoinCode: GroupJoinCode = new GroupJoinCode({
        key: this.newCode,
        groupId: this.groupId
      });

      this.groupJoinCodeService.create(newJoinCode).subscribe({
        next: () => {
          this.groupJoinCode = this.newCode;
          this.showCodeInput = false;
          this.newCode = '';
          this.snackBar.open('Código creado exitosamente', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Error al crear el código: ' + err.message, 'Cerrar', { duration: 5000 });
        }
      });
    } catch (error) {
      this.snackBar.open('Error al generar código: ' + (error as Error).message, 'Cerrar', { duration: 5000 });
    }
  }

  async generateUniqueCode(): Promise<string> {
    const maxAttempts = 10;
    let attempts = 0;
    let isUnique = false;
    let newCode = '';

    while (!isUnique && attempts < maxAttempts) {
      newCode = this.generateRandomCode();

      try {
        const exists = await firstValueFrom(
            this.groupJoinCodeService.codeExists(newCode).pipe(
                catchError(() => of(false)) // Si hay error, asumimos que no existe
            )
        );

        if (!exists) {
          isUnique = true;
        }
      } catch (error) {
        console.error('Error verificando código:', error);
      }

      attempts++;
    }

    if (!isUnique) {
      throw new Error('No se pudo generar un código único después de varios intentos');
    }

    return newCode;
  }

  toggleCodeInput(): void {
    this.showCodeInput = !this.showCodeInput;
    if (!this.showCodeInput) {
      this.newCode = '';
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.groupJoinCode).then(() => {
      this.snackBar.open('Código copiado al portapapeles', 'Cerrar', {
        duration: 2000
      });
    });
  }

  private getUserListForGroup(groupId: number){
    this.authService.getUsersByGroupId(groupId).subscribe({
      next: (users) => {
        console.log(users);
        users.map((user) => {
          if ( user.role == "teacher") {
            this.teacher = user;
          } else {
            this.studentList.push(user);
          }
        })
        console.log(this.studentList);
      }
    })
  }

  getUserScore(user: User): number {
    return (user.profilesInGroups?.find((profile) => { profile.groupId === this.groupId })?.score) || 0
  }

  kickStudent(studentId: number) {

    // Eliminar de lista local
    this.studentList = this.studentList.filter((student) => {
      student.id !== studentId
    })

    // Eliminar profileInGroup del json-server
    let tempStudent: User = new User({});

    this.authService.getById(studentId).subscribe({
      next: (user) => {
        tempStudent = user;
        tempStudent.profilesInGroups = tempStudent.profilesInGroups?.filter((profile) => { return profile.groupId !== this.groupId })
        this.authService.update(tempStudent.id, tempStudent).subscribe({
          next: (user) => {}
        })
      }
    })



  }
}
