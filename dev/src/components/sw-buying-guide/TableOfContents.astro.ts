interface TocItem {
  href: string;
  text: string;
}

interface Props {
  items: TocItem[];
}

const { items } = Astro.props;