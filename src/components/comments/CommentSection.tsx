import { Box } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import CommentForm from "./CommentForm";
import ListComments from "./ListComments";
import formatComments from "../../helpers/formatComments";
import { useMemo } from "react";

type Props = {
  slug: string;
};

function CommentSection({ slug }: Props) {
  const data = trpc.comment.all_comments.useQuery({ permalink: slug }).data;
  const formattedComments = useMemo(() => {
    console.log("called useMemo");
    return formatComments(data ?? []);
  }, [data]);
  return (
    <Box>
      <CommentForm />
      {formattedComments && <ListComments comments={formattedComments} />}
    </Box>
  );
}

export default CommentSection;
