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
        MatIconButton
    ],
    templateUrl: './group-item.component.html',
    standalone: true,
    styleUrl: './group-item.component.css'
})
export class GroupItemComponent implements OnInit {
    @Input() group: Group = new Group({});
    @Input() groupProfile: ProfileInGroup = new ProfileInGroup({});

    randomDuration: string = '';

    ngOnInit(): void {
        this.randomDuration = this.generateRandomDuration();
    }

    private generateRandomDuration(): string {
        const hours = Math.floor(Math.random() * 4) + 1; // 1 to 4 hours
        const minutes = Math.floor(Math.random() * 60);  // 0 to 59 minutes
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
}
