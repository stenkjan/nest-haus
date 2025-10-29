import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "primary-narrow" // Primary button with 1/3 smaller width
  | "secondary-narrow" // Secondary button with 1/3 smaller width
  | "secondary-narrow-white" // White outline narrow button
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
  | "landing-secondary-blue-white" // Landing page secondary button (blue with white background)
  | "configurator"; // Konfigurator specific button

export type ButtonSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

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
  // Allow content-based sizing with appropriate padding for text fitting
  const baseStyles = `rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center font-normal whitespace-nowrap`;

  const variants = {
    // Standard Buttons - all with fixed width
    primary:
      "bg-[#3D6CE1] text-white hover:bg-[#3D6CE1] focus:ring-[#3D6CE1] shadow-sm box-border",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm",
    // Narrow Buttons - 1/3 smaller width
    "primary-narrow":
      "bg-[#3D6CE1] text-white hover:bg-[#3D6CE1] focus:ring-[#3D6CE1] shadow-sm",
    "secondary-narrow":
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm",
    "secondary-narrow-white":
      "bg-transparent border-1 border-white text-white hover:bg-white hover:text-black focus:ring-white box-border",
    "secondary-narrow-blue":
      "bg-transparent border-1 border-[#3D6CE1] text-[#3D6CE1] hover:bg-[#3D6CE1] hover:text-white focus:ring-[#3D6CE1] box-border",
    tertiary:
      "bg-transparent border-2 border-[#3D6CE1] text-[#3D6CE1] hover:bg-[#3D6CE1] hover:text-white focus:ring-[#3D6CE1] box-border",
    outline:
      "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 box-border",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",

    // Status Buttons
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm",
    info: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm",

    // Page-Specific Buttons
    "landing-primary":
      "bg-[#3D6CE1] text-white hover:bg-[#3D6CE1] focus:ring-[#3D6CE1] shadow-sm box-border",
    "landing-secondary":
      "bg-transparent border border-white text-white hover:bg-white hover:text-black focus:ring-white box-border",
    "landing-secondary-blue":
      "bg-transparent border border-[#3D6CE1] text-[#3D6CE1] hover:bg-[#3D6CE1] hover:text-white focus:ring-[#3D6CE1] box-border",
    "landing-secondary-blue-white":
      "bg-white/90 text-[#3D6CE1] hover:bg-[#3D6CE1] hover:text-white focus:ring-[#3D6CE1] box-border",
    configurator:
      "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-md",
  };

  const sizes = {
    xxs: "px-2.5 py-1 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg",
    xs: "px-3 py-1.5 text-sm xl:text-base 2xl:text-xl",
    sm: "px-5 py-1 sm:py-1.5 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg",
    md: "px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl",
    lg: "px-9 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl",
    xl: "px-12 py-3 sm:py-3.5 md:py-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl",
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
