import React from 'react';
import Nav from './Nav';

// Client-side only wrapper
export default function ClientNav({ currentPath }: { currentPath?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [clientPath, setClientPath] = React.useState(currentPath);

  React.useEffect(() => {
    setMounted(true);
    // Only access window after mounting
    if (typeof window !== 'undefined' && !currentPath) {
      setClientPath(window.location.pathname);
    }
  }, [currentPath]);

  if (!mounted) {
    // Return a placeholder with the same height as the nav
    return <div style={{ height: '60px', backgroundColor: '#fff' }} />;
  }

  return <Nav currentPath={clientPath || '/'} />;
}