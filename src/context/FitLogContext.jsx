"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { toast } from "react-toastify";

const FitLogContext = createContext(null);

const STORAGE_KEY = "fitlog-data";
const MAX_PLAN_WORKOUTS = 5;

export function FitLogProvider({ children }) {
    const [plan, setPlan] = useState([]);
    const [saved, setSaved] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [hydrated, setHydrated] = useState(false);

    // Load saved data
    useEffect(() => {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);

            
  if (storedData) {
    const parsedData = JSON.parse(storedData);

    setPlan(Array.isArray(parsedData.plan) ? parsedData.plan : []);
    setSaved(Array.isArray(parsedData.saved) ? parsedData.saved : []);
    setCompleted(Array.isArray(parsedData.completed)
        ? parsedData.completed
        : []
    );
  }
} catch (error) {
  console.error("Unable to load FitLog data:", error);
} finally {
  setHydrated(true);
}


        }, []);

    
    useEffect(() => {
        if (!hydrated) return;

        
try {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      plan,
      saved,
      completed,
    })
  );
} catch (error) {
  console.error("Unable to save FitLog data:", error);
}


    }, [plan, saved, completed, hydrated]);

    // Add a workout to today's plan

    const addToPlan = (workout) => {
        if (!workout || workout.id == null) {
            toast.error("Invalid workout.");
            return;
        }

        
if (plan.some((item) => String(item.id) === String(workout.id))) {
  toast.info("This workout is already in your plan.");
  return;
}

if (plan.length >= MAX_PLAN_WORKOUTS) {
  toast.warning("Your daily plan can contain only 5 workouts.");
  return;
}

setPlan((currentPlan) => [...currentPlan, workout]);
toast.success("Workout added to today's plan!");


    };

    // Save a workout for later

    const saveForLater = (workout) => {
        if (!workout || workout.id == null) {
            toast.error("Invalid workout.");
            return;
        }

        
if (saved.some((item) => String(item.id) === String(workout.id))) {
  toast.info("This workout is already saved.");
  return;
}

setSaved((currentSaved) => [...currentSaved, workout]);
toast.success("Workout saved for later!");


    };

    // Remove a workout from today's plan

    const removeFromPlan = (id) => {
        setPlan((currentPlan) =>
            currentPlan.filter((item) => String(item.id) !== String(id))
        );

        
setCompleted((currentCompleted) =>
  currentCompleted.filter((itemId) => String(itemId) !== String(id))
);

toast.success("Workout removed from today's plan.");


    };

    // Remove a saved workout

    const removeSaved = (id) => {
        setSaved((currentSaved) =>
            currentSaved.filter((item) => String(item.id) !== String(id))
        );

        
toast.success("Saved workout removed.");


    };

    // Mark a planned workout as completed
    
    const markAsDone = (id) => {
        if (!plan.some((item) => String(item.id) === String(id))) {
            return;
        }

        
if (completed.some((itemId) => String(itemId) === String(id))) {
  toast.info("Workout is already completed.");
  return;
}

setCompleted((currentCompleted) => [
  ...currentCompleted,
  id,
]);

toast.success("Workout completed! Great job!");


    };

    const value = {
        plan,
        saved,
        completed,
        hydrated,
        addToPlan,
        saveForLater,
        removeFromPlan,
        removeSaved,
        markAsDone,
        maxPlanWorkouts: MAX_PLAN_WORKOUTS,
    };

    return (
        <FitLogContext.Provider value={value}>
            {children}
        </FitLogContext.Provider>
    );
}

export function useFitLog() {
    const context = useContext(FitLogContext);

    if (!context) {
        throw new Error(
            "useFitLog must be used inside a FitLogProvider."
        );
    }

    return context;
}
