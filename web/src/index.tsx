import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DomainsPage } from "./pages/dashboard/Domains";
import { TasksPage } from "./pages/dashboard/Tasks";
import { CreateTaskPage } from "./pages/dashboard/CreateTask";
import { TaskDetailsPage } from "./pages/dashboard/TaskDetails";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "domains",
        element: <DomainsPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
        children: [
          {
            path: ":taskId",
            element: <TaskDetailsPage />,
          },
        ],
      },
      {
        path: "tasks/create",
        element: <CreateTaskPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
