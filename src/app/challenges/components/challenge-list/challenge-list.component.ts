import {Component, Input, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Challenge} from "../../model/challenge.entity";
import {ChallengeApiService} from "../../services/challenge-api.service";
import {ChallengeCardItemComponent} from "../challenge-card-item/challenge-card-item.component";
import {GroupService} from "../../../group/services/group.service";
import {AuthService} from "../../../iam/services/auth.service";
import {User} from "../../../iam/model/user.entity";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-challenge-list',
    imports: [
        MatGridList,
        MatGridTile,
        ChallengeCardItemComponent,
        TranslatePipe
    ],
  templateUrl: './challenge-list.component.html',
  standalone: true,
  styleUrl: './challenge-list.component.css'
})
export class ChallengeListComponent implements OnInit {
  challenges: Challenge[] = [];
  @Input() currentGroupId:number=0;
  currentUser: User = new User({});


  constructor(private challengeService: ChallengeApiService
      ,private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAvailableChallenges()
    this.currentUser= this.authService.getUser() || new User({});
  }

  public getAvailableChallenges():void{
    this.challenges=[]
    this.challengeService.getByGroupId(this.currentGroupId).subscribe(
        {
          next: (challenges) => {
            this.challenges = challenges;
          },
          error: () => this.challenges = []
        }

    )

  }


}
