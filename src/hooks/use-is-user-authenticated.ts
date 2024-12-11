import { useAuth, useUser } from "@clerk/nextjs";

export const useisUserAuthenticated = () => {
  const { isSignedIn } = useAuth(); // Returns true if the user is signed in
  const { user } = useUser(); // Contains user details if signed in

  if (user && isSignedIn) {
    return true;
  }

  return false;
};
