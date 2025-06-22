import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import {ChallengeApiService} from "../../../challenges/services/challenge-api.service";
import {forkJoin} from "rxjs";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // ✅ Spinner
import { MatIcon } from '@angular/material/icon';


Chart.register(...registerables);

@Component({
  selector: 'app-student-analytics',
  standalone: true,
  templateUrl: './student-analytics.component.html',
  styleUrls: ['./student-analytics.component.css'],
  imports: [
    RouterLink,
    BaseChartDirective,
    DecimalPipe,
    SlicePipe,
    MatIcon,
    MatProgressSpinnerModule // ✅ AÑADIDO PARA USAR <mat-spinner>
  ],

})
export class StudentAnalyticsComponent implements OnInit {
  studentId!: number;
  groupId!: number;
  studentName!: string;
  submissions: any[] = [];
  isLoading = true;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: [],
      label: 'Notas del estudiante',
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.3
    }],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        title: { display: true, text: 'Nota (Score)' }
      },
      x: {
        title: { display: true, text: 'Tareas' }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  constructor(
      private route: ActivatedRoute,
      private analyticsService: AnalyticsService,
      private challengeService: ChallengeApiService
  ) {}

  ngOnInit(): void {
    this.studentId = +this.route.snapshot.paramMap.get('studentId')!;
    this.groupId = +this.route.snapshot.paramMap.get('groupId')!;

    this.analyticsService.getStudentName(this.studentId).subscribe({
      next: ({ firstName, lastName }) => {
        this.studentName = `${firstName} ${lastName}`.trim() || 'Estudiante';
      },
      error: () => {
        this.studentName = 'Estudiante';
      }
    });

    this.loadStudentSubmissions(); // 👈 Nuevo método
  }

  loadStudentSubmissions() {
    this.analyticsService.getSubmissionsByStudentIdAndGroupId(this.studentId,this.groupId).subscribe({
      next: (submissions) => {
        this.submissions = submissions;
        console.log(submissions)
        console.log(this.submissions)


        const scores = submissions.map(sub => sub.score);


        this.lineChartData = {
          datasets: [{
            data: scores,
            label: 'Notas del estudiante',
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3
          }],
          labels: submissions.map((_, i) => `Tarea ${i + 1}`)
        };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar submissions del estudiante:', err);
        this.isLoading = false;
      }
    });
  }

  loadStudentSubmissionsByChallenge(challengeId: number) {
    this.analyticsService.getStudentSubmissionByChallenge(this.studentId, challengeId).subscribe({
      next: (submissions) => {
        console.log('Submissions por challenge:', submissions);

        this.submissions = submissions;
        const scores = submissions.map(sub => sub.score);

        this.lineChartData = {
          datasets: [{
            data: scores,
            label: 'Notas del estudiante',
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3
          }],
          labels: submissions.map((_, i) => `Intento ${i + 1}`)
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando submissions del estudiante:', err);
        this.isLoading = false;
      }
    });
  }

  loadStudentScores() {
    console.log('Cargando scores para estudiante en grupo:', this.studentId, this.groupId);

    this.challengeService.getChallengesByGroupId(this.groupId).subscribe({
      next: (challenges) => {
        const requests = challenges.map(ch =>
            this.analyticsService.getStudentSubmissionByChallenge(this.studentId, ch.id)
        );

        forkJoin(requests).subscribe({
          next: (responses) => {
            const allSubmissions = responses.flat(); // une todos los arrays en uno solo
            const scores = allSubmissions.map(sub => sub.score);

            this.submissions = allSubmissions;
            this.lineChartData = {
              datasets: [{
                data: scores,
                label: 'Notas del estudiante',
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3
              }],
              labels: allSubmissions.map((_, i) => `Tarea ${i + 1}`)
            };
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error cargando submissions del estudiante:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error cargando challenges del grupo:', err);
        this.isLoading = false;
      }
    });
  }

  calculateAverage(): number {
    if (this.submissions.length === 0) return 0;
    const sum = this.submissions.reduce((acc, curr) => acc + curr.score, 0);
    return sum / this.submissions.length;
  }
}
