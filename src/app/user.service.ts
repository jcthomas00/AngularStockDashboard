import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { UserData } from 'src/Interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private db:AngularFirestore, 
    private authService:AuthService
  ) { }
  
  getUserData = (uid:string):Observable<any> => {
    const data = of(null);
      return this.db.collection('users').doc(uid).valueChanges();
  }
    
  setUserData = (data:UserData) => {
    this.authService.getUser().subscribe(user => {
      console.log(user)
      if(user){
        return this.db.collection('users').doc(user.uid).set(data); 
      }else return null;
    })                         
  }
}
