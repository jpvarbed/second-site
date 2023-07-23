import type Author from "./author";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PostType = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  content: string;
};

export default PostType;
