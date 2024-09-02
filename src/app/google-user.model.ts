import { SafeHtml } from "@angular/platform-browser";
import { IGoogleUser } from "./google-user.interface";

export class GoogleUser implements IGoogleUser {
    name: string;
    given_name: string;
    family_name: string;
    email: string;
    email_verified: boolean;
    picture: SafeHtml;

    constructor() {
        this.name = '';        
        this.given_name = '';
        this.family_name = '';
        this.email = '';
        this.email_verified = false;
        this.picture = '';
    }
}