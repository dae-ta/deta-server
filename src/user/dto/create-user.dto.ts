import { IsEmail, IsNotEmpty, IsString, isString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
