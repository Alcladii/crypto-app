import { SignIn } from "@clerk/clerk-react";

type SignInPageProps = {
  redirectUrl?: string;
};

export const SignInPage = ({ redirectUrl }: SignInPageProps) => {
 
  return (
    <div
         className=" w-screen flex items-center justify-center bg-gray-100"
        style={{ minHeight: "calc(100vh - 200px)" }}
    >
        <SignIn  forceRedirectUrl={redirectUrl} fallbackRedirectUrl="/" />
    </div>
  );
};
