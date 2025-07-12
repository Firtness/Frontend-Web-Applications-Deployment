export class Submission {
    id:number;
    challengeId:number;
    studentId:number;
    content:string;
    score:number;
    imageUrl:string;
    status: string;

    constructor(submission:{id?:number, challengeId?:number, studentId?:number, content?:string, score?:number, imageUrl?:string, status?:string}) {
        this.id = submission.id || 0;
        this.challengeId = submission.challengeId || 0;
        this.studentId = submission.studentId || 0;
        this.content = submission.content || '';
        this.score = submission.score || 0;
        this.imageUrl = submission.imageUrl || `https://picsum.photos/seed/${Date.now() + Math.random()}/1600/800`;
        this.status = submission.status || '';
    }
}
