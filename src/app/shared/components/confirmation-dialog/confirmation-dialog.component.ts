import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      <mat-dialog-content class="dialog-content">
        <div class="bee-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
            <path fill="#FFD700"
                  d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
            <path fill="#000000" d="M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z"/>
            <path fill="#FFD700" d="M7,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S8.1,10,7,10z"/>
            <path fill="#FFD700" d="M17,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S18.1,10,17,10z"/>
          </svg>
        </div>
        <p class="dialog-message">{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button mat-dialog-close class="cancel-button">Cancel</button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true" class="confirm-button">Confirm</button>
      </mat-dialog-actions>
    </div>
  `,
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent
  ],
  styles: [`
    .dialog-container {
      background-color: white;
      border-radius: 12px;
      padding: 20px;
      border: 2px solid #FFD700;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .dialog-title {
      color: #000000;
      font-weight: bold;
      text-align: center;
      margin-bottom: 16px;
      border-bottom: 2px solid #FFD700;
      padding-bottom: 8px;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 0;
    }

    .bee-icon {
      margin-bottom: 16px;
    }

    .dialog-message {
      color: #333333;
      text-align: center;
      font-size: 16px;
      margin: 0;
    }

    .dialog-actions {
      margin-top: 16px;
      padding: 8px 0;
      border-top: 1px solid #EEEEEE;
    }

    .cancel-button {
      color: #000000;
      border: 1px solid #000000;
      margin-right: 8px;
    }

    .confirm-button {
      background-color: #FFD700;
      color: #000000;
      font-weight: bold;
    }

    .confirm-button:hover {
      background-color: #FFC000;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
      public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
}