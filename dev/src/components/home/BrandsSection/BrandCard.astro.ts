import Button from '../../common/Button/Button.astro';

interface Props {
  name: string;
  path: string;
  logoSrc: string;
}

const { name, logoSrc, path } = Astro.props;