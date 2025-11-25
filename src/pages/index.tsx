/* eslint-disable @typescript-eslint/require-await */

import Head from "next/head";
import Container from "~/components/container";
import HeroPost from "~/components/hero-post";
import Intro from "~/components/intro";
import MoreStories from "~/components/more-stories";
import PostType from "~/interfaces/post";
import { getAllPosts } from "~/utils/api";

type Props = {
  allPosts: PostType[];
};

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: { allPosts },
  };
};

export default function Home({ allPosts }: Props) {
  const morePosts = allPosts;

  return (
    <>
      <Head>
        <title>Jason Varbedian | Software Engineer</title>
        <meta name="description" content="Technical blog on software engineering, system design, and book reviews" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Intro />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </>
  );
}
