"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
                sendGAEvent('event', 'sign_up', { method: 'email' });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                sendGAEvent('event', 'login', { method: 'email' });
            }
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-50">
            <Card className="w-[400px] border-neutral-800 bg-neutral-900">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        AgentGate {isRegistering ? "Registration" : "Login"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-neutral-400">Email</label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="developer@example.com"
                                required
                                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-neutral-400">Password</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                            {isRegistering ? "Create Account" : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-sm text-neutral-400 hover:text-white transition-colors underline mx-auto"
                    >
                        {isRegistering ? "Already have an account? Sign in" : "Need an account? Register"}
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
}
