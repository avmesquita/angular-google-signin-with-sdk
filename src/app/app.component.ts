import { ChangeDetectionStrategy, Component, OnInit, SecurityContext } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { environment } from '../environments/environment.development';
import { AppService } from './app.service';

declare let google: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatCardModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    AppService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
scriptLoaded = false;

user: any;

constructor(public service: AppService,
            private sanitizer: DomSanitizer) {}

ngOnInit() {
    this.user = this.service.getUser();
    // load the script when you actually need it
    const element = document.createElement("script");
    element.src = environment.googleClientSDK;
    element.onload = () => {      
      this.scriptLoaded = true;
      google.accounts.id.initialize({
        client_id: environment.clientId,
        callback: (result: any) => {          
          this.service.authenticate(result.credential);
        },
      });
      
      google.accounts.id.renderButton(
        document.getElementById('g_id_onload'),
        { 
          locale: 'pt',
          data_client_id: environment.clientId          
        }
      );
    };
    element.async = true;    
    element.defer = true;
    document.head.appendChild(element);
}

getPicture(pic: any) : any{
  return  this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(pic));
}

}
