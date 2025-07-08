import Button from '../../common/Button/Button.astro';

interface Props {
  title: string;
  subtitle?: string;
  videoSrc: string;
}

const { title, subtitle, videoSrc } = Astro.props;