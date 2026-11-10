import { RouterProvider, useRouter } from './state/router.jsx';
import { StoreProvider } from './state/store.jsx';
import { Footer, NavBar, SampleBanner } from './components/Shell.jsx';
import { Toasts } from './components/ui.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Compare from './pages/Compare.jsx';
import Article from './pages/Article.jsx';
import BiasRatings from './pages/BiasRatings.jsx';
import SourceExplorer from './pages/SourceExplorer.jsx';
import Profile from './pages/Profile.jsx';
import Methods from './pages/Methods.jsx';

const PAGES = { home: Home, explore: Explore, compare: Compare, article: Article, ratings: BiasRatings, sources: SourceExplorer, profile: Profile, methods: Methods };

function Routes() {
  const { page, param } = useRouter();
  const Page = PAGES[page] || Home;
  return <main id="main" className="main"><Page key={page + (page === 'explore' ? '' : param)} /></main>;
}

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <a href="#main" className="skip">Skip to content</a>
        <NavBar />
        <SampleBanner />
        <Routes />
        <Footer />
        <Toasts />
      </StoreProvider>
    </RouterProvider>
  );
}
