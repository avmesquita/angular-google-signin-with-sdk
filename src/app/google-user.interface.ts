import { SafeHtml } from "@angular/platform-browser";

export interface IGoogleUser {    
    name: string;
    given_name: string;
    family_name: string;
    email: string;
    email_verified: boolean;
    picture: SafeHtml;
}
