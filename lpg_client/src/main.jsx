import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import GeneratePath from './pages/GeneratePath.jsx'
import MyPaths from './pages/MyPaths.jsx'
import PathModules from './pages/PathModules'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "generate-path",
        element: <GeneratePath />,
      },
      {
        path: "my-paths",
        element: <MyPaths />,
      },
      {
        path: "pathModules",
        element: <PathModules/>,
      }
      /* {
        path: "/",
        element: <Hero />,
      },
      {
        path: "howItWorks",
        element: <HowItWorksPage />,
      },
      {
        path: "dashboard/:slug",
        element: (
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        ),
        children: [
          {
            path: "",
            element: <Dashboard/>
          },
          {
            path: "update-pass/:id",
            element: <EditPass/>
          },
          {
            path: "add-pass",
            element: <AddPass/>
          }
        ]
      }, */
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
