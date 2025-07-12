import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {BaseService} from "../../shared/services/base.service";
import {GroupJoinCode} from "../model/group-join-code.entity";
import {catchError, map, Observable, retry} from "rxjs";
import {Group} from "../model/group.entity";

const groupsResourceEndpoint = environment.groupsEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class GroupJoinCodeService extends BaseService<GroupJoinCode> {

  constructor() {
    super();
    this.resourceEndpoint = groupsResourceEndpoint;
  }

  public joinUserToGroupByKey(key: string): Observable<Group> {
      return this.http.get<Group>(`${this.resourcePath()}/join/${key}`, this.httpOptions);
  }

  public getByKey(key: string): Observable<GroupJoinCode> {
    return this.http.get<GroupJoinCode[]>(`${this.resourcePath()}?key=${key}`, this.httpOptions)
        .pipe(
            retry(2),
            map((codes: GroupJoinCode[]) => {
              const foundCode = codes.find(code => code.key === key);
              if (!foundCode) {
                throw new Error('Code not found');
              }
              return foundCode;
            }),
            catchError(this.handleError)
        );
  }

  public getByGroupId(groupId: number): Observable<GroupJoinCode> {
        return this.http.get<GroupJoinCode>(`${this.resourcePath()}/${groupId}/groupJoinCodes`, this.httpOptions)
  }

  public setForGroup(groupId: number, groupJoinCode: GroupJoinCode): Observable<GroupJoinCode> {
      return this.http.put<GroupJoinCode>(`${this.resourcePath()}/${groupId}/groupJoinCodes`, JSON.stringify(groupJoinCode), this.httpOptions)
  }

  public deleteByGroupId(groupId: number): Observable<any> {
      return this.http.delete<any>(`${this.resourcePath()}/${groupId}/groupJoinCodes/reset`, this.httpOptions)
          .pipe( retry(2), catchError(this.handleError));
  }

  public codeExists(key: string): Observable<boolean> {
      return this.http.get<GroupJoinCode[]>(`${this.resourcePath()}/groupJoinCode/${key}`, this.httpOptions)
          .pipe(
              map((codes) => codes.length > 0),
              catchError(this.handleError)
          );
  }
}
