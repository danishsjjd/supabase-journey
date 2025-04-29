import { FormMessage, Message } from "@/components/form-message";
import SignInWithDiscordButton from "@/components/sign-in-with-discord-button";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-medium mb-8">Sign in</h1>
      <SignInWithDiscordButton />
      <FormMessage message={searchParams} />
    </div>
  );
}
