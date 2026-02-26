import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        // 🔵 Google Sign In
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),

        // 🔐 Manual Login (Fallback/Hackathon usage)
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "admin@test.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (
                    credentials?.email === "admin@test.com" &&
                    credentials?.password === "1234"
                ) {
                    return { id: "1", name: "Admin User", email: credentials.email };
                }
                return null;
            },
        }),
    ],

    pages: {
        signIn: "/login", // your sentinel access page
    },
});

export { handler as GET, handler as POST };
