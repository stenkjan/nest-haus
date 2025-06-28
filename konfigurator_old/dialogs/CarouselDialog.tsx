'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { HybridBlobImage } from '@/components/images';

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
                          <HybridBlobImage
                            path={img.replace('/api/images/', '')}
                            alt={`Image ${idx + 1}`}
                            width={500}
                            height={300}
                            style={{
                              maxWidth: content[currentIndex].imageMaxWidth || '100%',
                              width: '100%',
                              height: 'auto'
                            }}
                            className="rounded"
                            strategy="client"
                            enableCache={true}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="relative">
                        <HybridBlobImage
                          path={(content[currentIndex].image as string).replace('/api/images/', '')}
                          alt={content[currentIndex].subtitle || "Image"}
                          width={500}
                          height={300}
                          style={{
                            maxWidth: content[currentIndex].imageMaxWidth || '100%',
                            width: '100%',
                            height: 'auto'
                          }}
                          className="rounded"
                          strategy="client"
                          enableCache={true}
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
      subtitle: "Schiefer",
      text: "Schiefer steht für natürliche Eleganz, hohe Strapazierfähigkeit und zeitlose Ästhetik. Als Bodenbelag im Innenraum überzeugt er durch seine robuste, trittfeste Oberfläche und seine Beständigkeit gegenüber Temperaturschwankungen und Feuchtigkeit. Die feine, geschichtete Struktur und die charakteristische Farbpalette von Anthrazit bis Tiefgrau verleihen jedem Raum eine edle, zugleich warme Ausstrahlung. Schiefer bringt Ursprünglichkeit und Stil in Einklang – und wird so zum langlebigen Gestaltungselement für moderne wie klassische Wohnkonzepte.",
      image: "/api/images/57-NEST-Haus-Materialien-Oberflaechen-Fussboden-Naturstein-Schiefer-Feinsteinzeug"
    },
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "Lärche Natur",
      text: "Die Fassade in Holzlattung aus Lärche Natur vereint natürliche Ästhetik mit langlebiger Qualität. Die charakteristische Maserung und warme Farbgebung der Lärche verleihen Gebäuden eine zeitlose Eleganz und fügen sich harmonisch in die Umgebung ein. Dank der hohen Witterungsbeständigkeit des Holzes entwickelt die unbehandelte Lärche mit der Zeit eine silbergraue Patina, die den rustikalen Charme unterstreicht und zugleich vor Umwelteinflüssen schützt.",
      image: "/api/images/52-NEST-Haus-Materialien-Oberflaechen-Fassade-Laerche-Bauholz-Lattung"
    },
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "Kalkstein",
      text: "Der massive Kalkstein überzeugt durch seine natürliche Eleganz, zeitlose Ästhetik und hohe Widerstandsfähigkeit. Mit seiner charakteristischen Farbgebung, die von warmen Beigetönen bis hin zu sanften Graunuancen reicht, verleiht er Innen- und Außenbereichen eine edle, harmonische Ausstrahlung. Seine fein strukturierte Oberfläche und die einzigartigen Adern und Fossileinschlüsse machen jedes Element zu einem Unikat.",
      image: "/api/images/56-NEST-Haus-Materialien-Oberflaechen-Fussboden-Naturstein-Kalkstein-Kanafar"
    },
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "FUNDERMAX® HPL-Platten",
      text: "Die Fundermax HPL-Platten sind eine erstklassige Lösung für moderne und langlebige Fassadengestaltungen. Gefertigt aus hochverdichteten Laminatplatten, bieten sie eine außergewöhnliche Witterungsbeständigkeit, UV-Stabilität und Schlagfestigkeit. Ihre widerstandsfähige Oberfläche ist kratzfest, pflegeleicht und trotzt selbst extremen klimatischen Bedingungen.",
      image: "/api/images/53-NEST-Haus-Materialien-Oberflaechen-Fassadenplatte-Schwarz"
    },
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "Eiche Parkett",
      text: "Der Parkettboden aus Eiche steht für zeitlose Eleganz, natürliche Wärme und außergewöhnliche Langlebigkeit. Die charakteristische Maserung und die warme Farbgebung der Eiche verleihen jedem Raum eine edle und zugleich gemütliche Atmosphäre. Dank der hohen Härte und Widerstandsfähigkeit des Holzes ist Eichenparkett besonders strapazierfähig und eignet sich sowohl für Wohnräume als auch für stark frequentierte Bereiche.",
      image: "/api/images/49-NEST-Haus-Materialien-Oberflaechen-Fussboden-Eichenholz-Parkett-Fischgraetparkett-Eiche"
    },
    {
      title: "Die Außenhülle - Unsere Materialien",
      subtitle: "Trapezblech",
      text: "Trapezblech ist eine langlebige und vielseitig einsetzbare Lösung für Dach- und Fassadenkonstruktionen. Dank seiner hohen Stabilität und Widerstandsfähigkeit eignet es sich perfekt für den privaten als auch den gewerblichen Bereich. Das Material zeichnet sich durch seine wetterfesten Eigenschaften aus und bietet einen zuverlässigen Schutz vor Wind, Regen und Schnee. Die profilierte Form sorgt für eine hohe Tragfähigkeit bei geringem Eigengewicht, was die Montage besonders effizient und kostensparend macht.",
      image: "/api/images/55-NEST-Haus-Materialien-Oberflaechen-Fassade-Trapezblech-Blech-Schwarz"
    }
  ],
  "fenster": [
    {
      title: "Fenster & Türen - Unsere Materialien",
      subtitle: "Holz Eiche",
      text: "Eiche-Fenster vereinen natürliche Schönheit mit außergewöhnlicher Langlebigkeit. Die charakteristische Maserung und warme Farbgebung der Eiche verleihen jedem Fenster eine edle, zeitlose Ausstrahlung. Eiche ist extrem widerstandsfähig und eignet sich perfekt für den täglichen Gebrauch, dabei bewahrt sie über viele Jahre hinweg ihre Form und natürliche Anmutung.",
      image: "/api/images/174-NEST-Haus-Fenster-Holz-Eiche-Holzfenster-Eichenfenster"
    },
    {
      title: "Fenster & Türen - Unsere Materialien",
      subtitle: "Holz Fichte",
      text: "Fichte-Fenster überzeugen durch ihre helle, freundliche Ausstrahlung und verleihen jedem Raum ein Gefühl von Weite und Geborgenheit. Die sanfte Maserung und der warme Farbton der Fichte bringen natürliche Schönheit zur Geltung. Fichte ist leicht, vielseitig einsetzbar und sorgt dank ihrer feuchtigkeitsregulierenden Eigenschaften für ein angenehmes Raumklima.",
      image: "/api/images/175-NEST-Haus-Fenster-Holz-Fichte-Holzfenster-Fichtenfenster"
    },
    {
      title: "Fenster & Türen - Unsere Materialien",
      subtitle: "Aluminium",
      text: "Aluminium-Fenster stehen für moderne Ästhetik, außergewöhnliche Stabilität und minimalen Wartungsaufwand. Sie bieten hervorragende Wärmedämmung, sind witterungsbeständig und überzeugen durch ihre schlanken Profile. Aluminium-Fenster sind langlebig, recycelbar und eignen sich perfekt für zeitgemäße Architektur mit höchsten Ansprüchen an Design und Funktionalität.",
      image: "/api/images/176-NEST-Haus-Fenster-Aluminium-Fenster-Aluminiumfenster-Metallfenster"
    },
    {
      title: "Fenster & Türen - Unsere Materialien",
      subtitle: "Kunststoff PVC",
      text: "PVC-Fenster bieten hervorragende Wärmedämmung, sind wartungsarm und überzeugen durch ihr ausgezeichnetes Preis-Leistungs-Verhältnis. Sie sind witterungsbeständig, pflegeleicht und in verschiedenen Farben und Oberflächenstrukturen erhältlich. PVC-Fenster eignen sich ideal für energieeffizientes Bauen und bieten zuverlässigen Schutz bei geringen Folgekosten.",
      image: "/api/images/177-NEST-Haus-Fenster-Kunststoff-PVC-Fenster-Weiß-Kunststofffenster-PVCFenster"
    }
  ],
  "innenverkleidung": [
    {
      title: "Die Innenverkleidung - Unsere Materialien",
      subtitle: "Eiche",
      text: "Die Innenverkleidung aus Eiche bringt die unvergleichliche Ausstrahlung echten Holzes in Ihre Räume. Mit ihrer warmen Farbgebung und der charaktervollen Maserung schafft Eiche eine behagliche Atmosphäre und verleiht jedem Interieur eine hochwertige, natürliche Note. Eiche ist nicht nur schön, sondern auch extrem widerstandsfähig. Die robuste Holzart eignet sich perfekt für den täglichen Gebrauch und bewahrt über viele Jahre hinweg ihre Form und Anmutung.",
      image: "/api/images/50-NEST-Haus-Materialien-Oberflaechen-Innenausbau-Eichenholz-Interior-Eiche"
    },
    {
      title: "Die Innenverkleidung - Unsere Materialien",
      subtitle: "Fichte",
      text: "Die Innenverkleidung aus Fichte überzeugt durch ihre helle, freundliche Ausstrahlung und verleiht jedem Raum ein Gefühl von Weite und Geborgenheit. Die sanfte Maserung und der warme Farbton der Fichte bringen die natürliche Schönheit des Holzes zur Geltung und schaffen eine wohltuende, harmonische Atmosphäre. Fichte ist leicht, vielseitig einsetzbar und sorgt dank ihrer feuchtigkeitsregulierenden Eigenschaften für ein angenehmes Raumklima.",
      image: "/api/images/58-NEST-Haus-Materialien-Oberflaechen-Innenausbau-Interior-Fichte-natur-hell"
    },
    {
      title: "Die Innenverkleidung - Unsere Materialien",
      subtitle: "Kiefer",
      text: "Die Innenverkleidung aus Kiefernholz bringt natürliche Wärme und lebendige Optik in den Innenraum. Die markante Maserung und die warmen, goldgelben Töne schaffen eine gemütliche, einladende Atmosphäre. Gleichzeitig ist das Holz leicht, gut zu verarbeiten und wirkt feuchtigkeitsregulierend – ideal für ein angenehmes, gesundes Raumklima. Mit seiner zeitlosen Ausstrahlung passt es sowohl in moderne als auch in traditionelle Wohnkonzepte.",
      image: "/api/images/59-NEST-Haus-Materialien-Oberflaechen-Innenausbau-Interior-Kiefer-natur"
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