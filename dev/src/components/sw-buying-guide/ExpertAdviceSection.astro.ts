import { allModels } from '../../data/models/models.all.js';

interface ExpertService {
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  action: {
    text: string;
    link: string;
  };
}

// Calculate data-driven insights for expert services
const brands = [...new Set(allModels.map((m: any) => m.brand).filter(Boolean))];
const totalModels = allModels.length;
const sizeRange = {
  min: Math.min(...allModels.map((m: any) => m.size || 0)),
  max: Math.max(...allModels.map((m: any) => m.size || 0))
};

const expertServices: ExpertService[] = [
  {
    title: 'Product Selection Consultation',
    description: `Get personalized recommendations from our ${totalModels}+ interactive display options across ${brands.length} trusted brands.`,
    icon: '🎯',
    benefits: [
      'Analyze your space and usage requirements',
      'Compare specifications across brands',
      'Recommend optimal size and features',
      'Budget-friendly options and financing'
    ],
    action: {
      text: 'Get Product Recommendation',
      link: '/contact'
    }
  },
  {
    title: 'Installation Planning',
    description: `Professional installation planning for displays ranging from ${sizeRange.min}" to ${sizeRange.max}" with mounting and setup guidance.`,
    icon: '🔧',
    benefits: [
      'Site assessment and space planning',
      'Mounting solutions and hardware',
      'Cable management and power requirements',
      'Professional installation coordination'
    ],
    action: {
      text: 'Schedule Site Assessment',
      link: '/contact'
    }
  },
  {
    title: 'Training & Support',
    description: 'Comprehensive training programs and ongoing technical support to maximize your interactive display investment.',
    icon: '🎓',
    benefits: [
      'User training for all skill levels',
      'Software integration guidance',
      'Best practices and workflows',
      'Ongoing technical support'
    ],
    action: {
      text: 'Learn About Training',
      link: '/contact'
    }
  }
];

const {
  title = 'Expert Guidance Every Step of the Way',
  subtitle = 'From selection to installation to training, our specialists ensure your success'
} = Astro.props;