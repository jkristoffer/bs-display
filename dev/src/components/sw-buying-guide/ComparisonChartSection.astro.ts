interface Props {
  ctaText?: string;
  ctaLink?: string;
}

const {
  ctaText = 'Request Detailed Comparison Table →',
  ctaLink = '/contact'
} = Astro.props;