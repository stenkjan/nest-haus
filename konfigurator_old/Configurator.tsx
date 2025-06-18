'use client';

import React, { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDialog } from '@/context/DialogContext';
import { useCart, CartItem } from '@/context/CartContext';
import { ClientBlobImage } from '@/components/client/ClientBlobImage';
import { SelectionBox } from './SelectionBox';
import { InfoBox } from './InfoBox';
import { FactsBox } from './FactsBox';
import { useConfigurator } from '../../../hooks/useConfigurator';
import { ConfiguratorProps, SelectionOption } from '../../../types/configurator';
import {
    NEST_OPTIONS,
    GEBEUDE_OPTIONS,
    INNENVERKLEIDUNG_OPTIONS,
    FUSSBODEN_OPTIONS,
    PV_OPTIONS,
    PLANNING_PACKAGES,
    COMBINATION_PRICES,
    getModuleSizeIndex,
    calculateMonthlyPayment,
    GRUNDSTUECKSCHECK_PRICE,
    calculateCombinationPrice
} from '../../../constants/configurator';
import { FENSTER_OPTIONS } from '../../../constants/windows';
import {
    formatPrice,
    getPreviewImagePath,
    getSummaryItems,
    generateUniqueId
} from '../../../utils/configurator';
import { IMAGES } from '../../../constants/images';
import './hide-scrollbar.css';
import { useConfiguratorContext } from '../../../context/ConfiguratorContext';

// Grundstücks-Check Info Box Component (Selectable)
const GRUNDSTUECKSCHECK_OPTION: SelectionOption = {
    value: 'grundstueckscheck',
    name: 'Grundstücks-Check',
    category: 'grundstueckscheck',
    description: 'Wir prüfen dein Grundstück auf rechtliche und technische Rahmenbedingungen.\n\nKein Risiko – 14 Tage Rückgaberecht.\n\nHäuser bauen bedeutet, sich an bestimmte Spielregeln zu halten – und diese können je nach Region unterschiedlich sein. Wir kennen die gesetzlichen Vorgaben genau und unterstützen dich dabei, die Anforderungen deines Baugrunds zu verstehen.\n\nMit unserem Grundstückscheck prüfen wir, welche Gegebenheiten du bei deinem Wunschgrundstück beachten musst. Gib einfach die relevanten Informationen ein, und wir liefern dir zeitnah ein umfassendes Feedback. So kannst du dein Projekt sicher und fundiert planen.\n\nSollte unser Nest auf Grund rechtlicher Rahmenbedingungen nicht zu deinem Grundstück passen, erhältst du deine Anzahlung zurück.',
    price: GRUNDSTUECKSCHECK_PRICE
};

const GrundstuecksCheckBox: React.FC<{
    isSelected: boolean;
    onClick: () => void;
}> = ({ isSelected, onClick }) => (
    <div
        className={`box_selection_service flex flex-col border rounded-[19px] px-6 py-4 cursor-pointer transition-colors ${isSelected ? 'selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1]' : 'border-gray-300 hover:border-[#3D6DE1]'}`}
        style={{ marginBottom: 24, background: '#fff', userSelect: 'none' }}
        onClick={onClick}
    >
        <div className="flex justify-between items-start mb-2">
            <div>
                <div className="font-medium text-[16px] tracking-[0.02em] leading-tight text-black">Grundstücks-Check</div>
                <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1">Wir prüfen dein Grundstück</div>
            </div>
            <div className="text-right">
                <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] mb-1">
                    {formatPrice(GRUNDSTUECKSCHECK_OPTION.price)}
                </div>
                <div className="font-normal text-[10px] tracking-[0.03em] leading-[12px] text-gray-600">
                    <div>Kein Risiko</div>
                    <div>14 Tage</div>
                </div>
            </div>
        </div>
        <div className="font-normal text-[12px] tracking-[0.03em] leading-[18px] text-gray-800 mt-2">
            Häuser bauen bedeutet, sich an bestimmte Spielregeln zu halten – und diese können je nach Region unterschiedlich sein.<br />
            Wir kennen die gesetzlichen Vorgaben genau und unterstützen dich dabei, die Anforderungen deines Baugrunds zu verstehen.<br />
            <br />
            Mit unserem Grundstückscheck prüfen wir, welche Gegebenheiten du bei deinem Wunschgrundstück beachten musst. Gib einfach die relevanten Informationen ein, und wir liefern dir zeitnah ein umfassendes Feedback. So kannst du dein Projekt sicher und fundiert planen.<br />
            <br />
            <span className="font-medium text-black">
                Sollte unser Nest auf Grund rechtlicher Rahmenbedingungen nicht zu deinem Grundstück passen, erhältst du deine Anzahlung zurück.
            </span>
        </div>
    </div>
);

// Add a ref type for the Configurator component
export interface ConfiguratorRef {
  isRightPanelAtBottom: boolean;
  rightPanelScrollTop: number;
  rightPanelScrollHeight: number;
  rightPanelClientHeight: number;
  reset: () => void;
}

// Utility function to detect iOS (robust for iPadOS 13+)
function isIOS() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Macintosh') && typeof document !== 'undefined' && 'ontouchend' in document)
  );
}

