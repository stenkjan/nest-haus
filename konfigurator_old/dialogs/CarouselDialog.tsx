'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

interface CarouselDialogProps {
  isOpen: boolean;
  onClose: () => void;
  infoKey: string;
}

// Define content types
interface ContentSlide {
  title?: string;
  subtitle?: string;
  text: string;
  image?: string | string[];
  imageLayout?: string;
  imageMaxWidth?: string;
}

const CarouselDialog: React.FC<CarouselDialogProps> = ({
  isOpen,
  onClose,
  infoKey
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [content, setContent] = useState<ContentSlide[]>([]);

  useEffect(() => {
    // Set content based on infoKey
    const contentData = lightboxContent[infoKey] || [];
    setContent(contentData);
    setCurrentIndex(0);
  }, [infoKey]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Show arrows only if there are multiple slides
  const showLeftArrow = currentIndex > 0;
  const showRightArrow = currentIndex < content.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-6 rounded-lg backdrop-blur-md fixed top-1/2 left-0 right-0 mx-auto -translate-y-1/2">
        <DialogTitle className="text-3xl font-light text-center mb-2">
          {content[currentIndex]?.title || "Dialog Information"}
        </DialogTitle>
        <div className="relative w-full">
          {/* Navigation arrows */}
          {showLeftArrow && (
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full z-10"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              &#10094;
            </button>
          )}

          {showRightArrow && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full z-10"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              &#10095;
            </button>
          )}

          {/* Content */}
          {content.length > 0 && (
            <div className="bg-white rounded-xl p-8 max-h-full">
              {/* Main content */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Text column */}
                <div className="flex-1">
                  {content[currentIndex].subtitle && (
                    <h3 className="text-lg font-semibold mb-3">
                      {content[currentIndex].subtitle}
                    </h3>
                  )}
                  <div className="text-gray-600">
                    {content[currentIndex].text}
                  </div>
                </div>

                {/* Image column */}
                {content[currentIndex].image && (
                  <div className={`flex-1 ${content[currentIndex].imageLayout === 'grid' ? 'grid grid-cols-2 gap-4' : ''}`}>
                    {Array.isArray(content[currentIndex].image) ? (
                      content[currentIndex].image.map((img, idx) => (
                        <div key={idx} className="relative mb-2">
                          <Image
                            src={img}
                            alt={`Image ${idx + 1}`}
                            width={500}
                            height={300}
                            style={{
                              maxWidth: content[currentIndex].imageMaxWidth || '100%',
                              width: '100%',
                              height: 'auto'
                            }}
                            className="rounded"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="relative">
                        <Image
                          src={content[currentIndex].image as string}
                          alt={content[currentIndex].subtitle || "Image"}
                          width={500}
                          height={300}
                          style={{
                            maxWidth: content[currentIndex].imageMaxWidth || '100%',
                            width: '100%',
                            height: 'auto'
                          }}
                          className="rounded"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pagination dots */}
          {content.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {content.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-black' : 'bg-gray-400'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Define content for each info key - based on your HTML implementation
const lightboxContent: Record<string, ContentSlide[]> = {
  "planungspaket": [
    {
      text: `
        <h2 style="text-align:center;">Planungspaket – Übersicht</h2>
        <div class="planungspakete-grid">
          <div class="box_selection_service planungspaket-box">
            <div class="box_selection_name">
              <p class="small-text">Paket 01. Basisplanung<br><br> 
                <span class="small-text">
                  Inkl.<br> 
                  Einreichplanung<br>
                  Innenwände<br>
                  Fenster &amp; Türen<br><br>
                  Der perfekte Start für dein Projekt. ...
                </span>
              </p>
            </div>
            <div class="box_selection_price">
              <p><span class="small-text">Ab €8.000,00<br>oder €840,00<br>für 120 Mo.</span></p>
            </div>
          </div>
          
          <div class="box_selection_service planungspaket-box">
            <div class="box_selection_name">
              <p class="small-text">Paket 02. Basis Plus<br><br> 
                <span class="small-text">
                  Inkl.<br> 
                  Einreichplanung (Raumaufteilung)<br>
                  HKLS-Planung (Gebäudetechnik)<br><br>
                  Deine technische Grundlage. ...
                </span>
              </p>
            </div>
            <div class="box_selection_price">
              <p><span class="small-text">Ab €10.000,00<br>oder €840,00<br>für 120 Mo.</span></p>
            </div>
          </div>
          
          <div class="box_selection_service planungspaket-box">
            <div class="box_selection_name">
              <p class="small-text">Paket 03. Planung Pro<br><br> 
                <span class="small-text">
                  Inkl.<br> 
                  Einreichplanung (Raumaufteilung)<br>
                  HKLS-Planung (Gebäudetechnik)<br>
                  Interiorplanung<br><br>
                  Alles für deine perfekte Umsetzung. ...
                </span>
              </p>
            </div>
            <div class="box_selection_price">
              <p><span class="small-text">Ab €20.000,00<br>oder €840,00<br>für 120 Mo.</span></p>
            </div>
          </div>
        </div>
      `
    }
  ],
  "energie": [
    {
      title: "Energieausweis A++",
      text: "Hier findest du alle wichtigen Informationen zum Energieausweis deines Nests."
    }
  ],
  "materialien": [
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "Lärchen Natur",
      text: "Du hast die Freiheit, die Raumaufteilung nach deinen Vorstellungen zu planen, und kannst jedes Zimmer so gestalten, dass es deinen Bedürfnissen entspricht. Falls du Unterstützung benötigst, kannst du auf unsere Planungspakete zählen. Sie führen dich von der Einreichplanung bis zur maßgeschneiderten Gestaltung deines Innenraums. Unsere Module bieten dir mit ihrer beeindruckenden Raumhöhe von 8 Metern die Möglichkeit, eine Zwischendecke einzuziehen und so einen zweiten Stock zu schaffen.",
      image: "/assets/materials/fichte.png"
    },
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "FUNDERMAX® Fassadenplatten",
      text: "Du hast die Freiheit, die Raumaufteilung nach deinen Vorstellungen zu planen, und kannst jedes Zimmer so gestalten, dass es deinen Bedürfnissen entspricht. Falls du Unterstützung benötigst, kannst du auf unsere Planungspakete zählen. Sie führen dich von der Einreichplanung bis zur maßgeschneiderten Gestaltung deines Innenraums. Unsere Module bieten dir mit ihrer beeindruckenden Raumhöhe von 8 Metern die Möglichkeit, eine Zwischendecke einzuziehen und so einen zweiten Stock zu schaffen.",
      image: "/assets/materials/plattenweiss.png"
    },
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "Trapezblech",
      text: "Du hast die Freiheit, die Raumaufteilung nach deinen Vorstellungen zu planen, und kannst jedes Zimmer so gestalten, dass es deinen Bedürfnissen entspricht. Falls du Unterstützung benötigst, kannst du auf unsere Planungspakete zählen. Sie führen dich von der Einreichplanung bis zur maßgeschneiderten Gestaltung deines Innenraums. Unsere Module bieten dir mit ihrer beeindruckenden Raumhöhe von 8 Metern die Möglichkeit, eine Zwischendecke einzuziehen und so einen zweiten Stock zu schaffen.",
      image: "/assets/materials/trapezblech.png"
    }
  ],
  "fenster": [
    {
      title: "Fenster & Türen",
      text: "Hier erfährst du mehr über die Anpassungsmöglichkeiten für Fenster und Türen."
    }
  ],
  "innenverkleidung": [
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "Trapezblech",
      text: "Du hast die Freiheit, die Raumaufteilung nach deinen Vorstellungen zu planen, und kannst jedes Zimmer so gestalten, dass es deinen Bedürfnissen entspricht. Falls du Unterstützung benötigst, kannst du auf unsere Planungspakete zählen. Sie führen dich von der Einreichplanung bis zur maßgeschneiderten Gestaltung deines Innenraums. Unsere Module bieten dir mit ihrer beeindruckenden Raumhöhe von 8 Metern die Möglichkeit, eine Zwischendecke einzuziehen und so einen zweiten Stock zu schaffen.",
      image: "/assets/materials/innenansicht.png"
    },
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "Trapezblech",
      text: "Du hast die Freiheit, die Raumaufteilung nach deinen Vorstellungen zu planen, und kannst jedes Zimmer so gestalten, dass es deinen Bedürfnissen entspricht. Falls du Unterstützung benötigst, kannst du auf unsere Planungspakete zählen. Sie führen dich von der Einreichplanung bis zur maßgeschneiderten Gestaltung deines Innenraums. Unsere Module bieten dir mit ihrer beeindruckenden Raumhöhe von 8 Metern die Möglichkeit, eine Zwischendecke einzuziehen und so einen zweiten Stock zu schaffen.",
      image: [
        "/assets/materials/eiche.png",
        "/assets/materials/kalkstein.png",
        "/assets/materials/parkett.png",
        "/assets/materials/fichte.png"
      ],
      imageLayout: "grid",
      imageMaxWidth: "300px"
    }
  ],
  "system": [
    {
      title: "Patentiertes System",
      text: "Details zur einzigartigen Technologie, die dein Nest transportabel macht."
    }
  ],
  "gemeinsam": [
    {
      title: "Gemeinsam Großes Schaffen",
      text: "Wie du dein Nest individuell anpassen und optimieren kannst."
    }
  ],
};

export default CarouselDialog;