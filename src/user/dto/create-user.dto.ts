import { Matches, IsEmail, Length, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8)
  @Matches(/.*[A-Z].*/, {
    message: '$property must have at least one capital letter',
  })
  @Matches(/.*[a-z].*/, {
    message: '$property must have at least one lowercase letter',
  })
  @Matches(/.*[0-9].*/, {
    message: '$property must have at least one digit',
  })
  password: string;

  @IsString()
  @Length(1, 30)
  nickname: string;
}
