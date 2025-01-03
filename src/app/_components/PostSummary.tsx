"use client";
import type { Post } from "@/app/_types/Post";
import React from "react";
import dayjs from "dayjs";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;

  const formattedDate = dayjs(post.createdAt)
    .add(9, "hour")
    .format("YYYY-MM-DD HH:mm:ss");

  return (
    <div className="border border-slate-400 p-3">
      <div className="font-bold">{post.title}</div>
      <div className="text-sm text-gray-500">投稿日: {formattedDate}</div>
      {/* <div>{post.content}</div> */}
      <div
        className="line-clamp-3"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostSummary;
