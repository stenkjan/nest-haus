import React from "react";

interface ContactMapProps {
  id?: string;
  title?: string;
  subtitle?: string;
  backgroundColor?: "white" | "gray";
  maxWidth?: boolean;
}

export const ContactMap: React.FC<ContactMapProps> = ({
  id,
  title = "Wo du uns findest",
  subtitle = "Komm vorbei um deinen Traum mit uns zu besprechen.",
  backgroundColor = "gray",
  maxWidth = true,
}) => {
  const bgClass = backgroundColor === "gray" ? "bg-gray-50" : "bg-white";
  const containerClass = maxWidth
    ? "w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8"
    : "w-full px-[8%]";

  return (
    <section id={id} className={`w-full py-16 ${bgClass}`}>
      <div className={containerClass}>
        <div className="mb-12">
          <h1 className="h1-secondary text-gray-900 text-center">{title}</h1>
          <h3 className="h3-secondary text-gray-600 mb-8 max-w-3xl mx-auto text-center">
            {subtitle}
          </h3>
        </div>
        <div
          className="relative h-[600px] w-full bg-white rounded-[60px] overflow-hidden shadow-xl"
          style={{ border: "15px solid #F4F4F4" }}
        >
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.0612860304307!2d15.416334776632444!3d47.08126897114428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476e3352d2429edf%3A0x3a9430b9a0f0fd25!2sKarmeliterplatz%201%2C%208010%20Graz%2C%20Austria!5e0!3m2!1sen!2sus!4v1712087456318!5m2!1sen!2sus"
            width="600"
            height="450"
            style={{ width: "100%", height: "100%", border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};
