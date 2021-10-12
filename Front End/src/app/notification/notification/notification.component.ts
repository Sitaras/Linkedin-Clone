import { Component, OnInit } from '@angular/core';
import {JobPostModel} from "../../shared/jobpost-model";
import {NotificationModel} from "../NotificationModel";
import {ActivatedRoute, Router} from "@angular/router";
import {JobPostService} from "../../shared/jobpost.service";
import {AuthService} from "../../auth/shared/auth.service";
import {ToastrService} from "ngx-toastr";
import {NotificationService} from "../notification.service";
import {not} from "rxjs/internal-compatibility";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: Array<NotificationModel> = [];
  showOnlyComments!: boolean;
  showOnlyInterested!: boolean;
  showAll!: boolean;
  subscription!: Subscription;

  constructor(private router: Router,private notificationService: NotificationService, private authService: AuthService, private activatedRoute: ActivatedRoute,
              private toastr: ToastrService) {
    this.showAll=true;
    this.showOnlyComments=false;
    this.showOnlyInterested=false;
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  ngOnInit(): void {
    const source = interval(3500);
    this.subscription = source.subscribe(val => this.refreshNotifications());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isEmpty(notific: Array<NotificationModel>){
      return notific==undefined || notific.length==0;
  }

  getMessage(notific: NotificationModel){
    if(notific.commented){
      return "commented on your";
    }else{
      return "showed interest for your";
    }
  }

  showNotification(notific: NotificationModel){
    if(this.showAll){
      return true;
    }
    if(this.showOnlyComments && notific.commented){
      return true;
    }
    if(this.showOnlyInterested && !notific.commented){
      return true;
    }
    return false;
  }

  showInterested(){
    this.showAll=false;
    this.showOnlyComments=false;
    this.showOnlyInterested=true;
  }

  showCommented(){
    this.showAll=false;
    this.showOnlyComments=true;
    this.showOnlyInterested=false;
  }

  showAllNotifications(){
    this.showAll=true;
    this.showOnlyComments=false;
    this.showOnlyInterested=false;
  }

  refreshNotifications(){
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

}
