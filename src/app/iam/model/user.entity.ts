import {ProfileInGroup} from "./profile-in-group.entity";

export type Role = 'ROLE_STUDENT' | 'ROLE_TEACHER';
export class User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
    roles: Role[];
    profilesInGroups?: ProfileInGroup[];


    constructor(user:{id?: number, email?: string, firstName?: string, lastName?: string, token?: string, roles?: Role[], password?: string, profilesInGroups?: ProfileInGroup[]}) {
        this.id = user.id || 0;
        this.email = user.email || '';
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.token = user.token || '';
        this.roles = user.roles || [];
        this.profilesInGroups = user.profilesInGroups || [];
    }
}