import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {JobApplicationPayload} from "../jobpost/view-jobpost/jobapplication-payload";
import {JobApplicationResponse} from "./jobapplication-model";

@Injectable({
  providedIn: 'root'
})
export class JobapplicationService {

  constructor(private http: HttpClient) { }

  apply(jobApplicationPayload: JobApplicationPayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/jobapplication/', jobApplicationPayload, { responseType: 'text' });
  }

  getApplications(jobPostId: number): Observable<JobApplicationResponse[]>{
    return this.http.get<JobApplicationResponse[]>('https://localhost:8443/api/jobapplication/'+ jobPostId);
  }
}
