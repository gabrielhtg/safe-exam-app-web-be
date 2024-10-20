import{IsEmail, IsNotEmpty, MinLength} from 'class-validator';

export class RegisterDto{

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsNotEmpty()
    @MinLength(8)
    confirmPass: string;


}