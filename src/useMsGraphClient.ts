import { Client } from "@microsoft/microsoft-graph-client";
import { auth } from "./auth";

export const getMsGraphClient = (accessToken: string) => {
  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        return accessToken;
      },
    },
  });
};
