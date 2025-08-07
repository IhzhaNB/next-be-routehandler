import { NextResponse } from "next/server";
import { comments } from "../data";

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const searchComment = comments.find((comment) => comment.id === parseInt(id));

  return NextResponse.json(searchComment);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { text } = await request.json();
  const index = comments.findIndex((comment) => comment.id === parseInt(id));

  if (index !== -1) {
    comments[index].text = text;
    return Response.json(comments[index]);
  }

  return new Response("Comment not found", { status: 404 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const index = comments.findIndex((comment) => comment.id === parseInt(id));

  const deleteComment = comments[index];
  comments.splice(index, 1);

  return Response.json(deleteComment);
}
