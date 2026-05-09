import React from "react";
import Navbar from "../components/Navbar";
import MainContent from "../components/MainContent";
import Footer from "../components/Footer";

const LandingPage = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <MainContent />
            <Footer />
        </div>
    );
};

export default LandingPage;
