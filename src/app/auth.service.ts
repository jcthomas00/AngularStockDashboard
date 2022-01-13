import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) {}
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((response)=>
    console.log(response)
    );
  }
  logout() {
    this.auth.signOut();
  }
  getUser():Observable<any> {
    return this.auth.user;
  }
}
