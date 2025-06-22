import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatInput} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SubmissionApiService} from "../../services/submission-api.service";
import {MatButton} from "@angular/material/button";
import {Submission} from "../../model/submission.entity";

@Component({
  selector: 'app-submission-edit',
  templateUrl: './submission-edit.component.html',
  imports: [
    MatInput,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButton,
  ],
  styleUrls: ['./submission-edit.component.css']
})
export class SubmissionEditComponent implements OnInit {
  submissionForm!: FormGroup;
  submissionToUpdate: Submission = new Submission({});
  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<SubmissionEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private submissionService: SubmissionApiService
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
  }

  onSubmit(): void {
    if (this.submissionForm.valid) {
      this.submissionToUpdate = { ...this.submissionForm.getRawValue() };

      // 🔄 Asegúrate de pasar también la imageUrl si es necesaria
      if (!this.submissionToUpdate.imageUrl) {
        this.submissionToUpdate.imageUrl = this.data.imageUrl; // o asigna una default
      }

      this.submissionService.updateSubmission(this.submissionToUpdate.id, this.submissionToUpdate).subscribe({
        next: (response) => {
          console.log('Submission updated successfully', response);

          // ⬇️ Cerramos el diálogo y notificamos que hubo cambios
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