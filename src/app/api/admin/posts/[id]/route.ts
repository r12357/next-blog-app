import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Post, Category } from "@prisma/client";

type RequestBody = {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds: string[];
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body: RequestBody = await req.json();

    if (
      !body.title ||
      !body.content ||
      !body.coverImageURL ||
      !Array.isArray(body.categoryIds)
    ) {
      return NextResponse.json(
        { error: "必要なフィールドが不足しています" },
        { status: 400 }
      );
    }

    const validCategories = await prisma.category.findMany({
      where: { id: { in: body.categoryIds } },
    });

    if (validCategories.length !== body.categoryIds.length) {
      return NextResponse.json(
        { error: "無効なカテゴリIDが含まれています" },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.$transaction(async (tx) => {
      await tx.postCategory.deleteMany({
        where: { postId: id },
      });

      await tx.postCategory.createMany({
        data: body.categoryIds.map((categoryId) => ({
          postId: id,
          categoryId,
        })),
      });

      return tx.post.update({
        where: { id },
        data: {
          title: body.title,
          content: body.content,
          coverImageURL: body.coverImageURL,
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の変更に失敗しました" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const post: Post = await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({
      msg: `「${post.title}」を削除しました．`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の削除に失敗しました" },
      { status: 500 }
    );
  }
};
