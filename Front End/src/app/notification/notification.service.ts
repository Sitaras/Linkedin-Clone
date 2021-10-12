import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {JobApplicationResponse} from "../shared/jobapplication-model";
import {NotificationModel} from "./NotificationModel";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<NotificationModel[]>{
    return this.http.get<NotificationModel[]>('https://localhost:8443/api/notifications/');
  }
}
