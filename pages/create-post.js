import React, { useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import { v4 as uuid } from "uuid";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { createPost } from "../graphql/mutations";
import { useRouter } from "next/router";

const initialState = { title: "", content: "" };

const CreatePost = () => {
  const [post, setPost] = useState(initialState);
  const { title, content } = post;
  const router = useRouter();

  const onChangeHandler = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const createNewPost = async () => {
    console.log("posting", post);
    if (!title || !content) return null;
    const id = uuid();
    post.id = id;

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    router.push(`./posts/${id}`);
  };
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create New Post
      </h1>
      <input
        name="title"
        placeholder="Title"
        value={post.title}
        onChange={(e) => onChangeHandler(e)}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-50 y-2"
      />
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      <button
        type="button"
        className="mb-4 bg-indigo-600 text-white font-semibold px-8 py-2 rounded"
        onClick={() => createNewPost()}
      >
        Post
      </button>
    </div>
  );
};

export default withAuthenticator(CreatePost);
