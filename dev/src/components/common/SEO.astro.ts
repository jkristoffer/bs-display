interface Props {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: string;
  viewport?: string;
  noindex?: boolean;
  nofollow?: boolean;
  additionalTags?: Array<{
    name?: string;
    property?: string;
    content: string;
    httpEquiv?: string;
  }>;
}

const { 
  title, 
  description, 
  ogTitle = title,
  ogDescription = description,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary',
  twitterTitle = title,
  twitterDescription = description,
  twitterImage = ogImage,
  canonicalUrl,
  structuredData,
  viewport = 'width=device-width, initial-scale=1',
  noindex = false,
  nofollow = false,
  additionalTags = []
} = Astro.props;

const siteUrl = import.meta.env.SITE || Astro.url.origin;
const currentUrl = canonicalUrl || Astro.url.href;
const robotsContent = [
  noindex ? 'noindex' : 'index',
  nofollow ? 'nofollow' : 'follow'
].join(', ');