import { Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../src/user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  // 회원가입
  async signUp(name: string): Promise<UserEntity> {
    const user = this.userRepository.create({ name, balance: 0 });
    return this.userRepository.save(user);
  }

  // 로그인 (단순 mock용)
  async signIn(name: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ name });
    if (!user) throw new Error("User not found");
    return user;
  }
}
