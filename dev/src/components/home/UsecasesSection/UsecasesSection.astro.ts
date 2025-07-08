import UsecaseItem from './UsecaseItem.astro';

// Image paths
const img1 = '/assets/images/use-cases/bsdisplay-iboard-usecase-classroom.jpeg';
const img2 = '/assets/images/use-cases/bsdisplay-iboard-usecase-office.jpeg';
const img3 = '/assets/images/use-cases/bsdisplay-iboard-usecase-training.jpeg';

interface Usecase {
  title: string;
  image: any;
  points: string[];
  recommendedModels: string;
}

const {
  usecases = [
    {
      title: 'Education',
      image: img1,
      points: [
        '<strong>➤ Touch-based learning</strong> helps students stay engaged during lessons.',
        '<strong>➤ Real-time whiteboarding</strong> lets teachers and students collaborate easily.',
        '<strong>➤ Screen mirroring</strong> from any device boosts participation and interactivity.'
      ],
      recommendedModels: 'METZ 75", Infinity Pro 86"'
    },
    {
      title: 'Offices & Boardrooms',
      image: img2,
      points: [
        '<strong>Video conferencing</strong> and <strong>hybrid meetings</strong> run smoothly with built-in support.',
        '<strong>Screen sharing</strong> and <strong>on-screen annotations</strong> improve collaboration.',
        '<strong>Zoom, Teams</strong>, and other apps integrate directly for convenience.'
      ],
      recommendedModels: 'SMART 65", METZ 75"'
    },
    {
      title: 'Training Centers',
      image: img3,
      points: [
        '<strong>Stylus-powered presentations</strong> make lessons more engaging and flexible.',
        '<strong>Screen recording</strong> lets learners review sessions anytime.',
        '<strong>Multi-user support</strong> allows group activities and simultaneous interactions.'
      ],
      recommendedModels: 'Infinity Pro 86", SMART 75"'
    }
  ]
} = Astro.props;