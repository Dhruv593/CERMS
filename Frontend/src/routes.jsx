import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { ChartColumnStacked, PackagePlus, ChartBarStacked, HandCoins, IndianRupee, Landmark } from 'lucide-react';
import { Subcategory } from '../src/pages/dashboard/Subcategory'
import Newstock from "./pages/dashboard/Newstock";
import { Category } from "./pages/dashboard/Category";
import {Deposit} from "./pages/dashboard/Deposit"
import Rent from "./pages/dashboard/Rent";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <ChartColumnStacked {...icon} />,
        name: "Category",
        path: "/category",
        element: <Category />,
      },
      {
        icon: <ChartBarStacked {...icon} />,
        name: "Sub Category",
        path: "/subcategory",
        element: <Subcategory />,
      },
      {
        icon: <PackagePlus {...icon} />,
        name: "New Stock",
        path: "/newStock",
        element: <Newstock />,
      },
      {
        // icon: <HandCoins  {...icon} />,
        // name: "Deposit",
        icon: <IndianRupee {...icon} />,
        name: "Rent",
        path: "/rent",
        element: <Rent />,
      },
      {
        icon: <Landmark {...icon} />,
        name: "deposit",
        path: "/deposit",
        element: <Deposit />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
