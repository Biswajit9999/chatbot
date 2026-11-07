import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Chat from "./pages/Chat/Chat";
import History from "./pages/History/History";

const router = createBrowserRouter([
  { path: "/", element: <Chat /> },
  { path: "/history", element: <History /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}