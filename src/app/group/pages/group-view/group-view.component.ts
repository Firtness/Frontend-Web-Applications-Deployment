import {Component, OnInit, ViewChild} from '@angular/core';
import {Group} from "../../model/group.entity";
import {GroupService} from "../../services/group.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatCardModule } from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {User} from "../../../iam/model/user.entity";
import {AuthService} from "../../../iam/services/auth.service";
import {ProfileInGroup} from "../../../iam/model/profile-in-group.entity";
import {ChallengeListComponent} from "../../../challenges/components/challenge-list/challenge-list.component";
import {GroupJoinCodeService} from "../../services/group-join-code.service";
import {MatDialog} from "@angular/material/dialog";
import {ChallengeCreateComponent} from "../../../challenges/components/challenge-create/challenge-create.component";
import {ChallengeApiService} from "../../../challenges/services/challenge-api.service";

import {TranslatePipe} from "@ngx-translate/core";

import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';



@Component({
  selector: 'app-group-view',
    imports: [
        MatCardModule,
        MatButton,
        RouterLink,
        ChallengeListComponent,
        TranslatePipe
    ],
  templateUrl: './group-view.component.html',
  standalone: true,
  styleUrl: './group-view.component.css'
})
export class GroupViewComponent implements OnInit {


  @ViewChild('challengeList') challengeListComponent!: ChallengeListComponent;

  // User
  user: User = new User({});
  userGroupProfile: ProfileInGroup = new ProfileInGroup({})

  groupId!: number;

  group: Group = new Group({});
  isLoading = true;

  constructor(
      private createDialog: MatDialog,
      private groupService: GroupService,
      private route: ActivatedRoute,
      private authService: AuthService,
      private challengeService: ChallengeApiService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.getActualUser();
    this.loadData();

    console.log('Is logged in:', this.authService.isUserLoggedIn());
    console.log('Is in group:', this.authService.userIsInGroup(this.groupId));

    // if (!this.authService.userIsInGroup(this.groupId) || !this.authService.isUserLoggedIn()) {
    //   this.router.navigate(['no-access']);
    // }
  }

  private getActualUser() {
    this.user = this.authService.getUser() || new User({});
  }

  private loadData(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));

    if (this.groupId) {
      this.groupService.getById(this.groupId).subscribe({
        next: (group) => {
          this.group = group;
          this.isLoading = false;
          this.loadUserProfile();
        },
        error: (err) => {
          console.error('Error loading group:', err);
          this.isLoading = false;
          this.router.navigate(['no-access']);
        }
      });
    }
  }

  private loadUserProfile(): void {
    console.log('Grupo: ', this.group)

    this.userGroupProfile = this.user.profilesInGroups?.find(profile => profile.groupId === this.group.id) || new ProfileInGroup({});
    console.log('User Group Profile: ', this.userGroupProfile)
  }

  leaveGroup(): void {
    const dialogRef = this.createDialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Leave Group',
        message: 'Are you sure you want to leave this group? You will lose access to all its challenges.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const studentId = this.user.id;
        this.authService.leaveGroup(this.groupId).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error(`Error al eliminar estudiante del grupo:`, err);
          }
        });
      }
    });
  }

  deleteGroup(): void {
    const dialogRef = this.createDialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Group',
        message: 'Are you sure you want to delete this group? This action cannot be undone and all challenges will be lost.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.delete(this.groupId).subscribe({
          next: (group) => {
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Error deleting group:', err);
          }
        });
      }
    });
  }



  openCreateChallengeDialog(): void {
    const dialogRef = this.createDialog.open(ChallengeCreateComponent, {
      width: "600px",
      data: { groupId: this.groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.challengeService.create(result).subscribe({
          next: () => {
            // Ahora sí: esto es seguro y correcto
            if (this.challengeListComponent) {
              this.challengeListComponent.getAvailableChallenges();
            }
          }
        });
      }
    });
  }
}
