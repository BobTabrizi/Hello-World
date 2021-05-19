import Link from "next/link";
export default function AuthHelper(props) {
  console.log(props.token);
  if (props.token.length > 1) {
    return <div>Signed In</div>;
  } else {
    return <Link href="/api/auth/Login">Sign In With Spotify.</Link>;
  }
}
