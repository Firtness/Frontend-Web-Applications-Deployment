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
import {ChallengeApiService} from "../../../challenges/services/challenge-api.service";
import {Challenge} from "../../../challenges/model/challenge.entity";
import {MatSelect} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {SubmissionApiService} from "../../../challenges/services/submission-api.service";
import {Submission} from "../../../challenges/model/submission.entity";

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
    MatTooltip,
    MatSelect,
    MatOption,
    NgForOf
  ],
  templateUrl: './group-members-view.component.html',
  standalone: true,
  styleUrl: './group-members-view.component.css'
})
export class GroupMembersViewComponent implements OnInit {

  user: User = new User({});

  teacher: User = new User({});
  
  studentList: User[] = [];
  groupId!: number;

  groupJoinCode: string = '';
  showCodeInput: boolean = false;
  newCode: string = '';

  challenges: Challenge[] = [];

  selectedStudentId: number | null = null;

  studentScores: {[key: number]: number} = {};

  studentImg: string = 'https://randomuser.me/api/portraits/lego/1.jpg';

  constructor(
      private authService: AuthService,
      private route: ActivatedRoute,
      private groupJoinCodeService: GroupJoinCodeService,
      private snackBar: MatSnackBar,
      private router: Router,
      private challengeService: ChallengeApiService,
      private submissionService: SubmissionApiService,
      private groupService: GroupService,
  ) {
  }



  ngOnInit() {
    this.user = this.authService.getUser() || new User({});
    this.loadData();
    this.loadGroupJoinCode();

    console.log('Is logged in:', this.authService.isUserLoggedIn());
    console.log('Is in group:', this.authService.userIsInGroup(this.groupId));

    this.challengeService.getByGroupId(this.groupId).subscribe({
      next: (challenges) => {
        this.challenges = challenges;
      },
      error: (err) => {
        console.error('Error al cargar challenges:', err);
      }
    });

    // if (!this.authService.userIsInGroup(this.groupId) || !this.authService.isUserLoggedIn()) {
    //   this.router.navigate(['no-access']);
    // }

  }

  private loadData(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId')) || 0; console.log(this.groupId);
    this.getUserListForGroup(this.groupId)
  }

  async loadStudentScores() {
    for (const student of this.studentList) {
      this.studentScores[student.id] = await this.getUserScore(student);
    }
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
    for (let i = 0; i < 8; i++) {
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

      const currentDate = new Date();
      const oneWeekLater = new Date();
      oneWeekLater.setDate(currentDate.getDate() + 7);

      const newJoinCode: GroupJoinCode = new GroupJoinCode({
        key: this.newCode,
        expiration: oneWeekLater,
      });

      this.groupJoinCodeService.setForGroup(this.groupId, newJoinCode).subscribe({
        next: (code: GroupJoinCode) => {
          this.loadGroupJoinCode()
        },
        error: (err) => {
          throw new Error(err.message)
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

  private getUserListForGroup(groupId: number) {
    this.authService.getUsersByGroupId(groupId).subscribe({
      next: (users: User[]) => {
        this.studentList = []; // Reset the array
        this.teacher = new User({}); // Reset teacher

        if (users && Array.isArray(users)) {
          users.forEach((user) => {
            if (user.roles?.[0] === "ROLE_TEACHER") {
              this.teacher = user;
            } else {
              this.studentList.push(user);
            }
          });
        }

        this.loadStudentScores().then(r => console.log(r));
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.studentList = []; // Ensure it's always an array
      }
    });
  }

  async getUserScore(user: User): Promise<number> {
    try {
      const submissions = await this.submissionService
          .getSubmissionsByStudentIdAndGroupId(user.id, this.groupId)
          .toPromise();

      if (!submissions) {
        return 0;
      }

      return submissions.reduce((total, submission) => total + (submission.score || 0), 0);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return 0;
    }
  }

  kickStudent(studentId: number) {
    console.log(`Borrando estudiante con id: ${studentId}`);
    console.log("Lista de estudiantes: ");
    console.log(this.studentList);

    // Eliminar de la lista local
    this.studentList = this.studentList.filter((student) => student.id !== studentId);
    console.log("Lista de estudiantes tras borrado:");
    console.log(this.studentList);

    // Llamar a leaveGroup del servicio
    this.groupService.kickStudentFromGroup(studentId,this.groupId).subscribe({
      next: () => {
        console.log(`Estudiante ${studentId} eliminado del grupo ${this.groupId}`);
      },
      error: (err) => {
        console.error(`Error al eliminar estudiante del grupo:`, err);
      }
    });
  }

  get filteredStudents(): User[] {
    if (this.selectedStudentId) {
      return this.studentList.filter(s => s.id === this.selectedStudentId);
    }
    return this.studentList;
  }

  clearSelection() {
    this.selectedStudentId = null;
  }

}
