import { Component, Input, OnInit } from '@angular/core';
import { Group } from "../../model/group.entity";
import {
    MatCard, MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatCardHeader, MatCardImage,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import { MatButton, MatIconButton } from "@angular/material/button";
import { ProfileInGroup } from "../../../iam/model/profile-in-group.entity";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";

import {TranslatePipe} from "@ngx-translate/core";

import {AuthService} from "../../../iam/services/auth.service";
import {SubmissionApiService} from "../../../challenges/services/submission-api.service";
import {User} from "../../../iam/model/user.entity";


@Component({
    selector: 'app-group-item',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardSubtitle,
        MatCardContent,
        MatCardFooter,
        RouterLink,
        MatCardImage,
        MatIcon,
        MatIconButton,
        TranslatePipe
    ],
    templateUrl: './group-item.component.html',
    standalone: true,
    styleUrl: './group-item.component.css'
})
export class GroupItemComponent implements OnInit {
    @Input() group: Group = new Group({});
    @Input() groupProfile: ProfileInGroup = new ProfileInGroup({});

    user: User | null = new User({})
    userScore: number = 0;

    constructor(
        private authService: AuthService,
        private submissionService: SubmissionApiService
    ) {}


    ngOnInit(): void {
        this.user = this.authService.getUser();

        if (this.user) {
            this.getUserScore(this.user).then(r => {this.userScore = r})
        }
    }

    async getUserScore(user: User): Promise<number> {
        try {
            const submissions = await this.submissionService
                .getSubmissionsByStudentIdAndGroupId(user.id, this.group.id)
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

}
