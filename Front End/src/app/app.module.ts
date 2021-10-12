import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TokenInterceptor } from './token-interceptor';
import { HomeComponent } from './home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PostTileComponent } from './shared/post-tile/post-tile.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { VoteButtonComponent } from './shared/vote-button/vote-button.component';
import { CreatePostComponent } from './post/create-post/create-post.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ViewPostComponent } from './post/view-post/view-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { UpdateBioComponent } from './update-bio/update-bio.component';
import { NetworkComponent } from './auth/network/network.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserSettingsComponent } from './auth/user-settings/user-settings.component';
import { JobpostTileComponent } from './shared/jobpost-tile/jobpost-tile.component';
import { CreateJobpostComponent } from './jobpost/create-jobpost/create-jobpost.component';
import { ViewJobpostComponent } from './jobpost/view-jobpost/view-jobpost.component';
import { NotificationComponent } from './notification/notification/notification.component';
import { SendmessageComponent } from './sendmessage/sendmessage.component';
import { MessagesComponent } from './auth/messages/messages.component';
import { FriendrequestsComponent } from './friendrequests/friendrequests.component';
import { SearchUserComponent } from './search-user/search-user.component';


var firebaseConfig = {
  apiKey: "AIzaSyCvtGW1NvQOkj59E3brG7jk007KEGsW-Zg",
  authDomain: "linkedin-clone-88c8b.firebaseapp.com",
  projectId: "linkedin-clone-88c8b",
  storageBucket: "linkedin-clone-88c8b.appspot.com",
  messagingSenderId: "873534349105",
  appId: "1:873534349105:web:90fa0510a0083002de5a10",
  measurementId: "G-WE7E4EGYMF"
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    PostTileComponent,
    SideBarComponent,
    VoteButtonComponent,
    CreatePostComponent,
    ViewPostComponent,
    UserProfileComponent,
    UpdateBioComponent,
    NetworkComponent,
    UserSettingsComponent,
    JobpostTileComponent,
    CreateJobpostComponent,
    ViewJobpostComponent,
    NotificationComponent,
    SendmessageComponent,
    MessagesComponent,
    FriendrequestsComponent,
    SearchUserComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    EditorModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
