import { Component, OnInit } from '@angular/core';
import {FriendsService} from "../shared/friends.service";
import {throwError} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-friendrequests',
  templateUrl: './friendrequests.component.html',
  styleUrls: ['./friendrequests.component.css']
})
export class FriendrequestsComponent implements OnInit {

  requestList: Array<string> = [];

  constructor(private friendsService: FriendsService, private toastr: ToastrService) {
    this.friendsService.getFriendRequests().subscribe(data => {
      this.requestList = data;
    });
  }

  ngOnInit(): void {
  }

  isEmpty(list: Array<string>){
    return list==undefined || list.length==0;
  }

  acceptRequest(userFrom: string){
    this.friendsService.acceptFriendRequest(userFrom).subscribe(data => {
      this.toastr.success("Friend Request Accepted")
      this.updateRequests();
    }, error => {
      this.toastr.error("Error on accepting friend request")
      throwError(error);
    })
  }

  declineRequest(userFrom: string){
    this.friendsService.declineFriendRequest(userFrom).subscribe(data => {
      this.toastr.success("Friend Request Was Declined")
      this.updateRequests();
    }, error => {
      this.toastr.error("Error on declining friend request")
      throwError(error);
    })
  }

  updateRequests(){
    this.friendsService.getFriendRequests().subscribe(data => {
      this.requestList = data;
    });
  }

}
