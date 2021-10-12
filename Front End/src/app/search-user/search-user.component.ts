import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserModel} from "../user-service/user-model";
import {UserServiceService} from "../user-service/user-service.service";

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css']
})
export class SearchUserComponent implements OnInit {
  searchUser!: string;
  searchResults: Array<string> = [];


  constructor(private activatedRoute: ActivatedRoute,private userService: UserServiceService,private router: Router) {
    this.searchUser = this.activatedRoute.snapshot.params.name;
    this.userService.searchUser(this.searchUser).subscribe(data => {
      this.searchResults = data;
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
  }

  isEmpty(list: Array<string>){
    return list==undefined || list.length==0;
  }

}
