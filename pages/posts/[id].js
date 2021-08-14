import React, { useEffect, useState } from "react";
import { API, Storage } from "aws-amplify";
import { useRouter } from "next/router";
import { listPosts, getPost } from "../../graphql/queries";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Post = ({ post }) => {
  const [coverImage, setCoverImage] = useState(null);
  const router = useRouter();
  //   const [post, setPost] = useState(null);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    updateCoverImage();
  }, []);

  const updateCoverImage = async () => {
    if (post.coverImage) {
      const imageKey = await Storage.get(post.coverImage);
      setCoverImage(imageKey);
    }
  };

  console.log(coverImage);
  return (
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracking-wide">
        {post.title}
      </h1>
      {coverImage && <img src={coverImage} alt="cover" />}
      <p className="text-sm font-light my-4">{post.username}</p>
      <div className="mt-8">
        <ReactMarkdown
          className="prose"
          remarkPlugins={[remarkGfm]}
          children={post.content}
        />
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const postData = await API.graphql({
    query: listPosts,
  });
  const paths = postData.data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const postData = await API.graphql({
    query: getPost,
    variables: { id },
  });
  return {
    props: {
      post: postData.data.getPost,
    },
    revalidate: 60,
  };
}

export default Post;
