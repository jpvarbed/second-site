import { Box } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import CommentForm from "./CommentForm";
import ListComments from "./ListComments";
import formatComments from "../../helpers/formatComments";

type Props = {
  slug: string;
};

function CommentSection({ slug }: Props) {
  const data = trpc.comment.all_comments.useQuery({ permalink: slug }).data;

  return (
    <Box>
      <CommentForm />
      {data && <ListComments comments={formatComments(data ?? [])} />}
    </Box>
  );
}

export default CommentSection;
