import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { CommentWithChildren } from "../../utils/trpc";
import CommentForm from "./CommentForm";
import type { Comment } from "@prisma/client";

function getReplyCountText(count: number) {
  if (count === 0) {
    return "No replies";
  }

  if (count === 1) {
    return "1 reply";
  }

  return `${count} replies`;
}

function CommentActions({
  commentId,
  replyCount,
}: {
  commentId: string;
  replyCount: number;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <>
      <Group position="apart" mt="md">
        <Text>{getReplyCountText(replyCount)}</Text>
        <Button
          style={{ display: "block", backgroundColor: "blue" }}
          onClick={() => setReplying(!replying)}
        >
          Reply
        </Button>
      </Group>

      {replying && <CommentForm parentId={commentId} />}
    </>
  );
}

function Comment({ comment }: { comment: CommentWithChildren }) {
  const username = comment.user.name;
  const formattedCreatedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  }).format(comment.createdAt);
  return (
    <Paper withBorder radius="md" mb="md" p="md">
      <Box
        sx={() => ({
          display: "flex",
        })}
      >
        <Avatar />

        <Box
          pl="md"
          sx={() => ({
            display: "flex",
            flexDirection: "column",
          })}
        >
          <Group>
            <Text>{username}</Text>
            <Text>{formattedCreatedAt}</Text>
          </Group>
          <Divider />
          {comment.body}
        </Box>
      </Box>

      <CommentActions
        commentId={comment.id}
        replyCount={comment.children?.length ?? 0}
      />

      {comment.children && comment.children.length > 0 && (
        <ListComments comments={comment.children} />
      )}
    </Paper>
  );
}

function ListComments({ comments }: { comments: CommentWithChildren[] }) {
  return (
    <Box>
      {comments.map((comment) => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </Box>
  );
}

export default ListComments;
