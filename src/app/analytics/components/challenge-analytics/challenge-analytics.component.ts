import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChallengeApiService } from '../../../challenges/services/challenge-api.service';
import { SubmissionApiService } from '../../../challenges/services/submission-api.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-challenge-analytics',
  standalone: true,
  templateUrl: './challenge-analytics.component.html',
  styleUrls: ['./challenge-analytics.component.css'],
  imports: [BaseChartDirective, CommonModule, RouterLink, MatIcon, MatProgressSpinnerModule]
})
export class ChallengeAnalyticsComponent implements OnInit {
  groupId!: number;
  isLoading = true;
  monthsLabels: string[] = [];
  challengesPerMonth: number[] = [];
  challengesWithSubmissionsPerMonth: number[] = [];
  challenges: any[] = [];
  submissionsArrays: any[] = [];

  public mixedChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        type: 'bar' as const,
        label: 'Challenges',
        data: [],
        backgroundColor: 'rgba(66,165,245,0.3)',
        borderColor: '#42a5f5',
        borderWidth: 2
      },
      {
        type: 'line' as const,
        label: 'Challenges con submissions',
        data: [],
        borderColor: '#66bb6a',
        fill: false,
        tension: 0.3
      }
    ]
  };

  public mixedChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Cantidad' },
        ticks: { stepSize: 1 } // Solo enteros
      },
      x: { title: { display: true, text: 'Mes' } }
    }
  };

  public mixedChartType: ChartType = 'bar';

  constructor(
      private route: ActivatedRoute,
      private challengeService: ChallengeApiService,
      private submissionService: SubmissionApiService
  ) {}

  ngOnInit(): void {
    this.groupId = +this.route.snapshot.paramMap.get('groupId')!;
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.challengeService.getChallengesByGroupId(this.groupId).subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        // Agrupa challenges por mes de deadline
        const monthMap: { [key: string]: any[] } = {};
        challenges.forEach(challenge => {
          const date = new Date(challenge.deadline);
          const month = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
          if (!monthMap[month]) monthMap[month] = [];
          monthMap[month].push(challenge);
        });

        this.monthsLabels = Object.keys(monthMap);

        // Obtiene submissions para cada challenge, manejando errores 404
        const submissionsRequests = challenges.map(ch =>
            this.submissionService.getByChallengeId(ch.id).pipe(
                catchError(() => of([])) // Si hay error (404), retorna array vacío
            )
        );

        forkJoin(submissionsRequests).subscribe({
          next: (submissionsArrays) => {
            this.submissionsArrays = submissionsArrays;
            this.challengesPerMonth = [];
            this.challengesWithSubmissionsPerMonth = [];

            this.monthsLabels.forEach(month => {
              const challengesInMonth = monthMap[month];
              this.challengesPerMonth.push(challengesInMonth.length);

              // Cuenta challenges con al menos una submission en ese mes
              const countWithSubmissions = challengesInMonth.filter(challenge => {
                const submissions = submissionsArrays.find(arr => arr.length && arr[0].challengeId === challenge.id) || [];
                return submissions.length > 0;
              }).length;
              this.challengesWithSubmissionsPerMonth.push(countWithSubmissions);
            });

            // Prepara datos para el gráfico
            this.mixedChartData = {
              labels: this.monthsLabels,
              datasets: [
                {
                  type: 'bar' as const,
                  label: 'Challenges',
                  data: this.challengesPerMonth,
                  backgroundColor: 'rgba(66,165,245,0.3)',
                  borderColor: '#42a5f5',
                  borderWidth: 2
                },
                {
                  type: 'line',
                  label: 'Challenges con submissions',
                  data: this.challengesWithSubmissionsPerMonth,
                  borderColor: '#66bb6a',
                  fill: false,
                  tension: 0.3
                }
              ]
            };

            this.isLoading = false;
          },
          error: () => { this.isLoading = false; }
        });
      },
      error: () => { this.isLoading = false; }
    });
  }

  getTotalChallenges(): number {
    return this.challengesPerMonth.reduce((a, b) => a + b, 0);
  }

  getTotalChallengesWithSubmissions(): number {
    return this.challengesWithSubmissionsPerMonth.reduce((a, b) => a + b, 0);
  }

  // Devuelve la cantidad de submissions para un challenge
  getSubmissionsCount(challengeId: number): number {
    const arr = this.submissionsArrays.find(arr => arr.length && arr[0].challengeId === challengeId) || [];
    return arr.length;
  }
}