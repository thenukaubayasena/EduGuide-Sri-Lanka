import Navbar from "../components/NavBar.jsx";
import {Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer.jsx";

const MainLayout = () => {
    const location = useLocation();
    const path = location.pathname;
    
    // Show footer only on home page ("/") and contact us page ("/contact")
    const showFooter = path === "/home" || path === "/home/contact-us" || path === "/home/testimonials";

    return (
        <>
            <Navbar/>
            <main style={{paddingTop: '85px'}}>
                <Outlet/>
            </main>
            {showFooter && <Footer />}
        </>
    );
};

export default MainLayout;