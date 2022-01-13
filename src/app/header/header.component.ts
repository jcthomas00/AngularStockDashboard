import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }

  login = () =>{
    this.authService.login();
  }
  logout = () =>{
    this.authService.logout();
  }
  getUser = ():Observable<any> =>{
    return this.authService.getUser();
  }
}
