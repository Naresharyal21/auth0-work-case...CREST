import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { Auth0Callback } from './pages/Auth0Callback';

const Home = lazy(()=>import('./pages/Home'));
const About = lazy(()=>import('./pages/About'));
const Users = lazy(()=>import('./pages/Users'));
const Login = lazy(()=>import('./pages/Login'));
const Contact = lazy(()=>import('./pages/Contact'));
const Products = lazy(()=>import('./pages/Products'));
const AddProduct = lazy(()=>import('./pages/AddProduct'));
const UserDetail = lazy(()=>import('./pages/UserDetail'));
const AuthLayout = lazy(()=>import('./layouts/AuthLayout'));
const PageNotFound = lazy(()=>import('./pages/PageNotFound'));
const ProductDetail = lazy(()=>import('./pages/ProductDetail'));
const WebsiteLayout = lazy(()=>import('./layouts/WebsiteLayout'));
const DashboardLayout = lazy(()=>import('./layouts/DashboardLayout'));

// import About from './pages/About';
// import Users from './pages/Users';
// import Login from './pages/Login';
// import Contact from './pages/Contact';
// import Products from './pages/Products';
// import AddProduct from './pages/AddProduct';
// import UserDetail from './pages/UserDetail';
// import AuthLayout from './layouts/AuthLayout';
// import PageNotFound from './pages/PageNotFound';
// import ProductDetail from './pages/ProductDetail';
// import WebsiteLayout from './layouts/WebsiteLayout';
// import DashboardLayout from './layouts/DashboardLayout';

const FallbackPage =()=>{
    return (

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            Getting Started. Please Wait.
        </div>
    )

}

const AppRoutes = () => {
    return (
        <Suspense fallback = {<FallbackPage/>}>

        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/add-product" element={<AddProduct />} />
                <Route path="/products/:productID" element={<ProductDetail />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:userID" element={<UserDetail />} />
            </Route>

            <Route element={<WebsiteLayout />}>
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth0/callback" element={<Auth0Callback />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
        </Routes>
        </Suspense>
    )
}

export default AppRoutes;
