import { Routes, Route } from "react-router-dom";
import { PodcastProvider } from "./context/PodcastContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShowDetailPage from "./pages/ShowDetailPage.jsx";
import "./App.css";

/**
 * Root application component with client-side routing.
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <PodcastProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/show/:id" element={<ShowDetailPage />} />
      </Routes>
    </PodcastProvider>
  );
}
