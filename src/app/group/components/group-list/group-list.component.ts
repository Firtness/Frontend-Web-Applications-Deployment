import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';

import {Group} from "../../model/group.entity";
import {GroupService} from "../../services/group.service";
import {GroupItemComponent} from "../group-item/group-item.component";
import {MatFormField, MatHint, MatInput, MatLabel} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {GroupJoinCode} from "../../model/group-join-code.entity";
import {GroupJoinCodeService} from "../../services/group-join-code.service";
import {AuthService} from "../../../iam/services/auth.service";
import {ProfileInGroup} from "../../../iam/model/profile-in-group.entity";
import {User} from "../../../iam/model/user.entity";
import {MatDialog} from "@angular/material/dialog";
import {GroupCreateAndEditComponent} from "../group-create-and-edit/group-create-and-edit.component";
import {Router} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    GroupItemComponent,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    MatIcon,
    MatIconButton,
    MatButton,
    MatHint,
    TranslatePipe
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent implements OnInit{

  @ViewChild('reactiveBox') reactiveBox!: ElementRef;

  loadingGroups: boolean = true;

  user: User = new User({});
  profilesInGroups: ProfileInGroup[] = [];

  joinCodeString: string = '';
  joinCode!: GroupJoinCode;
  joinFailed: boolean = false;
  groups: Group[] = [];

  constructor(
      private createDialog: MatDialog,
      private groupService: GroupService,
      private groupJoinCodeService: GroupJoinCodeService,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isUserLoggedIn()) {
      this.router.navigate(['auth']);
    }


    this.getActualUser();

    this.getAvailableGroups()
  }

  private getActualUser() {
    this.user = this.authService.getUser() || new User({});
  }

  private getAvailableGroups(): void {
    this.groupService.getGroupsFromUser(this.user.id).subscribe(
        {
          next: (groups) => {
            this.groups = groups;
            this.loadingGroups = false
          },
          error: err => {
            if (err.status === 404) {
              this.groups = []
              this.loadingGroups = false
            }
          }
        })
  }

  submitCode(): void {
    this.joinCode = new GroupJoinCode({});


    this.groupJoinCodeService.joinUserToGroupByKey(this.joinCodeString).subscribe({
      next: (group) => {
        this.getActualUser();
        this.getAvailableGroups();
        this.joinCodeString = ''
      },
      error: (err) =>
      {
        this.joinFailed = true;
        throw new Error(err.message)

      }
    })
  }

  findGroupById(id: number): Group {
    return this.groups.find(group => group.id === id) || new Group({});
  }

  findGroupProfileById(id: number): ProfileInGroup {
    return this.profilesInGroups.find(profile => profile.groupId === id) || new ProfileInGroup({});
  }

  openCreateGroupDialog(): void {
    const dialogRef = this.createDialog.open(GroupCreateAndEditComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createGroup(result);
      }
    });
  }

  private createGroup(groupData: { name: string, description: string }): void {
    const newGroup = new Group({
      name: groupData.name,
      description: groupData.description,
    });


    console.log("Group to create: ");
    console.log(newGroup);

    this.groupService.createGroupAsTeacher(newGroup).subscribe({
      next: (group) => {
        console.log(group);
        this.getActualUser();
        this.getAvailableGroups();

      },
      error: (err) => {
        throw new Error(err.message)
      }
    })
  }
}
