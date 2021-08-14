import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API, Auth } from "aws-amplify";
import { postsByUsername } from "../graphql/queries";
import { deletePost } from "../graphql/mutations";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (posts.length < 1) {
      fetchPosts();
    }
  }, [posts]);

  const fetchPosts = async () => {
    const { username } = await Auth.currentAuthenticatedUser();
    const postData = await API.graphql({
      query: postsByUsername,
      variables: { username },
    });
    setPosts(postData.data.postsByUsername.items);
    console.log(posts);
  };

  const removePost = async (id) => {
    await API.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    }).catch((err) => console.log(err));
    fetchPosts();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Posts</h1>
      <div className="flex flex-col-reverse">
        {posts.length > 0 &&
          posts.map((post, idx) => (
            <div className="border-b border-gray-300 mt-8 mb-4" key={idx}>
              <Link href={`/posts/${post.id}`} passHref>
                <p className="cursor-pointer text-xl font-semibold">
                  {post.title}
                </p>
              </Link>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 mt-2">{post.username}</p>
                <div className="flex">
                  <Link href={`edit/${post.id}`}>
                    <a className="text-sm mr-4 text-indigo-600">Edit Post</a>
                  </Link>
                  <Link href={`posts/${post.id}`}>
                    <a className="text-sm mr-4 text-indigo-600">View Post</a>
                  </Link>
                  <p
                    onClick={() => removePost(post.id)}
                    className="cursor-pointer text-sm mr-4 text-pink-600"
                  >
                    Delete Post
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyPosts;
