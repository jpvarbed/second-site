import { Box } from "@mantine/core";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import CommentForm from "./CommentForm";
import ListComments from "./ListComments";
import formatComments from "../../helpers/formatComments";

function CommentSection() {
  const router = useRouter();

  const permalink = router.query.permalink as string;

  const data = trpc.comment.all_comments.useQuery({ permalink }).data;

  return (
    <Box>
      <CommentForm />
      {data && <ListComments comments={formatComments(data ?? [])} />}
    </Box>
  );
}

export default CommentSection;
