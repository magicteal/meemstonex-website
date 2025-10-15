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
    <div className="text-center py-40 md:py-48">
      <h2 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-white tracking-tight leading-tight">
        {title}{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-purple-400 to-indigo-400">
          {highlight}
        </span>
      </h2>
      <p className="text-neutral-400 mt-6 text-lg md:text-xl max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;
