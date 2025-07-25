import Nav from './Nav';

interface NavWrapperProps {
  currentPath?: string;
}

export default function NavWrapper({ currentPath }: NavWrapperProps) {
  return <Nav currentPath={currentPath} />;
}