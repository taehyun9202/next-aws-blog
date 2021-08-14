import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import "../configureAmplify";
import Link from "next/link";
import { Auth, Hub } from "aws-amplify";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [signedInUser, setSignedInUser] = useState(false);

  useEffect(() => {
    authListener();
  }, []);

  const authListener = async () => {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          return setSignedInUser(true);
        case "signOut":
          return setSignedInUser(false);
      }
    });
    try {
      await Auth.currentAuthenticatedUser();
      setSignedInUser(true);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(signedInUser);
  return (
    <>
      <nav className="w-full py-4 px-12 border-b border-gray-300">
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/profile">
          <a className="ml-4">Profile</a>
        </Link>
        <Link href="/create-post">
          <a className="ml-4">Create Post</a>
        </Link>
        {signedInUser && (
          <Link href="/my-posts">
            <a className="ml-4">My Posts</a>
          </Link>
        )}
      </nav>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
