import { useSession, signIn, signOut } from "next-auth/client";

export default function Header() {
  const [session] = useSession();

  const handleSignin = (e) => {
    e.preventDefault();
    signIn();
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
  };
  return (
    <div className="header">
      {session && (
        <a href="#" onClick={handleSignOut} className="btn-signin">
          Sign out
        </a>
      )}
      {!session && (
        <a href="#" onClick={handleSignin} className="btn-signin">
          Sign in
        </a>
      )}
    </div>
  );
}
