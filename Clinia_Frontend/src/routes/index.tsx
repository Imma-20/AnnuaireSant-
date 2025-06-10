import { lazy, Suspense} from "react";
import { Routes, Route } from "react-router-dom";
// import HomePage from '../HomePage';
const SearchService = lazy(() => import("../pages/SearchService"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <Routes>
                <Route path="/rechercher-service" element={<SearchService />} />
            </Routes>
        </Suspense>
    );
};


export default AppRoutes;