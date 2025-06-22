import {Injectable} from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {Group} from "../model/group.entity";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

const groupsResourceEndpoint = environment.groupsEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService<Group> {

  constructor() {
    super();
    this.resourceEndpoint = groupsResourceEndpoint;
  }

  public getGroupsFromUser(userId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.resourcePath()}/user/${userId}`, this.httpOptions);
  }

  public createGroupAsTeacher(userId: number, group: Group): Observable<Group> {
    return this.http.post<Group>(`${this.resourcePath()}/teacher/${userId}`, JSON.stringify(group), this.httpOptions);
  }

  public getGroupsByUserId(userId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.resourcePath()}/user/${userId}`, this.httpOptions);
  }

  

}
