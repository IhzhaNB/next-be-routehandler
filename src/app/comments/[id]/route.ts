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
