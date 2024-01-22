import { sql } from "@vercel/postgres";
import NextAuth from "next-auth";
import github from "next-auth/providers/github";

export const { 
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    callbacks: {
        authorized({ auth, request: { nextUrl }}) {
            const isLoggedIn = !!auth?.user;

            const logInURLs = ["/idea/create", "/profile"];
            if (logInURLs.includes(nextUrl.pathname) && !isLoggedIn) {
                return false;
            }

            return true;
        },
        // https://stackoverflow.com/a/64595973
        // https://authjs.dev/guides/basics/callbacks#jwt-callback
        async jwt({ token, profile }) {
            if (profile) {
                token.id = profile.id;
            }
            return token;
        },
        async session(params) {
            if ("token" in params && params.session.user) {
                params.session.user.id = params.token.id as string;
            }
            return params.session;
        }
    },
    events: {
        async signIn({user}) {
            // TODO: Should I move this somewhere else?
            await sql`INSERT INTO project_idea_users (id, username)
                VALUES (${user.id}, ${user.name})
                ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username;`;
        }
    },
    providers: [
        github({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            profile(profile) {
                return {
                    image: profile.avatar_url,
                    name: profile.login,
                    email: profile.email,
                    id: `${profile.id}`,
                }
            }
        }),
    ],
});