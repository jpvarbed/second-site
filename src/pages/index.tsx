/* eslint-disable @typescript-eslint/require-await */
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Container from "~/components/container";
import HeroPost from "~/components/hero-post";
import Intro from "~/components/intro";
import MoreStories from "~/components/more-stories";
import PostType from "~/interfaces/post";
import { api, getAllPosts } from "~/utils/api";

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
  const heroPost = allPosts[0];
  const morePosts = allPosts?.slice(1);

  return (
    <>
      <Head>
        <title>Jason Varbedian</title>
        <meta name="description" content="Jason's Blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Intro />
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
