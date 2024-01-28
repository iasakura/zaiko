import { TokenSet } from "@auth/core/types";
import NextAuth from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";

const getEnvVar = (name: string) => {
  const v = process.env[name];
  if (v == null) {
    throw Error(`env var ${name} is not found`);
  }
  return v;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    AzureAD({
      clientId: getEnvVar("AZURE_CLIENT_ID"),
      clientSecret: getEnvVar("AZURE_CLIENT_SECRET"),
      tenantId: "consumers",
      token: {
        url: `https://login.microsoftonline.com/consumers/oauth2/v2.0/token`,
      },
      userinfo: {
        url: "https://graph.microsoft.com/oidc/userinfo",
      },
      authorization: {
        url: `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize`,
        params: {
          scope:
            "openid profile email User.Read Tasks.ReadWrite Tasks.ReadWrite.Shared",
          prompt: "consent",
        },
      },
      issuer: `https://login.microsoftonline.com/${getEnvVar(
        "AZURE_TENANT_ID"
      )}/v2.0`,
      async profile(profile, tokens) {
        const response = await fetch(`https://graph.microsoft.com/v1.0/me`, {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        const json = await response.json();

        return {
          id: profile.sub,
          name: profile.name,
          email: json.userPrincipalName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          access_token: account.access_token,
          expires_at: Math.floor(Date.now() / 1000 + account.expires_in!),
          refresh_token: account.refresh_token,
        };
      } else if (Date.now() < token.expires_at! * 1000) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch(
            `https://login.microsoftonline.com/${getEnvVar(
              "AZURE_TENANT_ID"
            )}/oauth2/v2.0/token`,
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                client_id: getEnvVar("AZURE_CLIENT_ID"),
                client_secret: getEnvVar("AZURE_CLIENT_SECRET"),
                grant_type: "refresh_token",
                refresh_token: token.refresh_token!,
              }),
              method: "POST",
            }
          );

          const tokens: TokenSet = await response.json();

          if (!response.ok) throw tokens;

          return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in!),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
    },
    async session({ session, ...rest }) {
      if ("token" in rest) {
        session.error = rest.token.error;
        session.access_token = rest.token.access_token;
      }
      return session;
    },
  },
});
