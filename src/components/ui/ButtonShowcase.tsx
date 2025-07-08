import React from "react";
import Button, { ButtonVariant, ButtonSize } from "./Button";

/**
 * ButtonShowcase - Development tool to visualize all button variants
 * Use this component to preview and test all button styles
 * Can be imported on any page for quick reference
 */
const ButtonShowcase: React.FC = () => {
  const variants: ButtonVariant[] = [
    "primary",
    "secondary",
    "outline",
    "ghost",
    "danger",
    "success",
    "info",
    "landing-primary",
    "landing-secondary",
    "landing-secondary-blue",
    "configurator",
  ];

  const sizes: ButtonSize[] = ["xxs", "xs", "sm", "md", "lg", "xl"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Button System Showcase</h1>

      {/* All Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          All Button Variants (Fixed Width)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {variants.map((variant) => (
            <div key={variant} className="flex flex-col items-center space-y-2">
              <Button variant={variant} size="md">
                {variant}
              </Button>
              <span className="text-xs text-gray-500">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Size Variations */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          Size Variations (Primary)
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center space-y-2">
              <Button variant="primary" size={size}>
                Button {size}
              </Button>
              <span className="text-xs text-gray-500">{size}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Landing Page Preview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          Landing Page Buttons (on dark background)
        </h2>
        <div className="bg-gray-800 p-8 rounded-lg">
          <div className="flex gap-4 justify-center">
            <Button variant="landing-primary" size="lg">
              Mehr erfahren
            </Button>
            <Button variant="landing-secondary" size="lg">
              Konfigurator
            </Button>
          </div>
        </div>
      </section>

      {/* Common Button Pairs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          Common Button Combinations
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
          <div className="flex gap-4">
            <Button variant="success">Save</Button>
            <Button variant="danger">Delete</Button>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Cancel</Button>
            <Button variant="ghost">Skip</Button>
          </div>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Usage Instructions</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4">How to use buttons in your code:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {`import { Button } from '@/components/ui';

// Basic usage (all buttons have fixed width)
<Button variant="primary">Click me</Button>

// With size
<Button variant="configurator" size="lg">
  Configure Now
</Button>

// With click handler
<Button variant="success" onClick={handleClick}>
  Save Changes
</Button>

// Custom styling
<Button variant="outline" className="custom-class">
  Custom Button
</Button>`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default ButtonShowcase;
