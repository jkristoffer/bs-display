// /src/components/Icon.astro
import { Image } from 'astro:assets';
import { icons } from './icons';

interface Props {
  name: keyof typeof icons;
  alt?: string;
  class?: string;
  size?: number;
}

const { name, alt = name, class: className, size = 60 } = Astro.props;
const icon = icons[name];