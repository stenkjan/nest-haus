import React, { Suspense } from "react";
import AppointmentBooking from "./AppointmentBooking";

interface AppointmentBookingSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  backgroundColor?: "white" | "gray";
  maxWidth?: boolean;
}

export const AppointmentBookingSection: React.FC<
  AppointmentBookingSectionProps
> = ({
  id,
  title = "Vereinbare jetzt deinen Termin",
  subtitle = "Wir helfen gerne.",
  backgroundColor = "white",
  maxWidth = true,
}) => {
  const bgClass = backgroundColor === "gray" ? "bg-gray-50" : "bg-white";
  const containerClass = maxWidth
    ? "w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8"
    : "w-full px-[7.5%]";

  return (
    <section id={id} className={`w-full pt-12 pb-4 ${bgClass}`}>
      <div className={containerClass}>
        <h1 className="h1-secondary text-black text-center">{title}</h1>
        <h3 className="h3-secondary text-black mb-8 max-w-3xl mx-auto text-center">
          {subtitle}
        </h3>
        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-200 h-96 rounded max-w-5xl mx-auto"></div>
          }
        >
          <AppointmentBooking />
        </Suspense>
      </div>
    </section>
  );
};
