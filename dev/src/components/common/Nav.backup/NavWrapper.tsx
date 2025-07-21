import * as React from 'react';

// Lazy load the Nav component to ensure React is available
const Nav = React.lazy(() => import('./Nav.tsx'));

interface NavWrapperProps {
  currentPath?: string;
}

export default function NavWrapper({ currentPath }: NavWrapperProps) {
  return (
    <React.Suspense fallback={<div style={{ height: '60px' }} />}>
      <Nav currentPath={currentPath} />
    </React.Suspense>
  );
}