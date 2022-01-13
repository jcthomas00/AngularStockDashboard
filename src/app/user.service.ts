import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserData } from 'src/Interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db:AngularFirestore) { }
  
  getUserData = () => {
    const things = this.db.collection('users').valueChanges();
    things.subscribe(console.log);
  }
    
  setUserData = (data:UserData) => {
    const things = this.db.collection('users').valueChanges();
    things.subscribe(console.log);
  }
}
