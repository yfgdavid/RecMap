import { useState, useEffect } from "react";
import { Input } from "./ui/input";

interface Suggestion {
  display_name: string;
}

interface LocationInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function LocationInput({ value, onChange }: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(async () => {
        if (newValue.length < 3) {
          setSuggestions([]);
          return;
        }

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              newValue + " Recife, PE"
            )}&addressdetails=1&limit=5`
          );
          const data = await res.json();
          setSuggestions(data);
        } catch (err) {
          console.error("Erro ao buscar locais:", err);
        }
      }, 300)
    );
  };

  const handleSelect = (address: string) => {
    onChange(address);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <Input
        placeholder="Ex: Alto José do Pinho, Casa Amarela"
        value={value}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded-md w-full max-h-40 overflow-y-auto mt-1 shadow-lg">
          {suggestions.map((s, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(s.display_name)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
