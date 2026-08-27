import { CheckChannelAccess } from "@/src/application/use-cases/check-channel-access";
import { AskAssistant } from "@/src/application/use-cases/ask-assistant";
import { DeleteMessage } from "@/src/application/use-cases/delete-message";
import { GetChannelMessages } from "@/src/application/use-cases/get-channel-messages";
import { GetCopilotContext } from "@/src/application/use-cases/get-copilot-context";
import { GetUserChannels } from "@/src/application/use-cases/get-user-channels";
import { GetUsers } from "@/src/application/use-cases/get-users";
import { Login } from "@/src/application/use-cases/login";
import { Logout } from "@/src/application/use-cases/logout";
import { RefreshSession } from "@/src/application/use-cases/refresh-session";
import { Register } from "@/src/application/use-cases/register";
import { SearchMessages } from "@/src/application/use-cases/search-messages";
import { SendMessage } from "@/src/application/use-cases/send-message";
import { DeleteUser as DeleteUserUseCase } from "@/src/application/use-cases/delete-user";
import { UpdateUser } from "@/src/application/use-cases/update-user";
import type {
  AiProvider,
  AiRequest,
  AiResponse,
} from "@/src/domain/repositories/ai-provider";
import { BcryptPasswordHasher } from "@/src/infrastructure/auth/password-hasher";
import { loadGeminiConfig } from "@/src/infrastructure/ai/config";
import { GeminiProvider } from "@/src/infrastructure/ai/gemini-provider";
import { loadAuthConfig } from "@/src/infrastructure/auth/config";
import { Sha256TokenHashService } from "@/src/infrastructure/auth/token-hash-service";
import { JwtTokenService } from "@/src/infrastructure/auth/token-service";
import { PostgresAuthRepository } from "@/src/infrastructure/database/postgres-auth-repository";
import { PostgresChannelAccessRepository } from "@/src/infrastructure/database/channel-access-postgres-repository";
import { PostgresChannelRepository } from "@/src/infrastructure/database/postgres-channel-repository";
import { PostgresMessageRepository } from "@/src/infrastructure/database/postgres-message-repository";
import { PostgresUserRepository } from "@/src/infrastructure/database/postgres-user-repository";

class LazyGeminiProvider implements AiProvider {
  private provider: GeminiProvider | null = null;

  async generateResponse(request: AiRequest): Promise<AiResponse> {
    return this.getProvider().generateResponse(request);
  }

  private getProvider(): GeminiProvider {
    this.provider ??= new GeminiProvider(loadGeminiConfig());
    return this.provider;
  }
}

const authConfig = loadAuthConfig();
const authRepository = new PostgresAuthRepository();
const passwordHasher = new BcryptPasswordHasher(authConfig.passwordRounds);
const tokenService = new JwtTokenService(authConfig);
const tokenHashService = new Sha256TokenHashService();
const messageRepository = new PostgresMessageRepository();
const userRepository = new PostgresUserRepository();
const channelRepository = new PostgresChannelRepository();
const channelAccessRepository = new PostgresChannelAccessRepository();
const getCopilotContext = new GetCopilotContext(messageRepository);
const geminiProvider = new LazyGeminiProvider();

export const application = {
  register: new Register(authRepository, passwordHasher, tokenService, tokenHashService),
  login: new Login(authRepository, passwordHasher, tokenService, tokenHashService),
  refresh: new RefreshSession(authRepository, tokenService, tokenHashService),
  logout: new Logout(authRepository, tokenHashService),
  getUsers: new GetUsers(userRepository),
  updateUser: new UpdateUser(userRepository),
  deleteUser: new DeleteUserUseCase(userRepository),
  getUserChannels: new GetUserChannels(channelRepository),
  sendMessage: new SendMessage(messageRepository),
  getChannelMessages: new GetChannelMessages(messageRepository),
  searchMessages: new SearchMessages(messageRepository),
  deleteMessage: new DeleteMessage(messageRepository),
  checkChannelAccess: new CheckChannelAccess(channelAccessRepository),
  askAssistant: new AskAssistant(getCopilotContext, geminiProvider),
};

export { tokenService };
