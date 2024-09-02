import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { IGoogleUser } from './google-user.interface';
import { GoogleUser } from './google-user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private googleUser: BehaviorSubject<IGoogleUser> = new BehaviorSubject<IGoogleUser>(new GoogleUser());
  public googleUser$ = this.googleUser.asObservable();

  constructor(private router: Router) {
  }

  async authenticate(credential: any) {    
    if (credential) {
      // Decode Google JWT token
      const user = this.decodeJWTToken(credential);
      //console.log("real google user", user);

      // My Google User
      const dto = new GoogleUser();      
      dto.name = user?.name;
      dto.given_name = user?.given_name;
      dto.family_name = user?.family_name;      
      dto.email = user?.email;
      dto.email_verified = user?.email_verified;
      dto.picture = user?.picture;

      // Fill Behavior Subject
      this.googleUser.next(dto);

      // Fill Session User
      sessionStorage.setItem('googleUser',JSON.stringify(dto));

      // do refresh to load screen variables
      this.router.navigate(['/']);
    }
  }

  async signoff() {
    // Fill Behavior Subject with Empty User
    this.googleUser.next(new GoogleUser());

    // Fill Session User with empty string
    sessionStorage.setItem('googleUser','');

    // do refresh to load empty screen variables
    this.router.navigate(['/']);
    window.location = window.location;
  }

  public async getUser() {
    // Get User stringified from Session
    const userStorage = sessionStorage.getItem('googleUser') || '';

    if (userStorage) {
      // Restore User Object
      const user = JSON.parse(userStorage);
      if (user && user.name) {
        // Store User into Observable
        this.googleUser.next(user);

        //return user as Observable
        return of(user);
      } else return of(null);  
    } else return of(null);
  }

  /* DECODE JWT TOKEN */
  decodeJWTToken(token: any){
    return JSON.parse(atob(token.split(".")[1]))
  }


}
