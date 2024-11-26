import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignIn from './Components/SignIn/SignIn.tsx';
import { loginFormData } from './Data/loginData.tsx';
import SignUp from './Components/SignUp/SignUp.tsx';
import Dashboard from './Components/Dashboard/Dashboard.tsx';
import AddNew from './Components/AddNew/AddNew.tsx';
import Edit from './Components/Edit/Edit.tsx';

import OrderList from './Components/OrderList/OrderList.tsx';
import ShowItem from './Components/ShowItem/ShowItem.tsx';
import Products from './Components/Products/Products.tsx';
import Favorites from './Components/Favorites/Favorites.tsx';
import Logout from './Components/Logout/Logout.tsx';

const routes = createBrowserRouter([
  {
    path: '/signin',
    element: (
      <SignIn
        usernameLabel={loginFormData.usernameLabel}
        passwordLabel={loginFormData.passwordLabel}
        usernamePlaceholder={loginFormData.usernamePlaceholder}
        passwordPlaceholder={loginFormData.passwordPlaceholder}
        submitButtonText={loginFormData.submitButtonText}
        createAccountText={loginFormData.createAccountText}
        createAccountLinkText={loginFormData.createAccountLinkText}
        headerText={loginFormData.headerText}
        subHeaderText={loginFormData.subHeaderText}
        apiUrl={loginFormData.apiUrl}
      />
    ),
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/Dashboard',
    element: <Dashboard />,
    children: [
      {
        path: 'showall',
        element: <Products />,
      },
      {
        path: 'showitem/:id', // Corrected path with "/:id"
        element: <ShowItem />,
      },
      {
        path: 'addnew',
        element: <AddNew />,
      },
      {
        path: 'edit/:id',
        element: <Edit />,
      },
      {
        path: 'favorites',
        element: <Favorites />,
      }, 
      {
        path: 'orderList',
        element: <OrderList />,
      },
      {
        path: 'orderList',
        element: <OrderList />,
      },
      {
        path: 'logout',
        element: <Logout />,
      },
    ],

  },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
