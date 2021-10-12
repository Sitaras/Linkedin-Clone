import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SendmessagePayload} from "../sendmessage/sendmessage.payload";
import {MessageModel} from "../sendmessage/MessageModel";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(sendmessagePayload: SendmessagePayload): Observable<any> {
    return this.http.post('https://localhost:8443/api/message/', sendmessagePayload);
  }

  getMessages(userName: string): Observable<Array<MessageModel>> {
    return this.http.get<Array<MessageModel>>('https://localhost:8443/api/message/'+userName);
  }

  getContactList():Observable<Array<string>>{
    return this.http.get<Array<string>>('https://localhost:8443/api/message/contactlist');
  }
}
