'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ThemeSelectorProps {
  themes: {
    id: string;
    name: string;
    preview: string;
  }[];
  onSelectTheme: (themeId: string) => void;
  currentThemeId: string;
}

export default function ThemeSelector({
  themes,
  onSelectTheme,
  currentThemeId,
}: ThemeSelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(
    themes.findIndex((theme) => theme.id === currentThemeId) || 0
  );

  const nextTheme = () => {
    const newIndex = (currentIndex + 1) % themes.length;
    setCurrentIndex(newIndex);
    onSelectTheme(themes[newIndex].id);
  };

  const prevTheme = () => {
    const newIndex = (currentIndex - 1 + themes.length) % themes.length;
    setCurrentIndex(newIndex);
    onSelectTheme(themes[newIndex].id);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={prevTheme}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="px-2">
        <p className="text-sm font-medium">{themes[currentIndex].name}</p>
      </div>

      <Button variant="outline" size="icon" onClick={nextTheme}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
