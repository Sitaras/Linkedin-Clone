import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "../shared/message.service";
import {SendmessagePayload} from "./sendmessage.payload";
import {interval, Subscription, throwError} from "rxjs";
import {MessageModel} from "./MessageModel";

@Component({
  selector: 'app-sendmessage',
  templateUrl: './sendmessage.component.html',
  styleUrls: ['./sendmessage.component.css']
})
export class SendmessageComponent implements OnInit {
  sendTo!: string;
  messageForm!: FormGroup;
  messagePayload!: SendmessagePayload;
  messages: Array<MessageModel> = [];

  subscription!: Subscription;

  constructor(private activatedRoute: ActivatedRoute,private messageService:MessageService,private router: Router) {
    this.sendTo = this.activatedRoute.snapshot.params.name;
    this.messageService.getMessages(this.sendTo).subscribe(data => {
      this.messages = data;
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
    // window.addEventListener('message', (event) => {
    //   console.log(`Received message: ${event.data}`);
    // });
    const source = interval(3000);
    this.subscription = source.subscribe(val => this.getMessages());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendMessage(){

    if(this.messageForm.get('text')!.value==''){
      return;
    }
    this.messagePayload.text=this.messageForm.get('text')!.value;
    this.messagePayload.receiverName=this.sendTo;
    this.messageService.sendMessage(this.messagePayload).subscribe(data => {
      this.messageForm.get('text')!.setValue('');
      this.getMessages();
    }, error => {
      throwError(error);
    })
  }



  messageIsMine(msg: MessageModel){
    return msg.senderName!=this.sendTo;
  }

  getMessages(){
    this.messageService.getMessages(this.sendTo).subscribe(data => {
      this.messages = data;
    }, error => {
      throwError(error);
    });
  }

}
