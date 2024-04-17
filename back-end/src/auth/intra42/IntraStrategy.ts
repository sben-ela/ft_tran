
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,Profile} from 'passport-42';
import { AuthService } from "../auth.service";
@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy)
{
    constructor( private readonly authService: AuthService ){
        super({
            clientID:"u-s4t2ud-88a32a2e8347a8a574d07889fbe14f296fca30c9d1ec3b30f740761b360dfca6",
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