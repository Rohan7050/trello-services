import { UserEntity } from '../../../entities/userEntity';
import { pgConnection } from '../../data-source';
import { LoginModelType } from './login/login.model';
import { RegisterModelType } from './register/register.model';

export class UserDB {
  private userRepository = pgConnection.getRepository(UserEntity);

  public async registerUser(user: RegisterModelType): Promise<UserEntity | null> {
    try {
      const newUser = new UserEntity();
      newUser.username = user.username;
      newUser.useremail = user.useremail;
      newUser.password = user.password;
      const saveUser = await this.userRepository.save(newUser);
      return saveUser;
    } catch (err) {
      throw err;
    }
  }

  public async findUser(creds: LoginModelType): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.findOne({ where: { username: creds.username } });
      return user;
    } catch (err) {
      throw err;
    }
  }

  public async getUserInfo(user: UserEntity): Promise<UserEntity | null> {
    try {
      //   return apiList;
      return user;
    } catch (err) {
      throw err;
    }
  }
}
