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
    <section id={id} className={`w-full py-16 ${bgClass}`}>
      <div className={containerClass}>
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2 md:mb-3 text-center">
          {title}
        </h1>
        <h3 className="text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-center">
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
