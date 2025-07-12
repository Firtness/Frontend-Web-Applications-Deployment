import { Injectable } from '@angular/core';
import {Environment} from "@angular/cli/lib/config/workspace-schema";
import {environment} from "../../../environments/environment.development";
import {BaseService} from "../../shared/services/base.service";
import {Submission} from "../model/submission.entity";
import {catchError, Observable, retry} from "rxjs";

const submissionsResourceEndpoint = environment.submissionsEndpointPath; // Replace with actual endpoint
@Injectable({
  providedIn: 'root'
})
export class SubmissionApiService extends BaseService<Submission>{

  constructor() {
    super();
    this.resourceEndpoint = submissionsResourceEndpoint ;
  }

  getByChallengeId(challengeId: number): Observable<Array<Submission>> {
    const url = `${this.resourcePath()}/challenge/${challengeId}`;
    return this.http.get<Array<Submission>>(url, this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }

  createSubmission(submission: {
    challengeId: number,
    content: String,
    imageUrl: string
  }):Observable<Submission> {
    return this.http.post<Submission>(`${this.resourcePath()}`, submission, this.httpOptions);
  }

  updateSubmission(id: number, submission: Submission): Observable<Submission> {
    return this.update(id, submission);
  }

  getByStudentId(studentId: number): Observable<Submission[]> {
    const url = `${this.resourcePath()}/student/${studentId}`;
    return this.http.get<Submission[]>(url, this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }

  gradeSubmission(id: number, score: number): Observable<Submission> {
    return this.http.put<Submission>(`${this.resourcePath()}/${id}/grade`, { score: score }, this.httpOptions)
  }

  getSubmissionsByStudentIdAndGroupId(studentId: number, groupId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.resourcePath()}/student/${studentId}/group/${groupId}`, this.httpOptions)
  }

  getByStudentIdAndChallengeId(studentId: number, challengeId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.resourcePath()}/students/${studentId}/challenges/${challengeId}`, this.httpOptions)
  }

  getSubmissionsByGroupId(groupId: number): Observable<Submission[]> {
    const url = `${this.resourcePath()}/group/${groupId}`;
    return this.http.get<Submission[]>(url, this.httpOptions)
        .pipe(
            retry(2),
            catchError(this.handleError)
        );
  }

}
