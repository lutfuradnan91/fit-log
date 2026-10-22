"use client";

import { FitLogProvider } from "@/context/FitLogContext";

export default function Providers({ children }) {
    return (<FitLogProvider>
        {children} </FitLogProvider>
    );
}
