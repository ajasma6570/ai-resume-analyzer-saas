import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/auth.store";
import AuthLoader from "./components/AuthLoader";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <BrowserRouter>
      <AuthLoader>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<AuthPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={!!accessToken}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute isAuthenticated={!!accessToken}>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute isAuthenticated={!!accessToken}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Wildcard 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthLoader>
    </BrowserRouter>
  );
}

export default App;
