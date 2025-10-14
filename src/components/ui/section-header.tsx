import React from "react";

interface SectionHeaderProps {
  title: string;
  highlight: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  highlight,
  subtitle,
}) => {
  return (
    <div className="text-center py-16 md:py-24">
      <h2 className="text-5xl md:text-7xl font-bold text-white">
        {title} <span className="text-red-500">{highlight}</span>
      </h2>
      <p className="text-neutral-400 mt-4 text-lg md:text-xl">{subtitle}</p>
    </div>
  );
};

export default SectionHeader;
