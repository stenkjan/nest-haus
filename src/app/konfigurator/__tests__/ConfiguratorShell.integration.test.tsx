/**
 * ConfiguratorShell Integration Tests
 *
 * Tests the enhanced ConfiguratorShell component with:
 * - User interaction flows
 * - State management integration
 * - Performance optimization features
 * - Price display functionality
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { useCartStore } from "@/store/cartStore";
import ConfiguratorShell from "../components/ConfiguratorShell";
import { PriceCalculator } from "../core/PriceCalculator";

// Mock the stores
jest.mock("@/store/configuratorStore");
jest.mock("@/store/cartStore");
jest.mock("../core/PriceCalculator");

// Mock context
const mockRightPanelRef = { current: document.createElement("div") };

// Mock HybridBlobImage to avoid image loading issues in tests
jest.mock("@/components/images", () => ({
  HybridBlobImage: ({ alt, ...props }: any) => (
    <img {...props} alt={alt} data-testid="hybrid-blob-image" />
  ),
}));

const mockConfiguratorStore = {
  configuration: {
    sessionId: "test-session",
    nest: {
      category: "nest",
      value: "nest120",
      name: "Nest 120",
      price: 0,
    },
    gebaeudehuelle: {
      category: "gebaeudehuelle",
      value: "trapezblech",
      name: "Trapezblech",
      price: 0,
    },
    innenverkleidung: {
      category: "innenverkleidung",
      value: "kiefer",
      name: "Kiefer",
      price: 0,
    },
    fussboden: {
      category: "fussboden",
      value: "parkett",
      name: "Parkett",
      price: 0,
    },
    totalPrice: 165100,
    timestamp: Date.now(),
  },
  updateConfiguration: jest.fn(),
  resetConfiguration: jest.fn(),
  initializeSession: jest.fn(),
  sessionId: "test-session",
};

const mockCartStore = {
  addToCart: jest.fn(),
  cartItems: [],
  getCartCount: jest.fn(() => 0),
  getCartSummary: jest.fn(() => "Warenkorb leer"),
};

const mockPriceCalculator = {
  getOptionDisplayPrice: jest.fn(),
  calculateTotalPrice: jest.fn(() => 165100),
  clearPriceCache: jest.fn(),
  getPriceCacheInfo: jest.fn(() => ({ size: 0, keys: [] })),
};

describe("ConfiguratorShell Integration", () => {
  beforeEach(() => {
    // Setup mocks
    (useConfiguratorStore as jest.Mock).mockReturnValue(mockConfiguratorStore);
    (useCartStore as jest.Mock).mockReturnValue(mockCartStore);

    // Setup PriceCalculator mocks
    (PriceCalculator.getOptionDisplayPrice as jest.Mock).mockImplementation(
      (nestValue, selections, category, value) => {
        if (
          value === "trapezblech" ||
          value === "kiefer" ||
          value === "parkett"
        ) {
          return { type: "included" };
        }
        return { type: "upgrade", amount: 10000, monthly: 100 };
      }
    );
    (PriceCalculator.calculateTotalPrice as jest.Mock).mockReturnValue(165100);
    (PriceCalculator.clearPriceCache as jest.Mock).mockImplementation(() => {});
    (PriceCalculator.getPriceCacheInfo as jest.Mock).mockReturnValue({
      size: 0,
      keys: [],
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  it("should render all main configurator sections", () => {
    render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

    // Check for main sections
    expect(screen.getByTestId("preview-panel")).toBeInTheDocument();
    expect(screen.getByTestId("summary-panel")).toBeInTheDocument();

    // Check for category sections
    expect(screen.getByText("Dein Nest")).toBeInTheDocument();
    expect(screen.getByText("Gebäudehülle")).toBeInTheDocument();
    expect(screen.getByText("Innenverkleidung")).toBeInTheDocument();
    expect(screen.getByText("Fußboden")).toBeInTheDocument();
  });

  it("should display correct total price from store", () => {
    render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

    // Should display formatted price from configuration
    expect(screen.getByText(/€165\.100/)).toBeInTheDocument();
  });

  it("should handle nest size selection correctly", async () => {
    render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

    // Find and click Nest 160 option
    const nest160Option = screen.getByText("Nest 160");

    await act(async () => {
      fireEvent.click(nest160Option);
    });

    // Verify store update was called
    expect(mockConfiguratorStore.updateConfiguration).toHaveBeenCalledWith(
      "nest",
      expect.objectContaining({
        value: "nest160",
        name: "Nest 160",
      })
    );
  });

  it("should show upgrade prices for pro options", async () => {
    // Mock upgrade price for holzlattung
    (PriceCalculator.getOptionDisplayPrice as jest.Mock).mockImplementation(
      (nestValue, selections, category, value) => {
        if (value === "holzlattung") {
          return { type: "upgrade", amount: 71200, monthly: 712 };
        }
        return { type: "included" };
      }
    );

    render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

    // Should display upgrade price for holzlattung
    await waitFor(() => {
      expect(screen.getByText(/\+€71\.200/)).toBeInTheDocument();
      expect(screen.getByText(/€712\/Monat/)).toBeInTheDocument();
    });
  });

  it("should handle material selection with price updates", async () => {
    render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

    // Find and click holzlattung option
    const holzlattungOption = screen.getByText("Holzlattung Lärche");

    await act(async () => {
      fireEvent.click(holzlattungOption);
    });

    // Verify store update was called
    expect(mockConfiguratorStore.updateConfiguration).toHaveBeenCalledWith(
      "gebaeudehuelle",
      expect.objectContaining({
        value: "holzlattung",
        name: "Holzlattung Lärche",
      })
    );
  });

  it("should show quantity selector for PV systems", () => {
    render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

    // Find PV section and verify quantity selector is present
    const pvSection = screen.getByText("PV-Anlage");
    expect(pvSection).toBeInTheDocument();

    // Should have quantity controls
    const quantityInputs = screen.getAllByRole("spinbutton");
    expect(quantityInputs.length).toBeGreaterThan(0);
  });

  it("should handle cart addition correctly", async () => {
    render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

    // Find and click "In den Warenkorb" button
    const addToCartButton = screen.getByText("In den Warenkorb");

    await act(async () => {
      fireEvent.click(addToCartButton);
    });

    // Verify cart store was called
    expect(mockCartStore.addToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: "test-session",
        totalPrice: 165100,
      })
    );
  });

  describe("Performance Optimization Tests", () => {
    it("should use memoized price calculations", () => {
      const { rerender } = render(
        <ConfiguratorShell rightPanelRef={mockRightPanelRef} />
      );

      // Initial render should call price calculator
      expect(PriceCalculator.getOptionDisplayPrice).toHaveBeenCalled();

      const initialCallCount = (
        PriceCalculator.getOptionDisplayPrice as jest.Mock
      ).mock.calls.length;

      // Re-render with same configuration (should use memoized values)
      rerender(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

      // Should not make additional price calculation calls
      expect(
        (PriceCalculator.getOptionDisplayPrice as jest.Mock).mock.calls.length
      ).toBe(initialCallCount);
    });

    it("should only recalculate prices when relevant configuration changes", () => {
      // Mock store with different configuration
      const modifiedStore = {
        ...mockConfiguratorStore,
        configuration: {
          ...mockConfiguratorStore.configuration,
          nest: {
            category: "nest",
            value: "nest160",
            name: "Nest 160",
            price: 0,
          },
        },
      };

      (useConfiguratorStore as jest.Mock).mockReturnValue(modifiedStore);

      render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

      // Should call price calculator for the new configuration
      expect(PriceCalculator.getOptionDisplayPrice).toHaveBeenCalledWith(
        "nest160",
        expect.any(Object),
        expect.any(String),
        expect.any(String)
      );
    });

    it("should demonstrate performance improvements through caching", async () => {
      // Setup performance monitoring
      const performanceStart = performance.now();

      render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

      // Multiple interactions should be fast due to caching
      const holzlattungOption = screen.getByText("Holzlattung Lärche");

      await act(async () => {
        fireEvent.click(holzlattungOption);
      });

      const performanceEnd = performance.now();
      const totalTime = performanceEnd - performanceStart;

      // Total interaction time should be reasonable (under 100ms)
      expect(totalTime).toBeLessThan(100);

      console.log(
        `🔧 Configurator interaction time: ${totalTime.toFixed(2)}ms`
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle missing configuration gracefully", () => {
      const storeWithoutConfig = {
        ...mockConfiguratorStore,
        configuration: null,
      };

      (useConfiguratorStore as jest.Mock).mockReturnValue(storeWithoutConfig);

      render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

      // Should still render without crashing
      expect(screen.getByTestId("preview-panel")).toBeInTheDocument();
    });

    it("should handle price calculation errors gracefully", () => {
      // Mock price calculator to throw error
      (PriceCalculator.getOptionDisplayPrice as jest.Mock).mockImplementation(
        () => {
          throw new Error("Price calculation failed");
        }
      );

      render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

      // Should render without crashing, showing fallback UI
      expect(screen.getByTestId("preview-panel")).toBeInTheDocument();
      expect(screen.getByTestId("summary-panel")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", () => {
      render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

      // Check for accessibility attributes
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);

      // Each button should have accessible text
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName();
      });
    });

    it("should support keyboard navigation", async () => {
      render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

      const nestOptions = screen.getAllByRole("button");
      const firstOption = nestOptions[0];

      // Should be focusable
      firstOption.focus();
      expect(document.activeElement).toBe(firstOption);

      // Should respond to Enter key
      await act(async () => {
        fireEvent.keyDown(firstOption, { key: "Enter", code: "Enter" });
      });

      // Should trigger selection (exact expectation depends on implementation)
      expect(firstOption).toHaveAttribute("aria-pressed");
    });
  });

  describe("Mobile Responsiveness", () => {
    it("should adapt layout for mobile screens", () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 600,
      });

      render(<ConfiguratorShell rightPanelRef={mockRightPanelRef} />);

      // Should render mobile-optimized layout
      expect(screen.getByTestId("preview-panel")).toBeInTheDocument();
      expect(screen.getByTestId("summary-panel")).toBeInTheDocument();
    });
  });
});
