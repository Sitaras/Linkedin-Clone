import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FriendsModel} from "./friends-model";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private http: HttpClient) { }

  sendFriendRequest(toUser: string): Observable<any> {
    return this.http.post('https://localhost:8443/api/friends/request/' + toUser,null);
  }

  acceptFriendRequest(fromUser: string): Observable<any> {
    return this.http.post('https://localhost:8443/api/friends/accept/' + fromUser,null);
  }

  cancelFriendRequest(fromUser: string): Observable<any> {
    return this.http.post('https://localhost:8443/api/friends/cancel/' + fromUser,null);
  }

  declineFriendRequest(fromUser: string): Observable<any> {
    return this.http.post('https://localhost:8443/api/friends/decline/' + fromUser,null);
  }

  getFriendshipStatus(withUser: string): Observable<FriendsModel>{
    return this.http.get<FriendsModel>('https://localhost:8443/api/friends/' + withUser);
  }

  getFriendRequests(): Observable<string[]>{
    return this.http.get<string[]>('https://localhost:8443/api/friends/requests');
  }

  getFriendsOfUser(ofUser: string): Observable<string[]>{
    return this.http.get<string[]>('https://localhost:8443/api/friends/all/'+ofUser);
  }
}



