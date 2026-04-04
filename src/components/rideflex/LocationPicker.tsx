import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Clock, X } from 'lucide-react';
import { RFInput } from './RFInput';

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: 'departure' | 'arrival';
  otherValue?: string; // To prevent same value
}

const STORAGE_KEY = 'rideflex_location_history';

function getHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function addToHistory(value: string) {
  if (!value.trim()) return;
  const history = getHistory().filter(h => h !== value);
  history.unshift(value);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 8)));
}

export function LocationPicker({ value, onChange, placeholder, icon = 'departure', otherValue }: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [history] = useState(getHistory);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputValue(value); }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    if (otherValue && val === otherValue) return; // Prevent same as other
    setInputValue(val);
    onChange(val);
    addToHistory(val);
    setOpen(false);
  };

  const handleMyPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => handleSelect(`Ma position (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`),
        () => handleSelect('Ma position')
      );
    } else {
      handleSelect('Ma position');
    }
  };

  const handleConfirm = () => {
    if (inputValue.trim() && inputValue !== otherValue) {
      onChange(inputValue);
      addToHistory(inputValue);
      setOpen(false);
    }
  };

  const iconColor = icon === 'departure' ? 'text-brand-blue' : 'text-brand-teal';

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <MapPin className={`${iconColor} w-5 h-5 mr-3 shrink-0`} />
        <RFInput
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); if (!open) setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          placeholder={placeholder}
          className="border-0 focus-visible:ring-0 px-0 h-auto text-base shadow-none"
        />
        {inputValue && (
          <button onClick={(e) => { e.stopPropagation(); setInputValue(''); onChange(''); }} className="p-1 text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {/* My position */}
          <button
            onClick={handleMyPosition}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
          >
            <Navigation className="w-5 h-5 text-brand-blue shrink-0" />
            <span className="text-sm font-medium text-foreground">Ma position</span>
          </button>

          {/* Recent history */}
          {history.length > 0 && (
            <>
              <div className="px-4 py-2 bg-muted/50">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Récents</span>
              </div>
              {history.filter(h => !otherValue || h !== otherValue).slice(0, 5).map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(h)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate">{h}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
