import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { NetworkComponent } from './auth/network/network.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { UserSettingsComponent } from './auth/user-settings/user-settings.component';
import { HomeComponent } from './home/home.component';
import { CreatePostComponent } from './post/create-post/create-post.component';
import { ViewPostComponent } from './post/view-post/view-post.component';
import { UpdateBioComponent } from './update-bio/update-bio.component';
import {JobpostTileComponent} from "./shared/jobpost-tile/jobpost-tile.component";
import {CreateJobpostComponent} from "./jobpost/create-jobpost/create-jobpost.component";
import {ViewJobpostComponent} from "./jobpost/view-jobpost/view-jobpost.component";
import {NotificationComponent} from "./notification/notification/notification.component";
import {SendmessageComponent} from "./sendmessage/sendmessage.component";
import {MessagesComponent} from "./auth/messages/messages.component";
import {FriendrequestsComponent} from "./friendrequests/friendrequests.component";
import {SearchUserComponent} from "./search-user/search-user.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent },
  { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard]},
  { path: 'jobposts', component: JobpostTileComponent, canActivate: [AuthGuard] },
  { path: 'create-jobpost', component: CreateJobpostComponent, canActivate: [AuthGuard]},
  { path: 'view-jobpost/:id', component: ViewJobpostComponent, canActivate: [AuthGuard]},
  { path: 'network', component: NetworkComponent, canActivate: [AuthGuard] },
  { path: 'network/:name', component: NetworkComponent, canActivate: [AuthGuard] },
  { path: 'user-settings', component: UserSettingsComponent, canActivate: [AuthGuard] },
  { path: 'update-bio', component: UpdateBioComponent, canActivate: [AuthGuard] },
  { path: 'view-post/:id', component: ViewPostComponent, canActivate: [AuthGuard]},
  { path: 'user-profile/:name', component: UserProfileComponent, canActivate: [AuthGuard]},
  { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuard]},
  { path: 'sendmessage/:name', component: SendmessageComponent, canActivate: [AuthGuard]},
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
  { path: 'friend-requests', component: FriendrequestsComponent, canActivate: [AuthGuard]},
  { path: 'search-user/:name', component: SearchUserComponent, canActivate: [AuthGuard]}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
