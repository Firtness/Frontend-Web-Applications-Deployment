import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-edit-profile-dialog',
    standalone: true,
    templateUrl: './edit-profile-dialog.component.html',
    styleUrls: ['./edit-profile-dialog.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class EditProfileDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<EditProfileDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    save() {
        this.dialogRef.close(this.data);
    }

    close() {
        this.dialogRef.close();
    }
}
