import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginComponent from "./pages/Login";
import EnrollmentComponent from "./pages/Enrollment";
import Health from "./pages/Health";
import SettingsPage from "./pages/Settings";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="/enrollment" element={<EnrollmentComponent />} />
          <Route path="/health" element={<Health />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/login" element={<LoginComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
