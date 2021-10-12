import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {interval, Subscription, throwError} from "rxjs";
import {MessageService} from "../../shared/message.service";
import {MessageModel} from "../../sendmessage/MessageModel";
import {SendmessagePayload} from "../../sendmessage/sendmessage.payload";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messageForm!: FormGroup;
  messagePayload!: SendmessagePayload;
  contactList: Array<string> = [];
  selectedUser!: string;
  messages: Array<MessageModel> = [];
  subscription!: Subscription;

  constructor(private messageService:MessageService) {
    this.selectedUser ='';
    this.messageService.getContactList().subscribe(data => {
      this.contactList = data;
    }, error => {
      throwError(error);
    });

    this.messageForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });

    this.messagePayload = {
      receiverName: '',
      text: ''
    };
  }

  ngOnInit(): void {
    const source = interval(3500);
    this.subscription = source.subscribe(val => this.refresh());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendMessage(){
    if(this.selectedUser==undefined || this.selectedUser==''){
      return;
    }
    if(this.messageForm.get('text')!.value==''){
      return;
    }
    this.messagePayload.text=this.messageForm.get('text')!.value;
    this.messagePayload.receiverName=this.selectedUser;
    this.messageService.sendMessage(this.messagePayload).subscribe(data => {
      this.messageForm.get('text')!.setValue('');
      this.refresh();
    }, error => {
      throwError(error);
    })
  }


  refresh(){
    if(this.selectedUser!=''){
      this.messageService.getMessages(this.selectedUser).subscribe(data => {
        this.messages = data;
      }, error => {
        throwError(error);
      });
    }
    this.messageService.getContactList().subscribe(data => {
      this.contactList = data;
    }, error => {
      throwError(error);
    });
  }

  notEmpty(str: string){
    return str=='';
  }

  userIsSelected(){
    return this.contactList.length!=0;
  }

  showMessages(username: string){
    this.selectedUser=username;
    this.messageService.getMessages(this.selectedUser).subscribe(data => {
      this.messages = data;
    }, error => {
      throwError(error);
    });
  }

  messageIsMine(msg: MessageModel){
    return msg.senderName!=this.selectedUser;
  }

  isTheSelectedUser(str:string){
    return str==this.selectedUser;
  }

}
