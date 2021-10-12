import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateEmailPayload } from '../auth/user-settings/change-email.payload';
import { UpdateUsernamePayload } from '../auth/user-settings/change-username.payload';
import { UpdateBioPayload } from '../update-bio/update-bio.payload';
import { UserModel } from './user-model';
import {ChangePasswordPayload} from "../auth/user-settings/change-password.payload";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }

  updateWorkingExperience(updateBioPayload: UpdateBioPayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/user/updateworkingexperience', updateBioPayload);
  }

  updateEducation(updateBioPayload: UpdateBioPayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/user/updateeducation', updateBioPayload);
  }

  updateSkills(updateBioPayload: UpdateBioPayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/user/updateskills', updateBioPayload);
  }

  setWorkingExperiencePrivacy(privacy :boolean): Observable<any>{
    return this.http.post('https://localhost:8443/api/user/info-privacy/workingexperience', privacy);
  }

  setEducationPrivacy(privacy :boolean): Observable<any>{
    return this.http.post('https://localhost:8443/api/user/info-privacy/education', privacy);
  }

  setSkillsPrivacy(privacy :boolean): Observable<any>{
    return this.http.post('https://localhost:8443/api/user/info-privacy/skills', privacy);
  }

  updateProfilePic(updateBioPayload: UpdateBioPayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/user/updateprofilepic', updateBioPayload);
  }

  updateUsername(updateUsernamePayload: UpdateUsernamePayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/user/changeusername', updateUsernamePayload);
  }

  updateEmail(updateEmailPayload: UpdateEmailPayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/user/changeemail', updateEmailPayload);
  }

  changePassword(changePasswordPayload: ChangePasswordPayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/user/changepassword', changePasswordPayload);
  }

  getUser(): Observable<UserModel> {
    return this.http.get<UserModel>('https://localhost:8443/api/user/');
  }


  getUserByUsername(username: String): Observable<UserModel> {
    return this.http.get<UserModel>('https://localhost:8443/api/user/' + username);
  }

  getNetwork(): Observable<UserModel[]>{
    return this.http.get<UserModel[]>('https://localhost:8443/api/user/network');
  }

  getNetworkOfUser(username: string): Observable<UserModel[]>{
    return this.http.get<UserModel[]>('https://localhost:8443/api/user/network/'+username);
  }

  searchUser(username: string): Observable<string[]>{
    return this.http.get<string[]>('https://localhost:8443/api/user/searchuser/'+username);
  }
}
