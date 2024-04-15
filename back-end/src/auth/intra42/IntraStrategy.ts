
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,Profile} from 'passport-42';
import { AuthService } from "../auth.service";
@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy)
{
    constructor( private readonly authService: AuthService ){
        super({
            clientID:"u-s4t2ud-c1052a1558fffa64d6263df919e8ba52b4ca520ef202315384b6b1d31ca139ac",
            clientSecret:"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",
            callbackURL:`${process.env.url_back}/api/auth/42/redirect`,
            Scope:['profile'],
        });
    }
    async validate(accessToken: string,refreshToken: string,profile: Profile)
    {
        
        const user = await this.authService.validateUser({
            login : profile.username,email: profile.emails[0].value,avatar:profile._json.image.link});
        return user;
    } 
} 