import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {JobPostModel} from "./jobpost-model";
import {CreateJobPostPayload} from "../jobpost/create-jobpost/create-jobpost.payload";

@Injectable({
  providedIn: 'root'
})
export class JobPostService {

  constructor(private http: HttpClient) { }

  getAllJobPosts(): Observable<Array<JobPostModel>> {
    return this.http.get<Array<JobPostModel>>('https://localhost:8443/api/jobposts/');
  }

  createJobPost(jobPostPayload: CreateJobPostPayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/jobposts/', jobPostPayload);
  }

  getJobPost(id: number): Observable<JobPostModel> {
    return this.http.get<JobPostModel>('https://localhost:8443/api/jobposts/' + id);
  }

  getAllJobPostsByUser(name: string): Observable<JobPostModel[]> {
    return this.http.get<JobPostModel[]>('https://localhost:8443/api/jobposts/by-user/' + name);
  }
}
