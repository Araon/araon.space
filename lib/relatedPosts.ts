import type { Post } from ".contentlayer/generated";

const TECH_TAGS = new Set([
  "ai",
  "computer-science",
  "database",
  "machine-learning",
  "network",
  "security",
  "tech",
  "weekend-project",
]);

const tagSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, "-");

function getTopicTags(tags: string[] = []) {
  const normalized = tags.map(tagSlug);
  return normalized.some((tag) => TECH_TAGS.has(tag))
    ? [...normalized, "technical"]
    : normalized;
}

export function getRelatedPosts(post: Post, posts: Post[], limit: number = 3): Post[] {
  const topicTags = new Set(getTopicTags(post.tags as string[]));

  const scored = posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const candidateTags = getTopicTags(candidate.tags as string[]);
      const sharedTags = candidateTags.filter((tag) => topicTags.has(tag));

      return {
        candidate,
        score: sharedTags.length * 10 + (sharedTags.includes("technical") ? 2 : 0),
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(b.candidate.publishedAt).getTime() -
        new Date(a.candidate.publishedAt).getTime()
      );
    });

  const related = scored.filter(({ score }) => score > 0).map(({ candidate }) => candidate);
  const fallback = scored.filter(({ score }) => score === 0).map(({ candidate }) => candidate);

  return [...related, ...fallback].slice(0, limit);
}
