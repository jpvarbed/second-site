import { Box, Button, Group, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { Login } from "../login";

function CommentForm({ parentId }: { parentId?: string }) {
  const router = useRouter();

  const permalink = router.query.slug as string;
  const form = useForm({
    initialValues: {
      body: "",
    },
  });

  const utils = trpc.useContext();

  const { mutate, isLoading } = trpc.comment.add_comment.useMutation({
    onSuccess: async (input) => {
      form.reset();
      // After we've submitted we know the comment query needs to be updated so we invalidate it.
      await utils.comment.all_comments.invalidate({ permalink: input.postId });
    },
  });

  function handleSubmit(values: { body: string }) {
    const payload = {
      ...values,
      permalink,
      parentId,
    };

    mutate(payload);
  }

  return (
    <Box mt="md" mb="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          required
          placeholder="Your comment"
          label="Comment"
          {...form.getInputProps("body")}
        />

        <Group position="right" mt="md">
          <Login />
          <Button
            type="submit"
            tw="rounded-full"
            style={{ display: "block", backgroundColor: "blue" }}
          >
            {parentId ? "Post reply" : "Post comment"}
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default CommentForm;
