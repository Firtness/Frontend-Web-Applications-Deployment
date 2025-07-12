import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatInput} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SubmissionApiService} from "../../services/submission-api.service";
import {MatButton} from "@angular/material/button";
import {Submission} from "../../model/submission.entity";
import {NgIf} from "@angular/common";
import {AuthService} from "../../../iam/services/auth.service";
import {User} from "../../../iam/model/user.entity";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-submission-edit',
  templateUrl: './submission-edit.component.html',
    imports: [
        MatInput,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButton,
        NgIf,
        TranslatePipe,
    ],
  standalone: true,
  styleUrls: ['./submission-edit.component.css']
})
export class SubmissionEditComponent implements OnInit {
  submissionForm!: FormGroup;
  submissionToUpdate: Submission = new Submission({});
  student: User = new User({});
  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<SubmissionEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private submissionService: SubmissionApiService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.submissionForm = this.fb.group({
      id: [{ value: this.data.id, disabled: true }],
      challengeId: [{ value: this.data.challengeId, disabled: true }],
      studentId: [{ value: this.data.studentId, disabled: true }],
      content: [{ value: this.data.content, disabled: true }],
      score: [this.data.score, Validators.required],
      imageUrl: [{ value: this.data.imageUrl, disabled: true }]
    });

    this.authService.getUserById(this.data.studentId).subscribe({
      next: (response) => {
        this.student = response;
      },
      error: (err) => {
        throw new Error(err.message);
      }
    })

  }

  onSubmit(): void {
    if (this.submissionForm.valid) {
      this.submissionToUpdate = { ...this.submissionForm.getRawValue() };

      if (!this.submissionToUpdate.imageUrl) {
        this.submissionToUpdate.imageUrl = this.data.imageUrl; // o asigna una default
      }

      this.submissionService.gradeSubmission(this.submissionToUpdate.id, this.submissionToUpdate.score).subscribe({
        next: (response) => {
          console.log('Submission updated successfully', response);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating submission', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}