import {
  defineDocumentType,
  makeSource,
  ComputedFields,
} from "contentlayer/source-files"; // eslint-disable-line
import { existsSync } from "fs";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";

const getSlug = (doc: any) => doc._raw.sourceFileName.replace(/\.mdx$/, "");
const resolvePublicImage = (directory: string, slug: string) => {
  const basePath = `${directory}/${slug}/image`;
  const extension = ["webp", "jpg", "jpeg", "png", "gif"].find((ext) =>
    existsSync(`public${basePath}.${ext}`),
  );

  return `${basePath}.${extension ?? "png"}`;
};

const postComputedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => getSlug(doc),
  },
  image: {
    type: "string",
    resolve: (doc) => resolvePublicImage("/blog", getSlug(doc)),
  },
  og: {
    type: "string",
    resolve: (doc) => resolvePublicImage("/blog", getSlug(doc)),
  },
  readingTime: {
    type: "string",
    resolve: (doc) => {
      const wordsPerMinute = 200;
      const words = doc.body.raw.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} min read`;
    },
  },
};

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    publishedAt: { type: "string", required: true },
    updatedAt: { type: "string", required: false },
    tags: { type: "json", required: false },
    featured: { type: "boolean", required: false },
    shortTitle: { type: "string", required: false, default: "" },
  },
  computedFields: postComputedFields,
}));

const projectComputedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => getSlug(doc),
  },
  image: {
    type: "string",
    resolve: (doc) => resolvePublicImage("/projects", getSlug(doc)),
  },
};

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `project/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    time: { type: "string", required: true },
    url: { type: "string", required: false },
    tags: { type: "json", required: false },
    index: { type: "number", required: true },
  },
  computedFields: projectComputedFields,
}));

export const Code = defineDocumentType(() => ({
  name: "Code",
  filePathPattern: `code/**/*.mdx`,
  contentType: "mdx",
  fields: {},
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post, Project, Code],
  mdx: {
    rehypePlugins: [rehypePrism, rehypeSlug],
  },
});
