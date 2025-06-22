import { Routes } from '@angular/router';
import {HomeComponent} from './public/pages/home/home.component';
import {LoginComponent} from './iam/pages/login/login.component';
import {RegisterComponent} from "./iam/pages/register/register.component";
import {GroupViewComponent} from "./group/pages/group-view/group-view.component";
import {ChallengeViewComponent} from "./challenges/pages/challenge-view/challenge-view.component";
import {GroupMembersViewComponent} from "./group/pages/group-members-view/group-members-view.component";
import {NoAccessPageComponent} from "./public/pages/no-access-page/no-access-page.component";
import { StudentAnalyticsComponent } from './analytics/components/student-analytics/student-analytics.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  { path: 'dashboard', component: HomeComponent },
  { path: 'auth', component: AuthLayoutComponent },
  {
    path: 'profile',
    loadComponent: () => import('./iam/pages/profile/profile.component').then(m => m.ProfileComponent)
  },

  { path: 'group/:groupId', component: GroupViewComponent },
  { path: 'group/:groupId/members', component: GroupMembersViewComponent },
  { path: 'group/:groupId/challenge/:challengeId', component: ChallengeViewComponent },
  { path: 'group/:groupId/student/:studentId/analytics', component: StudentAnalyticsComponent },
  { path: 'no-access', component: NoAccessPageComponent },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'group/:groupId/student/:studentId/analytics',
    component: StudentAnalyticsComponent
  }
];
