import {Component, Inject, NgModule} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from "@angular/material/form-field";

import { ReactiveFormsModule } from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";


@Component({
  selector: 'app-challenge-create',
    imports: [
        FormsModule,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatButton,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule, // ✅ importante para DateAdapter
        MatLabel,
        ReactiveFormsModule,
        MatIcon,
        TranslatePipe
    ],
  templateUrl: './challenge-create.component.html',
  standalone: true,
  styleUrl: './challenge-create.component.css'
})
export class ChallengeCreateComponent {
  challengeData = {
    title: '',
    description: '',
    groupId: 0,
    deadline: new Date(),
    imageUrl: '',
  }

  minDate = new Date(); // Fecha mínima (hoy)

  constructor(
      public dialogRef: MatDialogRef<ChallengeCreateComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data?.groupId) {
      this.challengeData.groupId = data.groupId;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (
        this.challengeData.title &&
        this.challengeData.description &&
        this.challengeData.deadline
    ) {
      // Generar imagen aleatoria
      const randomId = Math.floor(Math.random() * 1000);
      this.challengeData.imageUrl = `https://picsum.photos/seed/${randomId}/600/300`;

      console.log(this.challengeData);
      this.dialogRef.close(this.challengeData);
    }
  }
}
