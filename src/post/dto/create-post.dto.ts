import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  payment: number;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  paymentType: string;

  @IsNumber(
    {},
    {
      each: true,
    },
  )
  datesAtMs: number[] = [];

  @IsString({
    each: true,
  })
  @IsOptional()
  imagePaths?: string[] = [];
}
