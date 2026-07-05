import Controls from "../components/Controls.jsx";
import PodcastList from "../components/PodcastList.jsx";
import Pagination from "../components/Pagination.jsx";

/**
 * Homepage listing podcasts with search, filters, sort, and pagination.
 * @returns {JSX.Element}
 */
export default function HomePage() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Podcast Explorer</h1>
        <p className="app-header__subtitle">
          Search, sort, filter, and browse podcasts in one place.
        </p>
      </header>
      <main className="app-main">
        <Controls />
        <PodcastList />
        <Pagination />
      </main>
    </div>
  );
}
