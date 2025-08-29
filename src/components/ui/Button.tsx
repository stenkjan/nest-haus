import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "primary-narrow" // Primary button with 1/3 smaller width
  | "secondary-narrow" // Secondary button with 1/3 smaller width
  | "secondary-narrow-blue" // Blue secondary button with 1/3 smaller width
  | "tertiary" // Blue outline button
  | "outline" // Outlined button
  | "ghost" // Minimal button
  | "danger" // Warning/delete actions
  | "success" // Confirmation actions
  | "info" // Information actions
  | "landing-primary" // Landing page main button
  | "landing-secondary" // Landing page secondary button (white)
  | "landing-secondary-blue" // Landing page secondary button (blue)
  | "configurator"; // Konfigurator specific button

export type ButtonSize =
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "responsive";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  // Adjust width based on size - progressively wider for larger button sizes
  const getWidthClasses = (buttonSize: ButtonSize) => {
    switch (buttonSize) {
      case "xxs":
        return "w-24 sm:w-28 lg:w-32 xl:w-36";
      case "xs":
        return "w-36 sm:w-40 lg:w-44 xl:w-48 2xl:w-56";
      case "sm":
        return "w-32 sm:w-36 lg:w-40 xl:w-44";
      case "md":
        return "w-36 sm:w-40 lg:w-44 xl:w-48";
      case "lg":
        return "w-40 sm:w-44 lg:w-48 xl:w-52 2xl:w-56";
      case "xl":
        return "w-44 sm:w-48 lg:w-52 xl:w-56 2xl:w-60";
      case "responsive":
        return "w-40 sm:w-44 lg:w-48 xl:w-52";
      default:
        return "w-32 lg:w-36 xl:w-40";
    }
  };

  // Narrow width classes - 1/3 smaller than standard buttons
  const getNarrowWidthClasses = (buttonSize: ButtonSize) => {
    switch (buttonSize) {
      case "xxs":
        return "w-16 sm:w-19 lg:w-21 xl:w-24";
      case "xs":
        return "w-24 sm:w-27 lg:w-29 xl:w-32 2xl:w-37";
      case "sm":
        return "w-21 sm:w-24 lg:w-27 xl:w-29";
      case "md":
        return "w-24 sm:w-27 lg:w-29 xl:w-32";
      case "lg":
        return "w-27 sm:w-29 lg:w-32 xl:w-35 2xl:w-37";
      case "xl":
        return "w-29 sm:w-32 lg:w-35 xl:w-37 2xl:w-40";
      case "responsive":
        return "w-27 sm:w-29 lg:w-32 xl:w-35";
      default:
        return "w-21 lg:w-24 xl:w-27";
    }
  };

  // Determine width classes based on variant
  const isNarrowVariant =
    variant === "primary-narrow" ||
    variant === "secondary-narrow" ||
    variant === "secondary-narrow-blue";
  const widthClasses = isNarrowVariant
    ? getNarrowWidthClasses(size)
    : getWidthClasses(size);

  const baseStyles = `rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal ${widthClasses}`;

  const variants = {
    // Standard Buttons - all with fixed width
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm",
    // Narrow Buttons - 1/3 smaller width
    "primary-narrow":
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    "secondary-narrow":
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm",
    "secondary-narrow-blue":
      "bg-transparent border-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500",
    tertiary:
      "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    outline:
      "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",

    // Status Buttons
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm",
    info: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm",

    // Page-Specific Buttons
    "landing-primary":
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    "landing-secondary":
      "bg-transparent border-1 border-white text-white hover:bg-white hover:text-black focus:ring-white",
    "landing-secondary-blue":
      "bg-transparent border-1 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500",
    configurator:
      "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-md",
  };

  const sizes = {
    xxs: "px-1.5 py-1 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg",
    xs: "px-2 py-1.5 text-sm xl:text-base 2xl:text-xl",
    sm: "px-3 py-1 sm:py-1.5 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg",
    md: "px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl",
    lg: "px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl",
    xl: "px-8 py-3 sm:py-3.5 md:py-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl",
    responsive:
      "px-4 py-1.5 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl", // Responsive for landing
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
