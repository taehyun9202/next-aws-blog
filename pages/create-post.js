import React, { useState, useRef } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { API, Storage } from "aws-amplify";
import { v4 as uuid } from "uuid";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { createPost } from "../graphql/mutations";
import { useRouter } from "next/router";

const initialState = { title: "", content: "" };

const CreatePost = () => {
  const [post, setPost] = useState(initialState);
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);
  const { title, content } = post;
  const router = useRouter();

  const onChangeHandler = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const createNewPost = async () => {
    if (!title || !content) return null;
    const id = uuid();
    post.id = id;

    if (image) {
      console.log("uploading image...");
      const fileName = `${image.name}_${uuid()}`;
      post.coverImage = fileName;
      await Storage.put(fileName, image);
    }

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    router.push(`./posts/${id}`);
  };

  const uploadImage = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return;
    setImage(fileUploaded);
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
      {image && (
        <img src={URL.createObjectURL(image)} alt="uploaded" className="my-4" />
      )}
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      <input
        type="file"
        ref={hiddenFileInput}
        className="absolute w-0 h-0"
        onChange={(e) => handleChange(e)}
      />
      <button
        type="button"
        className="mb-4 bg-indigo-600 text-white font-semibold px-8 py-2 rounded mr-10"
        onClick={() => uploadImage()}
      >
        Upload Cover Image
      </button>
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
