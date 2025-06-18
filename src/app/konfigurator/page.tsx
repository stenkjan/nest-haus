import KonfiguratorClient from './components/KonfiguratorClient';

// Server Component - Can handle initial data fetching, SEO, etc.
export default function KonfiguratorPage() {
  // This is now a server component that can:
  // - Generate metadata
  // - Fetch initial data if needed
  // - Handle SEO optimizations
  
  return <KonfiguratorClient />;
} 