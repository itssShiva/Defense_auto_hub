import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import App from "../App.jsx";
import Home from "../Pages/Home.jsx";
import Contact from "../Pages/Contact.jsx";
import FindDealers from "../Pages/FindDealers.jsx";
import Login from "../auth/pages/Login.jsx";
import AdminDashboard from "../Admin/pages/AdminDashboard.jsx";
import DealerDashboard from "../Dealer/pages/DealerDashboard.jsx";
import AdminRoute from "../ProtectiveRoutes/adminRoutes.jsx";
import DealerRoute from "../ProtectiveRoutes/dealerRoutes.jsx";
import GuestRoute from "../ProtectiveRoutes/guestRoutes.jsx";
import Blogs from "../Pages/Blogs.jsx";
import BlogDetails from "../Pages/BlogDetails.jsx";
import CarLoanHome from "../Loans/LoanHome.jsx";
import EligibilityDocuments from "../Loans/Eligibilitydocuments.jsx";
import EmiCalculator from "../Loans/EmiCalculator.jsx";
import LoanEnquiryForm from "../Loans/EnquiryForm.jsx";
import InsuranceHome from "../Insurance/InsuranceHome.jsx";

/* ── Lazy-loaded public car platform pages ── */
const AllCarsPage = lazy(() => import("../cars/pages/AllCarsPage.jsx"));
const BrandsPage = lazy(() => import("../cars/pages/BrandsPage.jsx"));
const BrandDetailPage = lazy(() => import("../cars/pages/BrandDetailPage.jsx"));
const CarDetailPage = lazy(() => import("../cars/pages/CarDetailPage.jsx"));
const ModelDetailPage = lazy(() => import("../cars/pages/ModelDetailPage.jsx"));
const VariantDetailPage = lazy(() => import("../cars/pages/VariantDetailPage.jsx"));
const ComparePage = lazy(() => import("../cars/pages/ComparePage.jsx"));
const SearchPage = lazy(() => import("../cars/pages/SearchPage.jsx"));
const UsedCarsPage = lazy(() => import("../cars/pages/UsedCarsPage.jsx"));
const UsedCarDetailPage = lazy(() => import("../cars/pages/UsedCarDetailPage.jsx"));
const NewCarInsurance = lazy(() => import("../Insurance/NewCarInsurance.jsx"));
const QutationForm = lazy(() => import("../Insurance/QutationForm.jsx"));
const RenewInsurance = lazy(() => import("../Insurance/RenewInsurance.jsx"));
const ZeroDep = lazy(() => import("../Insurance/ZeroDep.jsx"));
const CityInsurance = lazy(() => import("../Insurance/CityInsurance.jsx"));


/* ── Loading fallback ── */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#fafbf8]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#b48001]/30 border-t-[#b48001] rounded-full animate-spin" />
      <p className="text-[#708ca4] text-sm font-medium">Loading…</p>
    </div>
  </div>
);

const Lazy = ({ element }) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/contact", element: <Contact /> },
      {
        path: "/login",
        element: <GuestRoute><Login /></GuestRoute>,
      },
      {
        path: "/admin-dashboard",
        element: <AdminRoute><AdminDashboard /></AdminRoute>,
      },
      {
        path: "/dealer-dashboard",
        element: <DealerRoute><DealerDashboard /></DealerRoute>,
      },

      /* ── Blog routes ── */
      { path: "/blogs", element: <Blogs /> },
      { path: "/blogs/:slug", element: <BlogDetails /> },
      { path: "find-dealers", element: <FindDealers /> },

      /* ── Car Platform routes ── */
      { path: "/cars", element: <Lazy element={<AllCarsPage />} /> },
      { path: "/cars/:slug", element: <Lazy element={<CarDetailPage />} /> },
      { path: "/brands", element: <Lazy element={<BrandsPage />} /> },
      { path: "/brands/:slug", element: <Lazy element={<BrandDetailPage />} /> },
      { path: "/models/:slug", element: <Lazy element={<ModelDetailPage />} /> },
      { path: "/variants/:slug", element: <Lazy element={<VariantDetailPage />} /> },
      { path: "/compare", element: <Lazy element={<ComparePage />} /> },
      { path: "/search", element: <Lazy element={<SearchPage />} /> },
      { path: "/used-cars", element: <Lazy element={<UsedCarsPage />} /> },
      { path: "/used-cars/:slug", element: <Lazy element={<UsedCarDetailPage />} /> },
      { path: "/loans", element: <Lazy element={<CarLoanHome />} /> },
      { path: "/loan/eligibility-documents", element: <Lazy element={<EligibilityDocuments />} /> },
      { path: "/loan/emi-calculator", element: <Lazy element={<EmiCalculator />} /> },
      { path: "/loan/enquiry-form", element: <Lazy element={<LoanEnquiryForm />} /> },
      { path: '/insurance', element: <Lazy element={<InsuranceHome />} /> },
      { path: '/newCar-Insurance', element: <Lazy element={<NewCarInsurance />} /> },
      { path: '/quotation-form', element: <Lazy element={<QutationForm />} /> },
      { path: '/insurance/renew', element: <Lazy element={<RenewInsurance />} /> },
      { path: '/insurance/zero-dep', element: <Lazy element={<ZeroDep />} /> },
      { path: '/insurance/City', element: <Lazy element={<CityInsurance />} /> },

    ],
  },
]);

export default router;
