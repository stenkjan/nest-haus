/**
 * SummaryPanel Tests
 *
 * Tests the SummaryPanel component price display logic:
 * - Correct handling of 0 price items showing "inkludiert"
 * - Proper formatting for paid items
 * - Lowercase "inkludiert" text
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useConfiguratorStore } from "@/store/configuratorStore";
import { useCartStore } from "@/store/cartStore";
import SummaryPanel from "../components/SummaryPanel";

// Mock the stores
vi.mock("@/store/configuratorStore");
vi.mock("@/store/cartStore");

const mockConfiguratorStore = {
  configuration: {
    sessionId: "test-session",
    nest: {
      category: "nest",
      value: "nest120",
      name: "Nest 120",
      price: 165100,
    },
    gebaeudehuelle: {
      category: "gebaeudehuelle",
      value: "trapezblech",
      name: "Trapezblech",
      price: 0, // This should show "inkludiert"
    },
    innenverkleidung: {
      category: "innenverkleidung",
      value: "kiefer",
      name: "Kiefer",
      price: 0, // This should show "inkludiert"
    },
    fussboden: {
      category: "fussboden",
      value: "parkett",
      name: "Parkett",
      price: 0, // This should show "inkludiert"
    },
    pvanlage: {
      category: "pvanlage",
      value: "pv_standard",
      name: "PV-Anlage Standard",
      price: 2500,
      quantity: 4,
    },
    planungspaket: {
      category: "planungspaket",
      value: "pro",
      name: "Pro Planungspaket",
      price: 0, // This should show "inkludiert"
    },
    totalPrice: 175100,
    timestamp: Date.now(),
  },
  currentPrice: 175100,
  isConfigurationComplete: vi.fn(() => true),
  getConfigurationForCart: vi.fn(() => ({})),
};

const mockCartStore = {
  addConfigurationToCart: vi.fn(),
};

describe("SummaryPanel", () => {
  beforeEach(() => {
    (useConfiguratorStore as any).mockReturnValue(mockConfiguratorStore);
    (useCartStore as any).mockReturnValue(mockCartStore);
    vi.clearAllMocks();
  });

  it("should render all configuration items", () => {
    render(<SummaryPanel />);

    // Check that all items are displayed
    expect(screen.getByText("Nest 120")).toBeInTheDocument();
    expect(screen.getByText("Trapezblech")).toBeInTheDocument();
    expect(screen.getByText("Kiefer")).toBeInTheDocument();
    expect(screen.getByText("Parkett")).toBeInTheDocument();
    expect(screen.getByText("PV-Anlage Standard (4x)")).toBeInTheDocument();
    expect(screen.getByText("Premium Planungspaket")).toBeInTheDocument();
  });

  it('should show "inkludiert" in lowercase for items with 0 price', () => {
    render(<SummaryPanel />);

    // Should show lowercase "inkludiert" for base materials with 0 price
    const inkludiertElements = screen.getAllByText("inkludiert");

    // Should have multiple instances of "inkludiert" for 0-price items
    expect(inkludiertElements.length).toBeGreaterThan(0);

    // Verify it's lowercase and not "Inkludiert"
    inkludiertElements.forEach((element) => {
      expect(element).toHaveTextContent("inkludiert");
      expect(element).not.toHaveTextContent("Inkludiert");
    });
  });

  it('should show "Startpreis" for nest item', () => {
    render(<SummaryPanel />);

    // Nest should show "Startpreis" label
    expect(screen.getByText("Startpreis")).toBeInTheDocument();
    expect(screen.getByText("€165.100")).toBeInTheDocument();
  });

  it('should show "Aufpreis" for items with price > 0', () => {
    render(<SummaryPanel />);

    // PV system should show "Aufpreis" since it has a price
    const aufpreisElements = screen.getAllByText("Aufpreis");
    expect(aufpreisElements.length).toBeGreaterThan(0);

    // Should show calculated PV price (4 x €2,500 = €10,000)
    expect(screen.getByText("€10.000")).toBeInTheDocument();
  });

  it("should not show em dash (—) for included items", () => {
    render(<SummaryPanel />);

    // Should not contain em dash for included items
    expect(screen.queryByText("—")).not.toBeInTheDocument();
  });

  it("should handle planungspaket with 0 price correctly", () => {
    render(<SummaryPanel />);

    // Premium package with 0 price should show "inkludiert"
    expect(screen.getByText("Premium Planungspaket")).toBeInTheDocument();

    // Should have "inkludiert" text somewhere in the component for this item
    const inkludiertElements = screen.getAllByText("inkludiert");
    expect(inkludiertElements.length).toBeGreaterThanOrEqual(1);
  });

  it("should calculate PV price correctly with quantity", () => {
    render(<SummaryPanel />);

    // PV with quantity 4 and price 2500 should show €10,000
    expect(screen.getByText("€10.000")).toBeInTheDocument();
    expect(screen.getByText("PV-Anlage Standard (4x)")).toBeInTheDocument();
  });

  it("should show total price correctly", () => {
    render(<SummaryPanel />);

    expect(screen.getByText("Gesamtpreis:")).toBeInTheDocument();
    expect(screen.getByText("€175.100")).toBeInTheDocument();
  });

  it("should handle configuration with mixed pricing", () => {
    // Test configuration with both 0-price and paid items
    const mixedConfig = {
      ...mockConfiguratorStore,
      configuration: {
        ...mockConfiguratorStore.configuration,
        gebaeudehuelle: {
          category: "gebaeudehuelle",
          value: "holzlattung",
          name: "Holzlattung Lärche",
          price: 71200, // Paid upgrade
        },
        innenverkleidung: {
          category: "innenverkleidung",
          value: "kiefer",
          name: "Kiefer",
          price: 0, // Included
        },
      },
    };

    (useConfiguratorStore as any).mockReturnValue(mixedConfig);

    render(<SummaryPanel />);

    // Should show both "Aufpreis" and "inkludiert"
    expect(screen.getByText("Aufpreis")).toBeInTheDocument();
    expect(screen.getByText("inkludiert")).toBeInTheDocument();
    expect(screen.getByText("€71.200")).toBeInTheDocument();
  });

  describe("Edge Cases", () => {
    it("should handle items with undefined price", () => {
      const configWithUndefinedPrice = {
        ...mockConfiguratorStore,
        configuration: {
          ...mockConfiguratorStore.configuration,
          gebaeudehuelle: {
            category: "gebaeudehuelle",
            value: "trapezblech",
            name: "Trapezblech",
            price: undefined,
          },
        },
      };

      (useConfiguratorStore as any).mockReturnValue(configWithUndefinedPrice);

      render(<SummaryPanel />);

      // Should still show "inkludiert" for undefined price
      expect(screen.getByText("inkludiert")).toBeInTheDocument();
    });

    it("should handle fenster with square meters correctly", () => {
      const configWithFenster = {
        ...mockConfiguratorStore,
        configuration: {
          ...mockConfiguratorStore.configuration,
          fenster: {
            category: "fenster",
            value: "holz_alu",
            name: "Holz-Alu Fenster",
            price: 800,
            squareMeters: 25,
          },
        },
      };

      (useConfiguratorStore as any).mockReturnValue(configWithFenster);

      render(<SummaryPanel />);

      // Should show fenster with square meters and calculated price
      expect(screen.getByText("Holz-Alu Fenster (25m²)")).toBeInTheDocument();
      expect(screen.getByText("€20.000")).toBeInTheDocument(); // 25 * 800
    });
  });
});
