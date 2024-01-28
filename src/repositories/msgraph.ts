import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
  Client,
  ClientOptions,
} from "@microsoft/microsoft-graph-client";

class AccessTokenProvider implements AuthenticationProvider {
  async getAccessToken(
    authenticationProviderOptions?: AuthenticationProviderOptions | undefined
  ): Promise<string> {}
}

let clientOptions: ClientOptions = {
  authProvider: new AccessTokenProvider(),
};
export const client = Client.initWithMiddleware(clientOptions);
