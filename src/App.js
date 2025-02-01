import logo from "./logo.svg";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./features/auth/Login";
import AuthGuard from "./features/auth/AuthGuard";
import Hotels from "./features/Hotel/Hotels";
import HotelDashboard from "./pages/hotelDashboard/HotelDashboard";
import RoomDashboard from "./pages/roomDashboard/RoomDashboard";
import TransactionDashboard from "./pages/transactionDashboard/TransactionDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
    children: [
      {
        index: true,
        element: (
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        ),
      },
      {
        path: "hotels",
        element: (
          <AuthGuard>
            <HotelDashboard />
          </AuthGuard>
        ),
      },
      {
        path: "rooms",
        element: (
          <AuthGuard>
            <RoomDashboard />
          </AuthGuard>
        ),
      },
      {
        path: "transactions",
        element: (
          <AuthGuard>
            <TransactionDashboard />
          </AuthGuard>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
