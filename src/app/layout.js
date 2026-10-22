import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
title: "FitLog | Workout Library",
description:
"Choose workouts, build your daily plan, and track your fitness routine.",
};

export default function RootLayout({ children }) {
return ( <html lang="en"><body><Navbar />{children}<Footer /><ToastContainer position="top-right" autoClose={2500} /></body></html>
);
}
