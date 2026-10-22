import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "./Providers";

export const metadata = {
    title: "FitLog | Workout Library",
    description:
        "Choose workouts, build your daily plan, and track your fitness routine.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Suspense fallback={
                        <div className="h-20 bg-black" />
                    }
                    >
                        <Navbar />
                    </Suspense> {children}

                    <Footer />

                    <ToastContainer position="top-right" autoClose={2500} />
                </Providers>
            </body>
        </html>
    );
}