export class GroupJoinCode {
    key: string;
    expiration: Date;

    constructor(groupJoinCode: {
        key?: string,
        expiration?: Date;
    }) {
        this.key = groupJoinCode.key || '';
        this.expiration = groupJoinCode.expiration || new Date();
    }
}
