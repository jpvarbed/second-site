import { useRouter } from "next/router";
import { join } from "node:path";
import Container from "~/components/container";
import Header from "~/components/header";
import Layout from "~/components/layout";
import PostBody from "~/components/post-body";
import PostHeader from "~/components/post-header";
import PostTitle from "~/components/post-title";
import markdownToHtml from "~/utils/markdownToHtml";
import Head from "next/head";
import { getFileByName } from "~/utils/api";

type Props = {
  postContent: string;
  coverImage: string;
};

export default function AboutMe({ postContent }: Props) {
  const router = useRouter();
  const profileURL = "/assets/images/profile.webp";
  return (
    <Layout preview={false}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>About Me</title>
                <meta property="og:image" content={profileURL} />
              </Head>
              <PostHeader
                title={"About me"}
                coverImage={profileURL}
                date={"2023-07-22T17:03:51-07:00"}
                author={{ name: "Jason Varbedian" }}
              />
              <PostBody content={postContent} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

const othersDirectory = join(process.cwd(), "_otherpages");

export async function getStaticProps() {
  const fullPath = join(othersDirectory, "about.md");
  const { content } = getFileByName(fullPath);
  const htmlContent = await markdownToHtml(content);

  return {
    props: {
      postContent: htmlContent,
    },
  };
}
