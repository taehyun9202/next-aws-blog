import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API, Auth } from "aws-amplify";
import { postsByUsername } from "../graphql/queries";
import { deletePost } from "../graphql/mutations";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { username } = await Auth.currentAuthenticatedUser();
    const postData = await API.graphql({
      query: postsByUsername,
      variables: { username },
    });
    setPosts(postData.data.postsByUsername.items);
    console.log(posts);
  };

  const removePost = (id) => {};
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Posts</h1>
      <div className="flex flex-col-reverse">
        {posts.length > 0 &&
          posts.map((post, idx) => (
            <Link href={`/posts/${post.id}`} key={idx} passHref>
              <div className="cursor-pointer border-b border-gray-300 mt-8 mb-4">
                <p className="text-xl font-semibold">{post.title}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 mt-2">{post.username}</p>
                  <div>
                    <Link href={`edit/${post.id}`}>
                      <a className="text-sm mr-4 text-indigo-600">Edit Post</a>
                    </Link>
                    <Link href={`posts/${post.id}`}>
                      <a className="text-sm mr-4 text-indigo-600">View Post</a>
                    </Link>
                    <button
                      onClick={() => removePost(post.id)}
                      className="text-sm mr-4 text-pink-600"
                    >
                      Delete Post
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default MyPosts;
