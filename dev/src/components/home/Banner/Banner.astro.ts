import Button from '../../common/Button/Button.astro';

interface Props {
  title: string;
  subtitle?: string;
}

const { title, subtitle } = Astro.props;