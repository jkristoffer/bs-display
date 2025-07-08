interface Props {
  id?: string;
  title: string;
  bgClass?: 'bg-light' | 'bg-accent' | '';
}

const { id, title, bgClass = '' } = Astro.props;