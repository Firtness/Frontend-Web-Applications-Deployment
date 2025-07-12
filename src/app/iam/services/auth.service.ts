import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError, switchMap, map, lastValueFrom} from 'rxjs';
import {User} from "../model/user.entity";
import {BaseService} from "../../shared/services/base.service";
import {environment} from "../../../environments/environment";
import {GroupJoinCodeService} from "../../group/services/group-join-code.service";
import {ProfileInGroup} from "../model/profile-in-group.entity";


const usersResourceEndpoint = environment.usersEndpointPath;
const authenticationResourceEndpoint = environment.authenticationEndpointPath;
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<User> {

    private readonly authenticationPath: string;

  constructor() {
      super();
      this.resourceEndpoint = usersResourceEndpoint;
      this.authenticationPath = authenticationResourceEndpoint;
  }


  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.serverBaseUrl}${this.authenticationPath}/sign-in`, {
        "email": email,
        "password": password
    }, this.httpOptions);

  }

  register(signUp: {
      email: string,
      firstName: string,
      lastName: string,
      password: string,
      roles: string[],
           }): Observable<User> {
    return this.http.post<User>(`${this.serverBaseUrl}${this.authenticationPath}/sign-up`, JSON.stringify(signUp), this.httpOptions)
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.clear();
  }

  getUser(): User | null {
    return JSON.parse(localStorage.getItem('auth_user') || 'null') || null;
  }

  getToken(): string | null {
      return localStorage.getItem('auth_token');
  }

  setToken(token: string) {
      this.tokenService.setToken(token)
  }

  setUser(user: User): void {
      localStorage.setItem('auth_user', JSON.stringify(user));
  }

  getAllProfilesInGroups(user: User): Observable<ProfileInGroup[]> {
        return new Observable(observer => {
            if (user.profilesInGroups) {
                observer.next(user.profilesInGroups);
            } else {
                observer.next([]);
            }
            observer.complete();
        });
  }

  deleteProfileInGroups(user: User, groupId: number): Observable<User> {
      if (user.profilesInGroups) {
          user.profilesInGroups = user.profilesInGroups.filter(profile => profile.groupId !== groupId);
      }
      return super.update(user.id, user);
  }

  getUsersByGroupId(groupId: number): Observable<User[]> {
      return this.http.get<User[]>(`${this.resourcePath()}/group/${groupId}`, this.httpOptions);
  }

  isUserLoggedIn(): boolean {
      return this.getUser() !== null;
  }

  userIsInGroup(groupId: number): boolean {
      let groups: Array<number> = []
      this.getUser()?.profilesInGroups?.map((profile) => {
          groups.push(profile.groupId);
      });

      return groups.includes(groupId)
  }

  getUserById(id: number): Observable<User> {
      return this.http.get<User>(`${this.resourcePath()}/${id}`, this.httpOptions);
  }



    leaveGroup(groupId: number): Observable<void> {
        const url = `${this.resourcePath()}/leave/${groupId}`;
        return this.http.delete<void>(url, this.httpOptions);
    }

    updateUserProfile(userId: number, userData: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.resourcePath()}/${userId}`, userData, this.httpOptions);
    }

    findById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.resourcePath()}/${userId}`, this.httpOptions);
    }

}