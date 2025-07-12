import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ChartData,ChartConfiguration, ChartType } from 'chart.js';
import { SubmissionApiService } from '../../../challenges/services/submission-api.service';
import { MatButtonModule } from '@angular/material/button';
import {BaseChartDirective} from "ng2-charts";
import {MatIcon} from "@angular/material/icon";
import {Submission} from "../../../challenges/model/submission.entity";

@Component({
  selector: 'app-pie-analytics',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    BaseChartDirective,
    MatIcon
  ],
  templateUrl: './pie-analytics.component.html',
  styleUrls: ['./pie-analytics.component.css']
})
export class PieAnalyticsComponent implements OnInit {

  studentId!: number;
  groupId!: number;

  gradedCount = 0;
  notGradedCount = 0;

  public pieChartData: ChartData<'doughnut'> = {
    labels: ['GRADED', 'NOT_GRADED'],
    datasets: [
      { data: [0, 0] }
    ]
  };

  submissions: Submission[] = [];

  public pieChartLabels: string[] = ['GRADED', 'NOT_GRADED'];
  public pieChartDatasets = [{ data: [0, 0] }];
  public pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true
  };
  public pieChartType: 'doughnut' = 'doughnut';

  constructor(
      private route: ActivatedRoute,
      private submissionService: SubmissionApiService
  ) {}

  ngOnInit(): void {
    // Obtener params de la URL: /group/:groupId/student/:studentId/pie-analytics
    this.groupId = +this.route.snapshot.paramMap.get('groupId')!;
    this.studentId = +this.route.snapshot.paramMap.get('studentId')!;

    this.loadSubmissionsStatus();
  }

  loadSubmissionsStatus(): void {
    this.submissionService.getSubmissionsByGroupId(this.groupId)
        .subscribe({
          next: (submissions) => {
            this.submissions = submissions; // Guarda todas para la tabla

            this.gradedCount = submissions.filter(sub => sub.status === 'GRADED').length;
            this.notGradedCount = submissions.filter(sub => sub.status === 'NOT_GRADED').length;

            this.pieChartData = {
              labels: ['GRADED', 'NOT_GRADED'],
              datasets: [
                { data: [this.gradedCount, this.notGradedCount] }
              ]
            };
          },
          error: (err) => console.error('Error al cargar submissions:', err)
        });
  }

  calculateAverage(): number {
    if (!this.submissions?.length) return 0;
    const sum = this.submissions.reduce((acc, sub) => acc + sub.score, 0);
    return sum / this.submissions.length;
  }


}
