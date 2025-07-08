import type { ImageMetadata } from 'astro';
import Button from '../../common/Button/Button.astro';
import { Image } from 'astro:assets';

interface Props {
  title: string;
  image: ImageMetadata;
  points: string[];
  recommendedModels: string;
  isReversed?: boolean;
}

const {
  title,
  image,
  points,
  recommendedModels,
  isReversed = false
} = Astro.props;