import { Client } from "@microsoft/microsoft-graph-client";

export const getMsGraphClient = (accessToken: string) => {
  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        return accessToken;
      },
    },
  });
};
