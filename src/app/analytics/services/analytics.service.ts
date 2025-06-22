import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Submission} from "../../challenges/model/submission.entity";

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private apiUrl = environment.serverBaseUrl;

    constructor(private http: HttpClient) {}

    getStudentScores(studentId: number): Observable<{scores: number[], submissions: any[]}> {
        return this.http.get<any[]>(`${this.apiUrl}/submissions?studentId=${studentId}`).pipe(
            map(submissions => {
                console.log('Submissions recibidas:', submissions);
                const scores = submissions.map(sub => sub.score);
                return { scores, submissions };
            }),
            catchError(error => {
                console.error('Error al obtener submissions:', error);
                return of({ scores: [], submissions: [] });
            })
        );
    }

    getStudentName(studentId: number): Observable<{firstName: string, lastName: string}> {
        return this.http.get<any>(`${this.apiUrl}/users/${studentId}`).pipe(
            map(user => ({
                firstName: user.firstName || '',
                lastName: user.lastName || ''
            })),
            catchError(() => of({firstName: 'Estudiante', lastName: ''}))
        );
    }

    getStudentSubmissionByChallenge(studentId: number, challengeId: number): Observable<Submission[]> {
        return this.http.get<Submission[]>(`${this.apiUrl}/submissions/students/${studentId}/challenges/${challengeId}`);
    }

    getSubmissionsByStudentId(studentId: number): Observable<Submission[]> {
        return this.http.get<Submission[]>(`${this.apiUrl}/submissions/student/${studentId}`);
    }

    getSubmissionsByStudentIdAndGroupId(studentId: number, groupId: number): Observable<Submission[]> {
        return this.http.get<Submission[]>(`${this.apiUrl}/submissions/student/${studentId}/group/${groupId}`);
    }
}