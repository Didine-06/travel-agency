import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../Context/LanguageContext';
import type { SupportedLanguage } from '../../i18n';

type Option = {
  value: SupportedLanguage;
  label: string;
  flagSrc: string;
  flagAlt: string;
};

const options: Option[] = [
  { value: 'fr', label: 'Français', flagSrc: '/images/flags/fr.svg', flagAlt: 'FR' },
  { value: 'en', label: 'English', flagSrc: '/images/flags/gb.svg', flagAlt: 'EN' },
];

const LanguageSelect = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = useMemo(
    () => options.find((o) => o.value === language) ?? options[0],
    [language]
  );

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const choose = async (lng: SupportedLanguage) => {
    await setLanguage(lng);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 inline-flex items-center gap-2 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <img
          src={current.flagSrc}
          alt={current.flagAlt}
          className="w-5 h-5 rounded-sm object-cover"
          loading="lazy"
        />
        {/* <span className="hidden sm:inline font-medium">{current.value.toUpperCase()}</span> */}
        <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden z-50"
        >
          {options.map((o) => {
            const active = o.value === language;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => void choose(o.value)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <img
                    src={o.flagSrc}
                    alt={o.flagAlt}
                    className="w-5 h-5 rounded-sm object-cover"
                    loading="lazy"
                  />
                  <span className="font-medium">{o.label}</span>
                </span>
                {active && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelect;