// Configurator component starts here
const Configurator = forwardRef<ConfiguratorRef, ConfiguratorProps>(function ConfiguratorWithRef({ initialModel = 'nest80' }, ref) {
    const router = useRouter();
    const { openDialog, configuratorState, setSelectedPackage } = useDialog();
    const { updateCartItem, cartItems } = useCart();
    const { updateSelections, totalPrice } = useConfiguratorContext();
    const [pvQuantity, setPvQuantity] = useState<number>(0);
    const [maxPvModules, setMaxPvModules] = useState<number>(4);
    const [currentCartItemId] = useState<string>(generateUniqueId());
    const previewRef = useRef<HTMLDivElement>(null);
    const summaryRef = useRef<HTMLDivElement>(null);
    const [previewStyles, setPreviewStyles] = useState<React.CSSProperties>({});
    const [isMobileSticky, setIsMobileSticky] = useState(false);
    const mobileStickyHeaderRef = useRef<HTMLDivElement>(null);
    const [navbarHeight, setNavbarHeight] = useState(56); // Default navbar height
    const [scrollPosition, setScrollPosition] = useState(0);
    const [previewHeight, setPreviewHeight] = useState('min(25vh, 220px)');
    const [fensterSquareMeters, setFensterSquareMeters] = useState<number>(0);
    const [maxFensterArea, setMaxFensterArea] = useState<number>(75);
    const [desktopImageSize, setDesktopImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [isClient, setIsClient] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Dynamically track the height of the mobile sticky header
    const [mobileStickyHeaderHeight, setMobileStickyHeaderHeight] = useState(0);

    const isMounted = useRef(false);
    const [initialTimestamp] = useState(() => Date.now());

    // Move this state to the top
    const [isGrundstuecksCheckSelected, setIsGrundstuecksCheckSelected] = useState(false);

    const rightPanelRef = useRef<HTMLDivElement>(null);
    const [rightPanelScrollState, setRightPanelScrollState] = useState({
        isAtBottom: false,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0
    });

    const [isIOSMobile, setIsIOSMobile] = useState(false);

    const {
        selections,
        activeViewIndex,
        hasPart2BeenActive,
        hasPart3BeenActive,
        isMobile,
        handleSelection,
        setActiveViewIndex,
        setHasPart2BeenActive,
        setHasPart3BeenActive
    } = useConfigurator({ initialModel });

    // Expose scroll state and reset method to parent component
    useImperativeHandle(ref, () => ({
        isRightPanelAtBottom: rightPanelScrollState.isAtBottom,
        rightPanelScrollTop: rightPanelScrollState.scrollTop,
        rightPanelScrollHeight: rightPanelScrollState.scrollHeight,
        rightPanelClientHeight: rightPanelScrollState.clientHeight,
        reset: () => {
            setActiveViewIndex(1);
            setHasPart2BeenActive(false);
            setHasPart3BeenActive(false);
            setPvQuantity(0);
            setFensterSquareMeters(0);
            setIsGrundstuecksCheckSelected(false);
            
            // Set default selections
            handleSelection({
                category: 'nest',
                value: 'nest80',
                price: 155500,
                name: 'Nest. 80',
                description: '80m² Nutzfläche'
            });
            
            handleSelection({
                category: 'gebaeudehuelle',
                value: 'trapezblech',
                price: 0,
                name: 'Trapezblech',
                description: 'Robuste und langlebige Metallverkleidung'
            });
            
            handleSelection({
                category: 'innenverkleidung',
                value: 'kiefer',
                price: 0,
                name: 'Kiefer',
                description: 'Natürliche Kiefernholz-Verkleidung'
            });
            
            handleSelection({
                category: 'fussboden',
                value: 'parkett',
                price: 0,
                name: 'Parkett',
                description: 'Hochwertiger Parkettboden'
            });
            
            // Clear optional selections
            handleSelection({ category: 'fenster', value: '', price: 0, name: '', description: '' });
            handleSelection({ category: 'pvanlage', value: '', price: 0, name: '', description: '' });
            handleSelection({ category: 'paket', value: '', price: 0, name: '', description: '' });
            
            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }), [rightPanelScrollState, setActiveViewIndex, setHasPart2BeenActive, setHasPart3BeenActive, handleSelection]);

    // Add scroll handler for right panel
    const handleRightPanelScroll = () => {
        if (rightPanelRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = rightPanelRef.current;
            const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
            setRightPanelScrollState({
                isAtBottom,
                scrollTop,
                scrollHeight,
                clientHeight
            });
        }
    };

    // Add this useEffect to handle client-side initialization and desktop detection
    useEffect(() => {
        setIsClient(true);
        setIsDesktop(window.innerWidth >= 1024);

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!mobileStickyHeaderRef.current) return;
        const updateHeight = () => {
            if (mobileStickyHeaderRef.current) {
                setMobileStickyHeaderHeight(mobileStickyHeaderRef.current.offsetHeight);
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
      const checkPlatform = () => {
        setIsDesktop(window.innerWidth >= 1024);
        setIsIOSMobile(isIOS() && window.innerWidth < 1024);
      };
      checkPlatform();
      window.addEventListener('resize', checkPlatform);
      return () => window.removeEventListener('resize', checkPlatform);
    }, []);

    // Ensure body and html overflow is visible on iOS mobile
    useEffect(() => {
      if (isIOS() && typeof window !== 'undefined' && window.innerWidth < 1024) {
        // On iOS mobile, enable smooth body scrolling and address bar hiding
        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalWebkitScrolling = document.body.style.getPropertyValue('-webkit-overflow-scrolling');
        
        // Enable smooth body scrolling
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');
        
        // Trigger initial scroll to hide address bar
        setTimeout(() => {
          if (window.pageYOffset === 0) {
            window.scrollTo(0, 1);
          }
        }, 100);
        
        return () => {
          document.body.style.overflow = originalBodyOverflow;
          document.documentElement.style.overflow = originalHtmlOverflow;
          if (originalWebkitScrolling) {
            document.body.style.setProperty('-webkit-overflow-scrolling', originalWebkitScrolling);
          } else {
            document.body.style.removeProperty('-webkit-overflow-scrolling');
          }
        };
      }
    }, []);

    // Create cart item only when selections change, use stable timestamp
    const cartItem = useMemo(() => {
        if (!selections.nest) return null;
        
        // Calculate the combination-based total price
        const combinationPrice = calculateCombinationPrice(
            selections.nest?.value || '',
            selections.gebaeudehuelle?.value || '',
            selections.innenverkleidung?.value || '',
            selections.fussboden?.value || ''
        );
        
        // Add other prices
        let additionalPrice = 0;
        
        // Add PV price
        if (selections.pvanlage && selections.pvanlage.quantity) {
            additionalPrice += selections.pvanlage.quantity * (selections.pvanlage.price || 0);
        }
        
        // Add window price
        if (selections.fenster && selections.fenster.squareMeters) {
            additionalPrice += selections.fenster.squareMeters * (selections.fenster.price || 0);
        }
        
        // Add planning package price
        if (selections.paket) {
            additionalPrice += selections.paket.price || 0;
        }
        
        // Add Grundstückscheck price if selected
        if (isGrundstuecksCheckSelected) {
            additionalPrice += GRUNDSTUECKSCHECK_PRICE;
        }
        
        const totalCalculatedPrice = combinationPrice + additionalPrice;
        
        const item: CartItem = {
            id: currentCartItemId,
            nest: {
                value: selections.nest.value,
                name: selections.nest.name || '',
                price: combinationPrice,
                description: selections.nest.description ?? ''
            },
            totalPrice: totalCalculatedPrice,
            timestamp: initialTimestamp,
            gebaeudehuelle: selections.gebaeudehuelle ? {
                value: selections.gebaeudehuelle.value,
                name: selections.gebaeudehuelle.name || '',
                price: 0,
                description: selections.gebaeudehuelle.description ?? ''
            } : undefined,
            innenverkleidung: selections.innenverkleidung ? {
                value: selections.innenverkleidung.value,
                name: selections.innenverkleidung.name || '',
                price: 0,
                description: selections.innenverkleidung.description ?? ''
            } : undefined,
            fussboden: selections.fussboden ? {
                value: selections.fussboden.value,
                name: selections.fussboden.name || '',
                price: 0,
                description: selections.fussboden.description ?? ''
            } : undefined,
            pvanlage: selections.pvanlage ? {
                value: selections.pvanlage.value,
                name: selections.pvanlage.name || '',
                price: selections.pvanlage.price || 0,
                description: selections.pvanlage.description ?? '',
                quantity: selections.pvanlage.quantity || 0
            } : undefined,
            paket: selections.paket ? {
                value: selections.paket.value,
                name: selections.paket.name || '',
                price: selections.paket.price || 0,
                description: selections.paket.description ?? ''
            } : undefined,
            fenster: selections.fenster ? {
                value: selections.fenster.value,
                name: selections.fenster.name || '',
                price: selections.fenster.price || 0,
                description: selections.fenster.description ?? '',
                squareMeters: selections.fenster.squareMeters || 0
            } : undefined
        };

        // Add Grundstückscheck if selected
        if (isGrundstuecksCheckSelected) {
            (item as any).grundstueckscheck = {
                name: 'Grundstückscheck',
                price: GRUNDSTUECKSCHECK_PRICE,
                description: 'Prüfung der rechtlichen und baulichen Voraussetzungen deines Grundstücks'
            };
        }

        return item;
    }, [selections, currentCartItemId, initialTimestamp, isGrundstuecksCheckSelected]);

    // Set mounted ref on first render
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Track last cart item to prevent unnecessary updates
    const lastCartItemRef = useRef<CartItem | null>(null);

    // Handle updates only after component is mounted
    useEffect(() => {
        if (!isMounted.current) return;

        // Update selections in context including grundstueckscheck
        const selectionsWithGrundstueck = {
            ...selections,
            grundstueckscheck: isGrundstuecksCheckSelected ? GRUNDSTUECKSCHECK_OPTION : undefined
        };
        updateSelections(selectionsWithGrundstueck);

        // Update cart if we have a valid cart item and it actually changed
        let cartItemToUpdate: CartItem | null = cartItem;
        if (cartItem && isGrundstuecksCheckSelected) {
            cartItemToUpdate = {
                ...cartItem,
                grundstueckscheck: {
                    name: 'Grundstückscheck',
                    price: GRUNDSTUECKSCHECK_PRICE,
                    description: 'Prüfung der rechtlichen und baulichen Voraussetzungen deines Grundstücks'
                }
            } as CartItem;
        }
        if (cartItemToUpdate && JSON.stringify(lastCartItemRef.current) !== JSON.stringify(cartItemToUpdate)) {
            updateCartItem(cartItemToUpdate);
            lastCartItemRef.current = cartItemToUpdate;
        }
    }, [selections, cartItem, updateSelections, updateCartItem, isGrundstuecksCheckSelected]);

    // Dynamic sticky positioning that stops at summary
    useEffect(() => {
        const handleScroll = () => {
            if (!previewRef.current || !summaryRef.current) return;

            // Get the position of the summary box
            const summaryRect = summaryRef.current.getBoundingClientRect();
            const summaryTop = summaryRect.top + window.scrollY;
            const summaryBottom = summaryTop + summaryRect.height;

            // Get the height of the preview container
            const previewHeight = previewRef.current.offsetHeight;

            // Calculate stop point
            const stopPoint = summaryBottom - previewHeight;

            if (window.scrollY > stopPoint) {
                setPreviewStyles({
                    position: 'absolute',
                    top: `${stopPoint}px`
                });
            } else {
                setPreviewStyles({});
            }

            // Handle mobile sticky
            const mobileBreakpoint = 1024; // lg breakpoint
            if (window.innerWidth < mobileBreakpoint) {
                if (window.scrollY > 100) {
                    setIsMobileSticky(true);
                } else {
                    setIsMobileSticky(false);
                }
            }
        };

        // Set initial position
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    // Update selections when a package is selected from the dialog
    useEffect(() => {
        if (configuratorState.selectedPackage) {
            const selectedPackageOption = PLANNING_PACKAGES.find(pkg => pkg.value === configuratorState.selectedPackage);
            if (selectedPackageOption && (!selections.paket || selections.paket.value !== configuratorState.selectedPackage)) {
                handleSelection(selectedPackageOption);
            }
        }
    }, [configuratorState.selectedPackage, handleSelection, selections.paket]);

    // Update max PV modules based on selected nest
    useEffect(() => {
        if (selections.nest) {
            const nestModel = selections.nest.value;
            switch (nestModel) {
                case 'nest80':
                    setMaxPvModules(4);
                    break;
                case 'nest100':
                    setMaxPvModules(5);
                    break;
                case 'nest120':
                    setMaxPvModules(6);
                    break;
                case 'nest140':
                    setMaxPvModules(7);
                    break;
                case 'nest160':
                    setMaxPvModules(8);
                    break;
                default:
                    setMaxPvModules(4);
            }
            // Reset PV quantity if it exceeds the new maximum
            if (pvQuantity > maxPvModules) {
                setPvQuantity(maxPvModules);
            }
        }
        // Include pvQuantity and maxPvModules since they're used in the effect
    }, [selections.nest, pvQuantity, maxPvModules]);

    // Handle PV selection with quantity
    const handlePvSelection = (option: unknown) => {
        // If already selected, deselect it but remember the quantity
        if (selections.pvanlage?.value === (option as SelectionOption).value) {
            // Just deselect
            handleSelection({
                category: 'pvanlage',
                value: '',
                price: 0,
                name: '',
                description: ''
            });
            return;
        }

        const pvSelection = {
            ...(option as SelectionOption),
            quantity: pvQuantity > 0 ? pvQuantity : 1
        };

        if (pvQuantity === 0) {
            setPvQuantity(1);
        }

        handleSelection(pvSelection);
    };

    // Handle PV quantity change
    const handlePvQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 0 && newQuantity <= maxPvModules) {
            setPvQuantity(newQuantity);

            if (selections.pvanlage) {
                if (newQuantity > 0) {
                    // Update the existing selection with new quantity
                    const updatedPvSelection = {
                        ...selections.pvanlage,
                        quantity: newQuantity
                    };
                    handleSelection(updatedPvSelection);
                } else {
                    // When quantity is 0, keep the selection but with 0 quantity
                    const updatedPvSelection = {
                        ...selections.pvanlage,
                        quantity: 0
                    };
                    handleSelection(updatedPvSelection);
                }
            } else if (!selections.pvanlage && newQuantity > 0) {
                // If no PV is selected but quantity is being increased, we need to select the first available PV option
                // This handles the case when going from 0 back to a positive number
                const firstPvOption = PV_OPTIONS[0];
                if (firstPvOption) {
                    const pvSelection: any = {
                        ...firstPvOption,
                        quantity: newQuantity
                    };
                    handleSelection(pvSelection);
                }
            }
        }
    };

    // Handle info links click
    const handleInfoClick = (infoKey: string) => {
        switch (infoKey) {
            case 'beratung':
                openDialog('calendar', 'beratung');
                break;
            case 'energie':
                openDialog('energie');
                break;
            case 'materialien':
                openDialog('materialien');
                break;
            case 'fenster':
                openDialog('fenster');
                break;
            case 'innenverkleidung':
                openDialog('innenverkleidung');
                break;
            case 'system':
                openDialog('system');
                break;
            case 'gemeinsam':
                openDialog('gemeinsam');
                break;
            case 'planungspaket':
                openDialog('planungspaket', '', true);
                break;
            case 'grundcheck':
                openDialog('grundcheck');
                break;
            case 'photovoltaik':
                openDialog('photovoltaik');
                break;
            default:
                console.warn(`No dialog configured for info key: ${infoKey}`);
        }
    };

    // Handle package selection from both dialog and direct selection
    const handlePackageSelection = (option: SelectionOption) => {
        console.log('Direct package selection:', option.value);
        handleSelection(option);
        // Only set selected package for direct selections
        if (!configuratorState.selectedPackage) {
            setSelectedPackage(option.value);
        }
    };

    // Remove the old handleAddToCart function since we're now updating the cart automatically
    const handleAddToCart = () => {
        router.push('/warenkorb');
    };

    // Add a function to handle Trapezblech view transitions safely
    const safelyChangeView = (newViewIndex: number) => {
        // Check if this is a transition to Modul view with Trapezblech
        if (newViewIndex === 2 && selections.gebaeudehuelle?.value === 'trapezblech') {
            console.debug('Safely transitioning to Modul view with Trapezblech exterior');

            // Ensure we have an interior selection
            if (!selections.innenverkleidung) {
                // Add default interior for Trapezblech
                const defaultInteriorOption = INNENVERKLEIDUNG_OPTIONS.find(option => option.value === 'holznatur');
                if (defaultInteriorOption) {
                    console.debug('Adding default holznatur interior for Trapezblech');
                    handleSelection(defaultInteriorOption);
                }
            }

            // Add specific logging for path construction debugging
            const nestValue = selections.nest?.value || 'nest80';
            const interiorValue = selections.innenverkleidung?.value || 'holznatur';
            const floorValue = selections.fussboden?.value || null;

            // Log the potential paths that would be checked when rendering
            console.debug('Trapezblech Modul View Path Debugging:', {
                nestValue,
                interiorValue,
                floorValue,
                // Paths that would be tried in order:
                paths: {
                    fullPath: floorValue ? `trapezblech_${interiorValue}_${floorValue}` : 'N/A',
                    exteriorInterior: `trapezblech_${interiorValue}`,
                    nestSpecific: `${nestValue}_trapezblech_interior`,
                    genericTrapezblech: 'trapezblech_interior'
                }
            });
        }

        // Change the view
        setActiveViewIndex(newViewIndex);
    };

    // Function to render image view
    const renderPreviewImage = () => {
        const getImagePath = () => {
            console.log('🖼️ Rendering preview image:', {
                activeViewIndex,
                selections,
                hasPart2BeenActive
            });

            switch (activeViewIndex) {
                case 1: // Exterior view
                    const exteriorPath = getPreviewImagePath(selections, 1);
                    console.log('🏠 Exterior view path:', exteriorPath);
                    return exteriorPath;
                case 2: // Interior view
                    const interiorPath = getPreviewImagePath(selections, 2);
                    console.log('🎨 Interior view path:', interiorPath);
                    return interiorPath;
                case 3: // PV view
                    return selections.pvanlage 
                        ? IMAGES.configurations.photovoltaik_holz
                        : getPreviewImagePath(selections, 1);
                case 4: // Fenster view
                    if (selections.fenster) {
                        // Map the fenster selection to the appropriate image key
                        const fensterImageKey = selections.fenster.value === 'kunststoffverkleidung' ? 'fensterPvc' :
                                              selections.fenster.value === 'aluminium' ? 'fensterAluminium' :
                                              selections.fenster.value === 'eiche' ? 'fensterEiche' :
                                              'fensterFichte';
                        return IMAGES.configurations[fensterImageKey];
                    }
                    return getPreviewImagePath(selections, 1);
                default:
                    return getPreviewImagePath(selections, 1);
            }
        };

        // Get available views based on selections
        const getAvailableViews = () => {
            const views = [1]; // Always include exterior view
            if (hasPart2BeenActive) views.push(2);
            if (hasPart3BeenActive) {
                if (selections.pvanlage) views.push(3);
                if (selections.fenster) views.push(4);
            }
            console.log('👁️ Available views:', {
                views,
                hasPart2BeenActive,
                hasPart3BeenActive,
                hasPv: !!selections.pvanlage,
                hasFenster: !!selections.fenster
            });
            return views;
        };

        return (
            <div className="flex flex-col w-full h-full">
                <div className="relative w-full flex-1">
                    <ClientBlobImage
                        path={getImagePath()}
                        alt={activeViewIndex === 1 ? "House Preview" : 
                             activeViewIndex === 2 ? "Interior Preview" : 
                             activeViewIndex === 3 ? "PV Preview" : 
                             "Fenster Preview"}
                        width={1920}
                        height={1080}
                        sizes="90vw"
                        style={{
                            maxWidth: '100%',
                            maxHeight: 'calc(100vh - 200px)',
                            width: isClient && isDesktop ? `${desktopImageSize.width}px` : 'auto',
                            height: isClient && isDesktop ? `${desktopImageSize.height - 220}px` : 'auto',
                            objectFit: 'contain'
                        }}
                        className="object-contain"
                        priority
                        disableMobilePath={true}
                    />

                    {/* Navigation Arrows - Updated to use getAvailableViews */}
                    {(hasPart2BeenActive || hasPart3BeenActive) && (
                        <>
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-white shadow-md hover:bg-gray-50 focus:outline-none z-10"
                                onClick={() => {
                                    const availableViews = getAvailableViews();
                                    const currentIndex = availableViews.indexOf(activeViewIndex);
                                    const prevIndex = (currentIndex - 1 + availableViews.length) % availableViews.length;
                                    setActiveViewIndex(availableViews[prevIndex]);
                                }}
                                aria-label="Previous View"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-black"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-white shadow-md hover:bg-gray-50 focus:outline-none z-10"
                                onClick={() => {
                                    const availableViews = getAvailableViews();
                                    const currentIndex = availableViews.indexOf(activeViewIndex);
                                    const nextIndex = (currentIndex + 1) % availableViews.length;
                                    setActiveViewIndex(availableViews[nextIndex]);
                                }}
                                aria-label="Next View"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-black"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    // Calculate image preview height based on screen width and scroll position
    useEffect(() => {
        const calculatePreviewHeight = () => {
            const screenWidth = window.innerWidth;
            const lgBreakpoint = 1024; // lg breakpoint

            if (screenWidth < lgBreakpoint) {
                // Instead of calculating a fixed height, set it to auto to allow natural scaling
                setPreviewHeight('auto');
            } else {
                // On desktop, maintain the existing behavior
                setPreviewHeight('auto');
            }
        };

        calculatePreviewHeight();
        window.addEventListener('resize', calculatePreviewHeight);
        return () => window.removeEventListener('resize', calculatePreviewHeight);
        // Only depends on scrollPosition for triggering recalculation
    }, [scrollPosition]);

    // Get navbar height on mount
    useEffect(() => {
        function updateNavbarHeight() {
            // Find the navbar element - adjust selector to match your actual navbar
            const navbar = document.querySelector('header') || document.querySelector('nav');
            if (navbar) {
                const height = navbar.offsetHeight;
                setNavbarHeight(height);
                // Don't update the CSS variable as it can affect global styles
                // document.documentElement.style.setProperty('--navbar-height', `${height}px`);
            }
        }

        updateNavbarHeight();

        // Use ResizeObserver instead of resize event for better performance
        if (typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(updateNavbarHeight);
            const navbar = document.querySelector('header') || document.querySelector('nav');
            if (navbar) {
                observer.observe(navbar);
            }

            return () => {
                if (navbar) {
                    observer.unobserve(navbar);
                }
                observer.disconnect();
            };
        } else {
            // Fallback to resize event if ResizeObserver is not available
            window.addEventListener('resize', updateNavbarHeight);
            return () => window.removeEventListener('resize', updateNavbarHeight);
        }
    }, []);

    // Track scroll position to control sticky behavior
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Update max fenster area based on selected nest
    useEffect(() => {
        if (selections.nest) {
            const nestModel = selections.nest.value;
            const size = parseInt(nestModel.replace('nest', ''));
            setMaxFensterArea(size);
            // Reset fenster quantity if it exceeds the new maximum
            if (fensterSquareMeters > size) {
                setFensterSquareMeters(size);
                if (selections.fenster) {
                    handleFensterChange(selections.fenster, size);
                }
            }
        }
    }, [selections.nest]);

    // Handle fenster selection with square meters
    const handleFensterSelection = (option: unknown) => {
        // If already selected, deselect it but remember the quantity
        if (selections.fenster?.value === (option as SelectionOption).value) {
            handleSelection({
                category: 'fenster',
                value: '',
                price: 0,
                name: '',
                description: ''
            });
            return;
        }

        const fensterSelection = {
            ...(option as SelectionOption),
            squareMeters: fensterSquareMeters > 0 ? fensterSquareMeters : 1
        };

        if (fensterSquareMeters === 0) {
            setFensterSquareMeters(1);
        }

        handleSelection(fensterSelection);
    };

    // Handle fenster square meters change
    const handleFensterChange = (option: SelectionOption | null, newSquareMeters: number) => {
        if (newSquareMeters >= 0 && newSquareMeters <= maxFensterArea) {
            setFensterSquareMeters(newSquareMeters);

            if (selections.fenster) {
                if (newSquareMeters > 0) {
                    // Update the existing selection with new square meters
                    const updatedFensterSelection = {
                        ...selections.fenster,
                        squareMeters: newSquareMeters
                    };
                    handleSelection(updatedFensterSelection);
                } else {
                    // When square meters is 0, keep the selection but with 0 square meters
                    const updatedFensterSelection = {
                        ...selections.fenster,
                        squareMeters: 0
                    };
                    handleSelection(updatedFensterSelection);
                }
            } else if (!selections.fenster && option && newSquareMeters > 0) {
                // If no fenster is selected but quantity is being increased, we need to use the provided option
                // This handles the case when going from 0 back to a positive number
                const fensterSelection = {
                    ...option,
                    squareMeters: newSquareMeters
                };
                handleSelection(fensterSelection);
            }
        }
    };

    // Helper function to format the display name
    const getDisplayName = (option: SelectionOption, forSummary: boolean = false) => {
        if (option.value === 'kunststoffverkleidung') {
            const name = forSummary ? 'Kunststoff-\nverkleidung' : 'Kunststoffverkleidung';
            return forSummary ? `Fenster: ${name}` : name;
        }
        return forSummary ? `Fenster: ${option.name}` : option.name;
    };

    // Add this new useEffect for desktop image sizing
    useEffect(() => {
        const updateDesktopImageSize = () => {
            if (window.innerWidth >= 1024) { // Only run on desktop
                const rightPanelWidth = 572; // Fixed width of right panel
                const windowWidth = window.innerWidth;
                const availableWidth = windowWidth - rightPanelWidth;
                const aspectRatio = 16 / 9; // Assuming 16:9 aspect ratio for images

                // Calculate height based on available width and aspect ratio
                const calculatedHeight = availableWidth / aspectRatio;

                // Set maximum height to 80% of viewport height
                const maxHeight = window.innerHeight * 0.8;

                // Use the smaller of calculated height or max height
                const finalHeight = Math.min(calculatedHeight, maxHeight);
                const finalWidth = finalHeight * aspectRatio;

                setDesktopImageSize({
                    width: finalWidth,
                    height: finalHeight
                });
            }
        };

        // Initial calculation
        updateDesktopImageSize();

        // Update on resize
        window.addEventListener('resize', updateDesktopImageSize);
        return () => window.removeEventListener('resize', updateDesktopImageSize);
    }, []);

    // Remove the mobile scroll ref since we're using body scroll
    // const mobileScrollRef = useRef<HTMLDivElement>(null);

    // Remove nested scroll event handling since we're using body scroll
    // useEffect(() => {
    //   // This is no longer needed
    // }, [isIOSMobile]);

    // Helper for short paket summary
    function getPaketShortText(paketValue: string) {
        if (paketValue === 'basis') {
            return 'Planungspaket Basis';
        }
        if (paketValue === 'basis_plus') {
            return 'Inkl.\nPlanungspaket Basis\nHKLS-Planung';
        }
        if (paketValue === 'basis_pro') {
            return 'Inkl.\nPlanungspaket Basis\nHKLS-Planung\nInteriorplanung';
        }
        return '';
    }

    // At the end, return the JSX as before
    return (
        <div className="w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] bg-white hide-scrollbar">
            {/* Mobile Preview with Sticky Positioning */}
            <div
                ref={mobileStickyHeaderRef}
                className="lg:hidden fixed bg-white z-30 w-full hide-scrollbar"
                style={{
                    top: `${navbarHeight}px`,
                    boxShadow: scrollPosition > 10 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    transition: 'box-shadow 0.2s ease',
                    height: 'auto'
                }}
            >
                <div className="w-full">
                    {/* Ultra-Simple Image Container - Full Width */}
                    <div className="w-screen relative">
                        <ClientBlobImage
                            path={getPreviewImagePath(selections, activeViewIndex)}
                            alt="Preview Image"
                            width={1920}
                            height={1080}
                            sizes="100vw"
                            className="w-screen h-auto object-cover"
                            style={{
                                maxHeight: 'min(40vh, 300px)',
                                width: '100vw',
                                objectFit: 'cover'
                            }}
                            priority
                            disableMobilePath={true}
                        />
                        {/* Navigation Arrows - Added inside the image container */}
                        {(hasPart2BeenActive || hasPart3BeenActive) && (
                            <>
                                <button
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-white shadow-md hover:bg-gray-50 focus:outline-none z-10"
                                    onClick={() => {
                                        const availableViews = [1];
                                        if (hasPart2BeenActive) availableViews.push(2);
                                        if (hasPart3BeenActive) availableViews.push(3);
                                        const currentIndex = availableViews.indexOf(activeViewIndex);
                                        const prevIndex = (currentIndex - 1 + availableViews.length) % availableViews.length;
                                        safelyChangeView(availableViews[prevIndex]);
                                    }}
                                    aria-label="Previous View"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-black"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-white shadow-md hover:bg-gray-50 focus:outline-none z-10"
                                    onClick={() => {
                                        const availableViews = [1];
                                        if (hasPart2BeenActive) availableViews.push(2);
                                        if (hasPart3BeenActive) availableViews.push(3);
                                        const currentIndex = availableViews.indexOf(activeViewIndex);
                                        const nextIndex = (currentIndex + 1) % availableViews.length;
                                        safelyChangeView(availableViews[nextIndex]);
                                    }}
                                    aria-label="Next View"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-black"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                    {/* Title - now below the image, still inside sticky container */}
                    <div className="w-full bg-white px-4 flex items-center justify-between">
                        <h1 className="text-black text-2xl font-medium leading-tight">Dein Nest-Haus</h1>
                    </div>
                </div>
            </div>

            {/* Desktop Layout Container */}
            <div className="hidden lg:block w-full relative hide-scrollbar" style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}>
                <div className="flex hide-scrollbar" style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}>
                    {/* Left Preview Panel - Fixed */}
                    <div className="relative w-[calc(100%-572px)] h-[calc(100%-130px)] bg-white relative hide-scrollbar">
                        {/* Title - Now above the image */}
                        <div className="absolute top-0 left-0 right-0 p-2 z-20 lg:block hidden">
                            <h1 className="text-black text-2xl font-medium pl-4 pt-4">Dein Nest-Haus</h1>
                        </div>
                        <div className="flex items-start justify-center w-full h-full">
                            <div className="relative w-full h-full flex flex-col items-center justify-center mt-[7vh]">
                                <ClientBlobImage
                                    path={getPreviewImagePath(selections, activeViewIndex)}
                                    alt={activeViewIndex === 1 ? "House Preview" : activeViewIndex === 2 ? "Interior Preview" : "Front View"}
                                    width={1920}
                                    height={1080}
                                    sizes="95vw"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '80%',
                                        width: isClient && isDesktop ? `${desktopImageSize.width}px` : 'auto',
                                        height: isClient && isDesktop ? `${desktopImageSize.height}px` : 'auto',
                                        objectFit: 'contain'
                                    }}
                                    className="object-contain"
                                    priority
                                    disableMobilePath={true}
                                />

                                {/* Navigation Arrows - Repositioned for desktop view */}
                                {(hasPart2BeenActive || hasPart3BeenActive) && (
                                    <>
                                        <button
                                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-white shadow-md hover:bg-gray-50 focus:outline-none z-10"
                                            onClick={() => {
                                                const availableViews = [1];
                                                if (hasPart2BeenActive) availableViews.push(2);
                                                if (hasPart3BeenActive) availableViews.push(3);
                                                const currentIndex = availableViews.indexOf(activeViewIndex);
                                                const prevIndex = (currentIndex - 1 + availableViews.length) % availableViews.length;
                                                setActiveViewIndex(availableViews[prevIndex]);
                                            }}
                                            aria-label="Previous View"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-black"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <button
                                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-white shadow-md hover:bg-gray-50 focus:outline-none z-10"
                                            onClick={() => {
                                                const availableViews = [1];
                                                if (hasPart2BeenActive) availableViews.push(2);
                                                if (hasPart3BeenActive) availableViews.push(3);
                                                const currentIndex = availableViews.indexOf(activeViewIndex);
                                                const nextIndex = (currentIndex + 1) % availableViews.length;
                                                setActiveViewIndex(availableViews[nextIndex]);
                                            }}
                                            aria-label="Next View"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-black"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Selection Panel - Sticky with Scroll */}
                    <div 
                        ref={rightPanelRef}
                        onScroll={handleRightPanelScroll}
                        className={
                            `w-[572px] bg-white right-panel hide-scrollbar` +
                            (isDesktop ? ' sticky top-0 self-start' : '')
                        }
                        style={
                            isDesktop ? { maxHeight: `calc(100vh - ${navbarHeight * 3}px)` } :
                            isIOSMobile ? { overflow: 'visible', maxHeight: 'none' } as React.CSSProperties : {}
                        }
                    >
                        <div
                            className={
                                'h-full' +
                                (isDesktop ? ' overflow-y-auto hide-scrollbar' : '')
                            }
                            style={
                                isDesktop ? { maxHeight: `calc(100vh - ${navbarHeight * 3}px)` } :
                                isIOSMobile ? { overflow: 'visible', maxHeight: 'none' } as React.CSSProperties : {}
                            }
                        >
                            <div className="p-8 space-y-6">
                                {/* Die Module Section */}
                                <div className="box_catagory rounded-lg">
                                    <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                                        <span className="text-black">Nest</span> <span className="text-[#999999]">Wie groß</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {NEST_OPTIONS.map((option) => {
                                            // Calculate base price for each nest option with default selections
                                            const basePrice = calculateCombinationPrice(
                                                option.value,
                                                'trapezblech', // default
                                                'kiefer',      // default
                                                'parkett'      // default
                                            );
                                            const optionWithPrice = { ...option, price: basePrice };
                                            
                                            return (
                                                <SelectionBox
                                                    key={option.value}
                                                    option={optionWithPrice}
                                                    isSelected={selections.nest?.value === option.value}
                                                    onClick={handleSelection}
                                                    currentSelections={selections}
                                                />
                                            );
                                        })}
                                    </div>
                                    <InfoBox
                                        title="Noch Fragen offen?"
                                        description="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch."
                                        onClick={() => handleInfoClick('beratung')}
                                    />
                                    <FactsBox title="Energieausweis A++">
                                        <p>Heizungsart: Beliebig</p>
                                        <p>Heizwärmebedarf: ≤60kWh/m²a</p>
                                        <p>CO₂-Emissionen: 15kg CO2/m²</p>
                                        <p>CO₂-Bindung: ca. 1.000kg/m²</p>
                                        <p>U-Wert: 0,15W/m²K</p>
                                        <p>Gesamteffizienzklasse: A++</p>
                                        <p>Berechnungsnormen: OIB RL 1-6</p>
                                    </FactsBox>
                                </div>

                                {/* Gebäudehülle Section */}
                                <div className="box_catagory rounded-lg">
                                    <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                                        <span className="text-black">Gebäudehülle</span> <span className="text-[#999999]">Kleide dich ein</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {GEBEUDE_OPTIONS.map((option) => (
                                            <SelectionBox
                                                key={option.value}
                                                option={option}
                                                isSelected={selections.gebaeudehuelle?.value === option.value}
                                                onClick={handleSelection}
                                                currentSelections={selections}
                                            />
                                        ))}
                                    </div>

                                    <div className="mt-6"></div>

                                    <InfoBox
                                        title="Mehr Informationen zu den Materialien"
                                        onClick={() => handleInfoClick('materialien')}
                                        className="h-12"
                                    />

                                    <div className="mt-6"></div>
                                </div>

                                {/* PV-Anlage Section */}
                                <div className="box_catagory rounded-lg">
                                    <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                                        <span className="text-black">PV-Anlage</span> <span className="text-[#999999]">Kleide dich ein</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {PV_OPTIONS.map((option) => (
                                            <SelectionBox
                                                key={option.value}
                                                option={option}
                                                isSelected={selections.pvanlage?.value === option.value}
                                                onClick={(option) => handlePvSelection(option)}
                                            />
                                        ))}

                                        {selections.pvanlage && (
                                            <div className="mt-4 px-6">
                                                <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mb-2">Anzahl der PV-Module (max. {maxPvModules})</p>
                                                <div className="flex items-center">
                                                    <button
                                                        className="bg-gray-200 hover:bg-gray-300 rounded-l w-8 h-8 flex items-center justify-center transition-colors"
                                                        onClick={() => handlePvQuantityChange(Math.max(0, pvQuantity - 1))}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="bg-gray-100 px-4 py-1 w-12 text-center">
                                                        {pvQuantity}
                                                    </span>
                                                    <button
                                                        className="bg-gray-200 hover:bg-gray-300 rounded-r w-8 h-8 flex items-center justify-center transition-colors"
                                                        onClick={() => handlePvQuantityChange(Math.min(maxPvModules, pvQuantity + 1))}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                    <div className="ml-4 font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600">
                                                        Gesamt: {formatPrice(pvQuantity * (selections.pvanlage.price || 0))}<br />
                                                        oder {calculateMonthlyPayment(pvQuantity * (selections.pvanlage.price || 0))}<br />
                                                        für 240 Mo.
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <InfoBox
                                        title="Mehr Informationen zu Photovoltaik"
                                        onClick={() => handleInfoClick('photovoltaik')}
                                        className="h-12"
                                    />

                                    <div className="mt-6"></div>
                                </div>

                                {/* Innenverkleidung Section */}
                                <div className="box_catagory rounded-lg">
                                    <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                                        <span className="text-black">Innenverkleidung</span> <span className="text-[#999999]">Der Charakter</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {INNENVERKLEIDUNG_OPTIONS.map((option) => (
                                            <SelectionBox
                                                key={option.value}
                                                option={option}
                                                isSelected={selections.innenverkleidung?.value === option.value}
                                                onClick={handleSelection}
                                                currentSelections={selections}
                                            />
                                        ))}
                                    </div>

                                    <InfoBox
                                        title="Mehr Informationen zur Innenverkleidung"
                                        onClick={() => handleInfoClick('innenverkleidung')}
                                        className="h-12"
                                    />

                                    <div className="mt-6"></div>
                                </div>

                                {/* Der Fußboden Section - Add the missing section */}
                                <div className="box_catagory rounded-lg">
                                    <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                                        <span className="text-black">Der Fußboden</span> <span className="text-[#999999]">Oberflächen</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {FUSSBODEN_OPTIONS.map((option) => (
                                            <SelectionBox
                                                key={option.value}
                                                option={option}
                                                isSelected={selections.fussboden?.value === option.value}
                                                onClick={() => handleSelection(option)}
                                                currentSelections={selections}
                                            />
                                        ))}
                                    </div>

                                    <FactsBox title="Ein Patentiertes System">
                                        <p>Die Technologie, die dein Nest transportabel macht, wird mittels unseres patentierten Systems sichergestellt. Unsere technischen Innovationen sind einzigartig am Markt und wurden in Kooperation mit der "Technical University of Graz" entwickelt.</p>
                                        <p>Erprobt im Labor für Bauphysik und getestet unter realen Bedingungen in Österreich. Dein Nest.</p>
                                        <div className="h-4"></div>
                                        <p>
                                            <Link
                                                href="/system"
                                                className="text-[#3D6DE1] font-medium text-[12px] tracking-[0.03em] leading-[14px] underline"
                                            >
                                                Mehr Informationen
                                            </Link>
                                        </p>
                                    </FactsBox>
                                    
                                    <div className="mt-6"></div>
                                </div>

                                {/* Fenster & Türen Section */}
                                <div className="box_catagory rounded-lg mt-12">
                                    <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                                        <span className="text-black">Fenster & Türen</span> <span className="text-[#999999]">Deine Öffnungen</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {FENSTER_OPTIONS.map((option) => (
                                            <SelectionBox
                                                key={option.value}
                                                option={option}
                                                isSelected={selections.fenster?.value === option.value}
                                                onClick={() => handleFensterSelection(option)}
                                            />
                                        ))}
                                        {selections.fenster && (
                                            <div className="mt-4 px-6">
                                                <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mb-2">Anzahl der Fenster / Türen in m²</p>
                                                <div className="flex items-center">
                                                    <button
                                                        className="bg-gray-200 hover:bg-gray-300 rounded-l w-8 h-8 flex items-center justify-center transition-colors"
                                                        onClick={() => handleFensterChange(selections.fenster, Math.max(0, fensterSquareMeters - 1))}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="bg-gray-100 px-4 py-1 w-12 text-center">
                                                        {fensterSquareMeters}
                                                    </span>
                                                    <button
                                                        className="bg-gray-200 hover:bg-gray-300 rounded-r w-8 h-8 flex items-center justify-center transition-colors"
                                                        onClick={() => handleFensterChange(selections.fenster, Math.min(maxFensterArea, fensterSquareMeters + 1))}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                    <div className="ml-4 font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600">
                                                        Gesamt: {formatPrice(fensterSquareMeters * (selections.fenster.price || 0))}<br />
                                                        oder {calculateMonthlyPayment(fensterSquareMeters * (selections.fenster.price || 0))}<br />
                                                        für 240 Mo.
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <InfoBox
                                            title="Mehr Informationen zu Fenstern"
                                            onClick={() => handleInfoClick('fenster')}
                                            className="h-12"
                                        />
                                        <FactsBox title="Fenster & Türen">
                                            <p>Du bestimmst Individuell wo du deine Öffnungen für Fenster & Türen benötigst.</p>
                                            <p>Nach Reservierung setzen wir uns mit dir in Verbindung und definieren die Positionen deiner Fenster & Türen.</p>
                                            <p>Die Fensteroptionen im Konfigurator beziehen sich auf klassische Dreh-Kipp-Flügel und Türen. Sonderlösungen wie Hebeschiebetüren sind nicht im Preis enthalten und können bei Bedarf individuell kalkuliert werden.</p>
                                            <p>Die angegebenen Quadratmeterpreise beziehen sich auf das lichte Einbaumaß der Fensteröffnungen.</p>
                                            <div className="h-4"></div>
                                            <p>
                                                <Link
                                                    href="/fenster-info"
                                                    className="text-[#3D6DE1] font-medium text-[12px] tracking-[0.03em] leading-[14px] underline"
                                                >
                                                    Mehr Informationen
                                                </Link>
                                            </p>
                                        </FactsBox>
                                        <div className="mt-6"></div>
                                    </div>
                                </div>

                                {/* Die Pakete Section */}
                                <div className="box_catagory rounded-lg mt-12">
                                    <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                                        <span className="text-black">Die Pakete</span> <span className="text-[#999999]">Dein Service</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {PLANNING_PACKAGES.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`box_selection_service flex justify-between border border-gray-300 rounded-[19px] px-6 py-4 cursor-pointer transition-colors ${selections.paket?.value === option.value
                                                    ? "selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1]"
                                                    : "hover:border-[#3D6DE1]"
                                                    }`}
                                                onClick={() => handlePackageSelection(option)}
                                            >
                                                <div className="flex justify-between w-full">
                                                    <div className="box_selection_name max-w-[66%]">
                                                        <p className="font-medium text-[16px] tracking-[0.02em] leading-tight mb-2">
                                                            {option.name}
                                                        </p>
                                                        <div className="flex">
                                                            <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 whitespace-pre-line">
                                                                {option.description?.split('\n\n').map((paragraph, i) => (
                                                                    <React.Fragment key={i}>
                                                                        {i === 0 ? (
                                                                            paragraph.split('\n').map((line, lineIndex) => (
                                                                                <div key={`line-${lineIndex}`}>{line}</div>
                                                                            ))
                                                                        ) : (
                                                                            <div>{paragraph}</div>
                                                                        )}
                                                                        {i === 0 && <div className="h-6"></div>}
                                                                        {i < (option.description?.split('\n\n').length || 0) - 1 && i !== 0 && <div className="h-3"></div>}
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="box_selection_price whitespace-nowrap flex-shrink-0 mt-8 pl-4">
                                                        {option.included ? (
                                                            <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px]">
                                                                <span>inklusive.</span>
                                                            </p>
                                                        ) : (
                                                            <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px]">
                                                                <span>
                                                                    Ab {formatPrice(option.price || 0)} <br />
                                                                    oder {calculateMonthlyPayment(option.price || 0)} <br />
                                                                    für 240 Mo.
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <InfoBox
                                        title="Welches Planungspaket passt zu dir?"
                                        description="Sehe dir die Pakete im Detail an und entdecke, welches am besten zu dir passt."
                                        onClick={() => handleInfoClick('planungspaket')}
                                    />

                                    <div className="mt-6"></div>

                                    <FactsBox title="Gemeinsam großes Schaffen">
                                        <p>Wir konzentrieren uns darauf, alle standardisierten Arbeitsprozesse zu optimieren und höchste Qualität zu fairen Preisen sicherzustellen.</p>
                                        <p>Darauf aufbauend machst du dein Nest individuell.</p>
                                        <div className="h-4"></div>
                                        <p>
                                            <Link
                                                href="/gemeinsam"
                                                className="text-[#3D6DE1] font-medium text-[12px] tracking-[0.03em] leading-[14px] underline"
                                            >
                                                Mehr Informationen
                                            </Link>
                                        </p>
                                    </FactsBox>
                                </div>

                                {/* Grundstücks-Check Section */}
                                <div className="box_catagory rounded-lg mt-12">
                                    <GrundstuecksCheckBox 
                                        isSelected={isGrundstuecksCheckSelected} 
                                        onClick={() => setIsGrundstuecksCheckSelected((v) => !v)} 
                                    />
                                    <InfoBox
                                        title="Mehr Informationen zum Grundstücks-Check"
                                        onClick={() => handleInfoClick('grundcheck')}
                                        className="h-12"
                                    />
                                    <div className="mt-12"></div>
                                    <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                                        <span className="text-black">Dein Nest.</span> <span className="text-[#999999]">Überblick</span>
                                    </h3>
                                    <div className="border border-gray-300 rounded-[19px] px-6 py-4" id="summary-box" ref={summaryRef}>
                                        <div id="summary-list" className="space-y-4">
                                            {/* Show base configuration price as one item if all are selected */}
                                            {selections.nest && selections.gebaeudehuelle && selections.innenverkleidung && selections.fussboden && (
                                                <div className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                                                    <div>
                                                        <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px] whitespace-pre-line">
                                                            {selections.nest.name} Basiskonfiguration
                                                        </div>
                                                        <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1 max-w-[66%]">
                                                            {selections.gebaeudehuelle.name}, {selections.innenverkleidung.name}, {selections.fussboden.name}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="mb-1 text-black">Startpreis</div>
                                                        {formatPrice(selections.nest.price || 0)}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Show other selections */}
                                            {Object.entries(selections).map(([key, selection]) => {
                                                if (!selection || key === 'nest' || key === 'gebaeudehuelle' || key === 'innenverkleidung' || key === 'fussboden') return null;
                                                
                                                // Special handling for paket
                                                if (key === 'paket') {
                                                    return (
                                                        <div key={key} className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                                                            <div>
                                                                <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px] whitespace-pre-line">
                                                                    {selection.name}
                                                                </div>
                                                                <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1 max-w-full whitespace-pre-line">
                                                                    {getPaketShortText(selection.value)}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="mb-1 text-black">Aufpreis</div>
                                                                {formatPrice(selection.price || 0)}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div key={key} className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                                                        <div>
                                                            <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px] whitespace-pre-line">
                                                                {key === 'fenster' ? getDisplayName(selection, true) : selection.name}
                                                                {key === 'pvanlage' && selection.quantity && selection.quantity > 1 && ` (${selection.quantity}x)`}
                                                            </div>
                                                            {selection.description && (
                                                                <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1 max-w-[66%]">
                                                                    {selection.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="mb-1 text-black">Aufpreis</div>
                                                            {key === 'pvanlage' 
                                                                ? formatPrice((selection.quantity || 1) * selection.price)
                                                                : key === 'fenster'
                                                                    ? formatPrice((selection.squareMeters || 1) * selection.price)
                                                                    : formatPrice(selection.price || 0)
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Show Grundstückscheck if selected */}
                                            {isGrundstuecksCheckSelected && (
                                                <div className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                                                    <div>
                                                        <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px] whitespace-pre-line">
                                                            Grundstückscheck
                                                        </div>
                                                        <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1 max-w-[66%]">
                                                            Prüfung der rechtlichen und baulichen Voraussetzungen deines Grundstücks
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="mb-1 text-black">Aufpreis</div>
                                                        {formatPrice(GRUNDSTUECKSCHECK_PRICE)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div id="total-price-wrapper" className="mt-6 text-right">
                                            <h3 className="text-xl font-medium tracking-[-0.015em]">
                                                <span className="text-black">Gesamtpreis:</span> <span id="total-price-summary" className="font-medium">{formatPrice(totalPrice)}</span>
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-2">
                                                oder {calculateMonthlyPayment(totalPrice)} monatlich für 240 Monate
                                            </p>
                                        </div>
                                    </div>

                                    {/* Add Noch Fragen offen? section for desktop */}
                                    <div className="mt-6">
                                        <InfoBox
                                            title="Noch Fragen offen?"
                                            description="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch."
                                            onClick={() => handleInfoClick('beratung')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Content */}
            <div className="lg:hidden w-full hide-scrollbar">
                {/* Mobile Selection Panels - Let body handle scrolling on iOS */}
                <div 
                    className={`space-y-6 ${isIOSMobile ? 'pb-32 pl-2 pr-4' : 'pb-20 pl-10 sm:pl-8 pr-0 max-w-[1600px] mx-auto'}`}
                    style={{
                        marginTop: `${mobileStickyHeaderHeight || 220}px`,
                        ...(isIOSMobile && {
                            width: '125vw',
                            transform: 'translateX(5vw)',
                            marginLeft: '0',
                            marginRight: '0'
                        })
                    }}
                >
                    {/* Die Module Section - Mobile */}
                    <div className="box_catagory rounded-lg">
                        <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                            <span className="text-black">Nest</span> <span className="text-[#999999]">Wie groß</span>
                        </h3>
                        <div className="space-y-2">
                            {NEST_OPTIONS.map((option) => {
                                // Calculate base price for each nest option with default selections
                                const basePrice = calculateCombinationPrice(
                                    option.value,
                                    'trapezblech', // default
                                    'kiefer',      // default
                                    'parkett'      // default
                                );
                                const optionWithPrice = { ...option, price: basePrice };
                                
                                return (
                                    <SelectionBox
                                        key={option.value}
                                        option={optionWithPrice}
                                        isSelected={selections.nest?.value === option.value}
                                        onClick={handleSelection}
                                        currentSelections={selections}
                                    />
                                );
                            })}
                        </div>
                        <InfoBox
                            title="Noch Fragen offen?"
                            description="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch."
                            onClick={() => handleInfoClick('beratung')}
                        />
                        <FactsBox title="Energieausweis A++">
                            <p>Heizungsart: Beliebig</p>
                            <p>Heizwärmebedarf: ≤60kWh/m²a</p>
                            <p>CO₂-Emissionen: 15kg CO2/m²</p>
                            <p>CO₂-Bindung: ca. 1.000kg/m²</p>
                            <p>U-Wert: 0,15W/m²K</p>
                            <p>Gesamteffizienzklasse: A++</p>
                            <p>Berechnungsnormen: OIB RL 1-6</p>
                        </FactsBox>
                    </div>

                    {/* Gebäudehülle Section */}
                    <div className="box_catagory rounded-lg">
                        <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                            <span className="text-black">Gebäudehülle</span> <span className="text-[#999999]">Kleide dich ein</span>
                        </h3>
                        <div className="space-y-2">
                            {GEBEUDE_OPTIONS.map((option) => (
                                <SelectionBox
                                    key={option.value}
                                    option={option}
                                    isSelected={selections.gebaeudehuelle?.value === option.value}
                                    onClick={handleSelection}
                                    currentSelections={selections}
                                />
                            ))}
                        </div>

                        <div className="mt-6"></div>

                        <InfoBox
                            title="Mehr Informationen zu den Materialien"
                            onClick={() => handleInfoClick('materialien')}
                            className="h-12"
                        />

                        <div className="mt-6"></div>
                    </div>

                    {/* PV-Anlage Section */}
                    <div className="box_catagory rounded-lg">
                        <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                            <span className="text-black">PV-Anlage</span> <span className="text-[#999999]">Kleide dich ein</span>
                        </h3>
                        <div className="space-y-2">
                            {PV_OPTIONS.map((option) => (
                                <SelectionBox
                                    key={option.value}
                                    option={option}
                                    isSelected={selections.pvanlage?.value === option.value}
                                    onClick={(option) => handlePvSelection(option)}
                                />
                            ))}

                            {selections.pvanlage && (
                                <div className="mt-4 px-6">
                                    <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mb-2">Anzahl der PV-Module (max. {maxPvModules})</p>
                                    <div className="flex items-center">
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 rounded-l w-8 h-8 flex items-center justify-center transition-colors"
                                            onClick={() => handlePvQuantityChange(Math.max(0, pvQuantity - 1))}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="bg-gray-100 px-4 py-1 w-12 text-center">
                                            {pvQuantity}
                                        </span>
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 rounded-r w-8 h-8 flex items-center justify-center transition-colors"
                                            onClick={() => handlePvQuantityChange(Math.min(maxPvModules, pvQuantity + 1))}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <div className="ml-4 font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600">
                                            Gesamt: {formatPrice(pvQuantity * (selections.pvanlage.price || 0))}<br />
                                            oder {calculateMonthlyPayment(pvQuantity * (selections.pvanlage.price || 0))}<br />
                                            für 240 Mo.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <InfoBox
                            title="Mehr Informationen zu Photovoltaik"
                            onClick={() => handleInfoClick('photovoltaik')}
                            className="h-12"
                        />

                        <div className="mt-6"></div>
                    </div>

                    {/* Innenverkleidung Section */}
                    <div className="box_catagory rounded-lg mt-12">
                        <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                            <span className="text-black">Innenverkleidung</span> <span className="text-[#999999]">Der Charakter</span>
                        </h3>
                        <div className="space-y-2">
                            {INNENVERKLEIDUNG_OPTIONS.map((option) => (
                                <SelectionBox
                                    key={option.value}
                                    option={option}
                                    isSelected={selections.innenverkleidung?.value === option.value}
                                    onClick={handleSelection}
                                    currentSelections={selections}
                                />
                            ))}
                        </div>

                        <InfoBox
                            title="Mehr Informationen zur Innenverkleidung"
                            onClick={() => handleInfoClick('innenverkleidung')}
                            className="h-12"
                        />

                        <div className="mt-6"></div>
                    </div>

                    {/* Der Fußboden Section - Add the missing section */}
                    <div className="box_catagory rounded-lg mt-12">
                        <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                            <span className="text-black">Der Fußboden</span> <span className="text-[#999999]">Oberflächen</span>
                        </h3>
                        <div className="space-y-2">
                            {FUSSBODEN_OPTIONS.map((option) => (
                                <SelectionBox
                                    key={option.value}
                                    option={option}
                                    isSelected={selections.fussboden?.value === option.value}
                                    onClick={() => handleSelection(option)}
                                    currentSelections={selections}
                                />
                            ))}
                        </div>

                        <FactsBox title="Ein Patentiertes System">
                            <p>Die Technologie, die dein Nest transportabel macht, wird mittels unseres patentierten Systems sichergestellt. Unsere technischen Innovationen sind einzigartig am Markt und wurden in Kooperation mit der "Technical University of Graz" entwickelt.</p>
                            <p>Erprobt im Labor für Bauphysik und getestet unter realen Bedingungen in Österreich. Dein Nest.</p>
                            <div className="h-4"></div>
                            <p>
                                <Link
                                    href="/system"
                                    className="text-[#3D6DE1] font-medium text-[12px] tracking-[0.03em] leading-[14px] underline"
                                >
                                    Mehr Informationen
                                </Link>
                            </p>
                        </FactsBox>
                        
                        <div className="mt-6"></div>
                    </div>

                    {/* Fenster & Türen Section */}
                    <div className="box_catagory rounded-lg mt-12">
                        <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                            <span className="text-black">Fenster & Türen</span> <span className="text-[#999999]">Deine Öffnungen</span>
                        </h3>
                        <div className="space-y-2">
                            {FENSTER_OPTIONS.map((option) => (
                                <SelectionBox
                                    key={option.value}
                                    option={option}
                                    isSelected={selections.fenster?.value === option.value}
                                    onClick={() => handleFensterSelection(option)}
                                />
                            ))}
                            {selections.fenster && (
                                <div className="mt-4 px-6">
                                    <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mb-2">Anzahl der Fenster / Türen in m²</p>
                                    <div className="flex items-center">
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 rounded-l w-8 h-8 flex items-center justify-center transition-colors"
                                            onClick={() => handleFensterChange(selections.fenster, Math.max(0, fensterSquareMeters - 1))}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="bg-gray-100 px-4 py-1 w-12 text-center">
                                            {fensterSquareMeters}
                                        </span>
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 rounded-r w-8 h-8 flex items-center justify-center transition-colors"
                                            onClick={() => handleFensterChange(selections.fenster, Math.min(maxFensterArea, fensterSquareMeters + 1))}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                        <div className="ml-4 font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600">
                                            Gesamt: {formatPrice(fensterSquareMeters * (selections.fenster.price || 0))}<br />
                                            oder {calculateMonthlyPayment(fensterSquareMeters * (selections.fenster.price || 0))}<br />
                                            für 240 Mo.
                                        </div>
                                    </div>
                                </div>
                            )}
                            <InfoBox
                                title="Mehr Informationen zu Fenstern"
                                onClick={() => handleInfoClick('fenster')}
                                className="h-12"
                            />
                            <FactsBox title="Fenster & Türen">
                                <p>Du bestimmst Individuell wo du deine Öffnungen für Fenster & Türen benötigst.</p>
                                <p>Nach Reservierung setzen wir uns mit dir in Verbindung und definieren die Positionen deiner Fenster & Türen.</p>
                                <p>Die Fensteroptionen im Konfigurator beziehen sich auf klassische Dreh-Kipp-Flügel und Türen. Sonderlösungen wie Hebeschiebetüren sind nicht im Preis enthalten und können bei Bedarf individuell kalkuliert werden.</p>
                                <p>Die angegebenen Quadratmeterpreise beziehen sich auf das lichte Einbaumaß der Fensteröffnungen.</p>
                                <div className="h-4"></div>
                                <p>
                                    <Link
                                        href="/fenster-info"
                                        className="text-[#3D6DE1] font-medium text-[12px] tracking-[0.03em] leading-[14px] underline"
                                    >
                                        Mehr Informationen
                                    </Link>
                                </p>
                            </FactsBox>
                            <div className="mt-6"></div>
                        </div>
                    </div>

                    {/* Die Pakete Section */}
                    <div className="box_catagory rounded-lg mt-12">
                        <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                            <span className="text-black">Die Pakete</span> <span className="text-[#999999]">Dein Service</span>
                        </h3>
                        <div className="space-y-2">
                            {PLANNING_PACKAGES.map((option) => (
                                <div
                                    key={option.value}
                                    className={`box_selection_service flex justify-between border border-gray-300 rounded-[19px] px-6 py-4 cursor-pointer transition-colors ${selections.paket?.value === option.value
                                        ? "selected border-[#3D6DE1] shadow-[0_0_0_1px_#3D6DE1]"
                                        : "hover:border-[#3D6DE1]"
                                        }`}
                                    onClick={() => handlePackageSelection(option)}
                                >
                                    <div className="flex justify-between w-full">
                                        <div className="box_selection_name max-w-[66%]">
                                            <p className="font-medium text-[16px] tracking-[0.02em] leading-tight mb-2">
                                                {option.name}
                                            </p>
                                            <div className="flex">
                                                <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 whitespace-pre-line">
                                                    {option.description?.split('\n\n').map((paragraph, i) => (
                                                        <React.Fragment key={i}>
                                                            {i === 0 ? (
                                                                paragraph.split('\n').map((line, lineIndex) => (
                                                                    <div key={`line-${lineIndex}`}>{line}</div>
                                                                ))
                                                            ) : (
                                                                <div>{paragraph}</div>
                                                            )}
                                                            {i === 0 && <div className="h-6"></div>}
                                                            {i < (option.description?.split('\n\n').length || 0) - 1 && i !== 0 && <div className="h-3"></div>}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box_selection_price whitespace-nowrap flex-shrink-0 mt-8 pl-4">
                                            {option.included ? (
                                                <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px]">
                                                    <span>inklusive.</span>
                                                </p>
                                            ) : (
                                                <p className="font-normal text-[12px] tracking-[0.03em] leading-[14px]">
                                                    <span>
                                                        Ab {formatPrice(option.price || 0)} <br />
                                                        oder {calculateMonthlyPayment(option.price || 0)} <br />
                                                        für 240 Mo.
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <InfoBox
                            title="Welches Planungspaket passt zu dir?"
                            description="Sehe dir die Pakete im Detail an und entdecke, welches am besten zu dir passt."
                            onClick={() => handleInfoClick('planungspaket')}
                        />

                        <div className="mt-6"></div>

                        <FactsBox title="Gemeinsam großes Schaffen">
                            <p>Wir konzentrieren uns darauf, alle standardisierten Arbeitsprozesse zu optimieren und höchste Qualität zu fairen Preisen sicherzustellen.</p>
                            <p>Darauf aufbauend machst du dein Nest individuell.</p>
                            <div className="h-4"></div>
                            <p>
                                <Link
                                    href="/gemeinsam"
                                    className="text-[#3D6DE1] font-medium text-[12px] tracking-[0.03em] leading-[14px] underline"
                                >
                                    Mehr Informationen
                                </Link>
                            </p>
                        </FactsBox>
                    </div>

                    {/* Grundstücks-Check Section */}
                    <div className="box_catagory rounded-lg mt-12">
                        <GrundstuecksCheckBox 
                            isSelected={isGrundstuecksCheckSelected} 
                            onClick={() => setIsGrundstuecksCheckSelected((v) => !v)} 
                        />
                        <InfoBox
                            title="Mehr Informationen zum Grundstücks-Check"
                            onClick={() => handleInfoClick('grundcheck')}
                            className="h-12"
                        />
                        <div className="mt-12"></div>
                        <h3 className="text-xl font-medium tracking-[-0.015em] leading-[1.2] mb-4">
                            <span className="text-black">Dein Nest.</span> <span className="text-[#999999]">Überblick</span>
                        </h3>
                        <div className="border border-gray-300 rounded-[19px] px-6 py-4" id="summary-box" ref={summaryRef}>
                            <div id="summary-list" className="space-y-4">
                                {Object.entries(selections).map(([key, selection], index) => (
                                    selection && (
                                        <div key={key} className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                                            <div>
                                                <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px] whitespace-pre-line">
                                                    {key === 'fenster' ? getDisplayName(selection, true) : selection.name}
                                                    {key === 'pvanlage' && selection.quantity && selection.quantity > 1 && ` (${selection.quantity}x)`}
                                                </div>
                                                {selection.description && (
                                                    <div className={`font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1 ${key === 'paket' ? 'max-w-full' : 'max-w-[66%]'}`}>
                                                        {key === 'paket' ? (
                                                            <>
                                                                {selection.description.split('\n\n').map((paragraph, i) => (
                                                                    <React.Fragment key={i}>
                                                                        {i === 0 ? (
                                                                            paragraph.split('\n').map((line, lineIndex) => (
                                                                                <div key={`line-${lineIndex}`}>{line}</div>
                                                                            ))
                                                                        ) : (
                                                                            <div>{paragraph}</div>
                                                                        )}
                                                                        {i === 0 && <div className="h-6"></div>}
                                                                        {i < selection.description.split('\n\n').length - 1 && i !== 0 && <div className="h-3"></div>}
                                                                    </React.Fragment>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            selection.description
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right font-normal text-[12px] tracking-[0.03em] leading-[14px] min-w-[130px]">
                                                {index === 0 && (
                                                    <div className="mb-1 text-black">Startpreis</div>
                                                )}
                                                {index !== 0 && selection.price > 0 && (
                                                    <div className="mb-1 text-black">Aufpreis</div>
                                                )}
                                                {key === 'pvanlage'
                                                    ? formatPrice((selection.quantity || 1) * selection.price)
                                                    : key === 'fenster'
                                                        ? formatPrice((selection.squareMeters || 1) * selection.price)
                                                        : formatPrice(selection.price || 0)
                                                }
                                            </div>
                                        </div>
                                    )
                                ))}
                                {isGrundstuecksCheckSelected && (
                                    <div className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                                        <div>
                                            <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px] whitespace-pre-line">
                                                {GRUNDSTUECKSCHECK_OPTION.name}
                                            </div>
                                            <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1 max-w-[66%]">
                                                {GRUNDSTUECKSCHECK_OPTION.description.split('\n')[0]}
                                            </div>
                                        </div>
                                        <div className="text-right font-normal text-[12px] tracking-[0.03em] leading-[14px] min-w-[130px]">
                                            <div className="mb-1 text-black">Aufpreis</div>
                                            {formatPrice(GRUNDSTUECKSCHECK_OPTION.price)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div id="total-price-wrapper" className="mt-6 text-right">
                                <h3 className="text-xl font-medium tracking-[-0.015em]">
                                    <span className="text-black">Gesamtpreis:</span> <span id="total-price-summary" className="font-medium">{formatPrice(totalPrice)}</span>
                                </h3>
                            </div>
                        </div>

                        {/* Add Noch Fragen offen? section for mobile */}
                        <div className="mt-6">
                            <InfoBox
                                title="Noch Fragen offen?"
                                description="Vereinbare jetzt Dein Beratungsgespräch - vor Ort oder ganz bequem telefonisch."
                                onClick={() => handleInfoClick('beratung')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

Configurator.displayName = 'Configurator';

export default Configurator;