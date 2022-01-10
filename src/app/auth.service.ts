import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) {}
  
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((user)=>console.log(user));
  }
  logout() {
    this.auth.signOut();
  }
}
