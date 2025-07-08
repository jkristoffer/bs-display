interface Props {
  title: string;
  subtitle: string;
  badge?: string;
  badgeIcon?: string;
}

const { title, subtitle, badge = "Expert Quiz", badgeIcon = "🎯" } = Astro.props;