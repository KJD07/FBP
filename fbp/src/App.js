import './App.css';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Routes,
  Navigate,
  BrowserRouter as Router
} from "react-router-dom";
import Plans from './Plans';

import Old from './Old';
import Accept from './Accept';
import Reject from './Reject';
import Table from './Table'
import Bills from './Bills';
import Admin from './Admin';
import AdminTable from './AdminTable';
import Data from './Data';
import ViewBills from './ViewBills';

function App() {

  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Old />} />
          <Route exact path="/plans" element={<Plans />} />
          <Route exact path="/accept" element={<Accept />} />
          <Route exact path="/reject" element={<Reject />} />
          <Route exact path="/table" element={<Table />} />
          <Route exact path="/bills" element={<Bills />} />
          <Route exact path="/admin" element={<Admin />} />
          <Route exact path="/admintable" element={isAuthenticated ? <AdminTable /> : <Navigate to="/admin" />} />
          <Route exact path="/data" element={isAuthenticated ? <Data /> : <Navigate to="/admin" />} />
          <Route exact path="/view-bills" element={<ViewBills />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
