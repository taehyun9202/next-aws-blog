import React, { useEffect, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { API } from "aws-amplify";
import { updatePost } from "../../graphql/mutations";
import { getPost } from "../../graphql/queries";

const EditPost = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  // const { id } = router.query;

  // console.log(id);
  // useEffect(() => {
  //   fetchPost();
  // }, []);

  // const fetchPost = async () => {
  //   if (!id) return;
  //   const postData = await API.graphql({
  //     query: getPost,
  //     variables: { id },
  //   });
  //   setPost(postData.data.getPost);
  // };

  // const onChangeHandler = (e) => {
  //   setPost({ ...post, [e.target.name]: e.target.value });
  // };

  // const { title, content } = post;
  const updateCurrentPost = async () => {
    // if (!title || !content) return null;
    // await API.graphql({
    //   query: updatePost,
    //   variables: { input: { titlem, content, id } },
    //   authMode: "AMAZON_COGNITO_USER_POOLS",
    // });
    // router.push(`./posts/${post.id}`);
  };

  if (!post) return null;
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Edit Post</h1>
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
        onClick={() => updateCurrentPost()}
      >
        Post
      </button>
    </div>
  );
};

export default EditPost;
