import { getAllPosts, getPostBySlug } from "../src/utils/api";
import { prisma } from "../src/server/db";

async function main() {
  const id = "cl9ebqhxk00003b600tymydho";
  await prisma.example.upsert({
    where: {
      id,
    },
    create: {
      id,
    },
    update: {},
  });

  const posts = getAllPosts(["slug"]);

  posts.map(async (slug) => {
    console.log(slug);
    const post = getPostBySlug(slug.slug ?? "", [
      "title",
      "date",
      "slug",
      "author",
      "content",
      "coverImage",
    ]);

    const title = post?.title ?? "";
    if (title !== "") {
      await prisma.post.upsert({
        where: {
          permalink: post.slug,
        },
        create: {
          title: post.title ?? "title",
          permalink: post.slug ?? "slug",
        },
        update: {},
      });
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
