import {ProfileInGroup} from "./profile-in-group.entity";

export type Role = 'ROLE_STUDENT' | 'ROLE_TEACHER';
export class User {
    id: number;              // Solo para el backend
    email: string;             // Requerido y único
    firstName: string;
    lastName: string;
    role: Role;                // Solo 'estudiante' o 'profesor'
    password: string;         // Solo para formularios (¡nunca lo almacenes en frontend!)
    profilesInGroups?: ProfileInGroup[];


    constructor(user:{id?: number, email?: string, firstName?: string, lastName?: string, role?: Role, password?: string, profilesInGroups?: ProfileInGroup[]}) {
        this.id = user.id || 0;
        this.email = user.email || '';
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.role = user.role || 'ROLE_STUDENT';
        this.password = user.password || '';
        this.profilesInGroups = user.profilesInGroups || [];
    }
}