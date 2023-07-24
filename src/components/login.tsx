import { signIn, signOut, useSession } from "next-auth/react";

export function Login() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="transiion rounded-full bg-black px-10 py-3 font-semibold text-white no-underline"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
