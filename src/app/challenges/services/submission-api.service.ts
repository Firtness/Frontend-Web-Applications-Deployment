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

  createSubmission(submission: Submission):Observable<Submission> {
    return this.create(submission);
  }

  updateSubmission(id: number, submission: Submission): Observable<Submission> {
    return this.update(id, submission);
  }

  getByStudentId(studentId: number): Observable<Submission[]> {
    const url = `${this.resourcePath()}/student/${studentId}`;
    return this.http.get<Submission[]>(url, this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }


}
