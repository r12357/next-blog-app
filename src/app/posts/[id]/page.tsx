"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import dayjs from "dayjs";

import type { Post } from "@/app/_types/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import DOMPurify from "isomorphic-dompurify";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { id } = useParams() as { id: string };

  const apiBaseEp = process.env.NEXT_PUBLIC_MICROCMS_BASE_EP!;
  const apiKey = process.env.NEXT_PUBLIC_MICROCMS_API_KEY!;

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const requestUrl = `${apiBaseEp}/posts/${id}`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
          headers: {
            "X-MICROCMS-API-KEY": apiKey,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch post with id ${id}`);
        }
        const data = await response.json();
        setPost(data); // `data` がそのまま投稿データ
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, apiBaseEp, apiKey]);

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!post) {
    return <div>指定idの投稿の取得に失敗しました。</div>;
  }

  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  return (
    <main>
      <div className="space-y-2">
        <div className="mb-2 text-2xl font-bold">{post.title}</div>
        <div className="text-sm text-gray-500">
          投稿日:{" "}
          {dayjs(post.createdAt).add(9, "hour").format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div className="flex flex-wrap gap-1">
          {post.categories?.map((category) => (
            <div
              key={category.id}
              className="flex justify-center rounded-lg border-4 border-purple-300 px-2 py-1 text-sm"
            >
              {category.name}
            </div>
          ))}
        </div>
        <div>
          <Image
            src={post.coverImage.url}
            alt="Cover Image"
            width={post.coverImage.width}
            height={post.coverImage.height}
            priority
            className="rounded-xl"
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
      </div>
    </main>
  );
};

export default Page;
