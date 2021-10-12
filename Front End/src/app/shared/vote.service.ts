import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VotePayload } from './vote-button/vote-payload';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private http: HttpClient) { }

  vote(votePayload: VotePayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/interested/', votePayload, { responseType: 'text' });
  }

  unvote(votePayload: VotePayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/interested/delete/', votePayload, { responseType: 'text' });
  }

  getAllInterested(postId: number): Observable<Array<string>>{
    return this.http.get<string []>('https://localhost:8443/api/interested/'+postId);
  }
}
