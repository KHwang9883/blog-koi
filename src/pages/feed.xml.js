import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { filterPosts } from "@/utils/misc";
import { marked } from 'marked';

function generateExcerpt(markdown, maxLength = 200) {
	const text = markdown
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`[^`]+`/g, '')
		.replace(/!\[.*?\]\(.*?\)/g, '')
		.replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
		.replace(/[#*_~]/g, '')
		.replace(/\n+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength).trim() + '...';
}

function formatRssDate(date) {
	return date.toUTCString();
}

export async function GET(context) {
	const posts = filterPosts(await getCollection('blog'), {
		filterDraft: true,
		filterUnlisted: true,
	});

	const lastBuildDate = new Date();

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		customData: `<pubDate>${formatRssDate(lastBuildDate)}</pubDate>`,
		items: await Promise.all(posts.map(async (post) => {
			const content = await marked.parse(post.body);
			const description = post.data.description || generateExcerpt(post.body);

			return {
				title: post.data.title,
				pubDate: post.data.pubDate,
				link: `/post/${post.slug}/`,
				description: description,
				content: content,
			};
		})),
	});
}
