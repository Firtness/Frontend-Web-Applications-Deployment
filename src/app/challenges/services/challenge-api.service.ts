import { Injectable } from '@angular/core';

import {Challenge} from "../model/challenge.entity";
import {environment} from "../../../environments/environment";
import {catchError, map, Observable, retry} from "rxjs";
import {BaseService} from "../../shared/services/base.service";


const challengesResourceEndpoint = environment.challengesEndpointPath;
@Injectable({
  providedIn: 'root'
})
export class ChallengeApiService extends BaseService<Challenge>{

  constructor() {
    super();
    this.resourceEndpoint = challengesResourceEndpoint;
  }

  getByGroupId(groupId: number): Observable<Array<Challenge>> {
    const url = `${this.resourcePath()}/group/${groupId}`;
    return this.http.get<Challenge[]>(url, this.httpOptions)
        .pipe(retry(2), catchError(this.handleError));
  }

  challengeExists(challengeId: number): Observable<boolean> {
    return this.getAll().pipe(
      map(challenges => challenges.some(challenge => challenge.id === challengeId))
    );
  }

  getChallengesByGroupId(groupId: number): Observable<Challenge[]> {
    const url = `${this.resourcePath()}/group/${groupId}`;
    return this.http.get<Challenge[]>(url, this.httpOptions);
  }

}
