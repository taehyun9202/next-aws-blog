import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import "../configureAmplify";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
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
      </nav>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
