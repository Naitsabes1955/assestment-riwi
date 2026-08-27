import { CheckChannelAccess } from "@/src/application/use-cases/check-channel-access";
import { DeleteMessage } from "@/src/application/use-cases/delete-message";
import { GetChannelMessages } from "@/src/application/use-cases/get-channel-messages";
import { GetUsers } from "@/src/application/use-cases/get-users";
import { Login } from "@/src/application/use-cases/login";
import { Logout } from "@/src/application/use-cases/logout";
import { RefreshSession } from "@/src/application/use-cases/refresh-session";
import { Register } from "@/src/application/use-cases/register";
import { SearchMessages } from "@/src/application/use-cases/search-messages";
import { SendMessage } from "@/src/application/use-cases/send-message";
import { DeleteUser as DeleteUserUseCase } from "@/src/application/use-cases/delete-user";
import { UpdateUser } from "@/src/application/use-cases/update-user";
import { BcryptPasswordHasher } from "@/src/infrastructure/auth/password-hasher";
import { loadAuthConfig } from "@/src/infrastructure/auth/config";
import { Sha256TokenHashService } from "@/src/infrastructure/auth/token-hash-service";
import { JwtTokenService } from "@/src/infrastructure/auth/token-service";
import { PostgresAuthRepository } from "@/src/infrastructure/database/postgres-auth-repository";
import { PostgresChannelAccessRepository } from "@/src/infrastructure/database/channel-access-postgres-repository";
import { PostgresMessageRepository } from "@/src/infrastructure/database/postgres-message-repository";
import { PostgresUserRepository } from "@/src/infrastructure/database/postgres-user-repository";

const authConfig = loadAuthConfig();
const authRepository = new PostgresAuthRepository();
const passwordHasher = new BcryptPasswordHasher(authConfig.passwordRounds);
const tokenService = new JwtTokenService(authConfig);
const tokenHashService = new Sha256TokenHashService();
const messageRepository = new PostgresMessageRepository();
const userRepository = new PostgresUserRepository();
const channelAccessRepository = new PostgresChannelAccessRepository();

export const application = {
  register: new Register(authRepository, passwordHasher, tokenService, tokenHashService),
  login: new Login(authRepository, passwordHasher, tokenService, tokenHashService),
  refresh: new RefreshSession(authRepository, tokenService, tokenHashService),
  logout: new Logout(authRepository, tokenHashService),
  getUsers: new GetUsers(userRepository),
  updateUser: new UpdateUser(userRepository),
  deleteUser: new DeleteUserUseCase(userRepository),
  sendMessage: new SendMessage(messageRepository),
  getChannelMessages: new GetChannelMessages(messageRepository),
  searchMessages: new SearchMessages(messageRepository),
  deleteMessage: new DeleteMessage(messageRepository),
  checkChannelAccess: new CheckChannelAccess(channelAccessRepository),
};

export { tokenService };