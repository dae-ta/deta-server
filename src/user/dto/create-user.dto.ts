import { IsNotEmpty, IsString, isString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
