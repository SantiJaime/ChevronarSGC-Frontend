import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeText } from "../../constants/const";
import { Dropdown } from "../ui/Dropdown";
import { Input } from "../ui/Input";

const MIN_SEARCH_LENGTH = 5;
const MAX_RESULTS = 20;

const cityLabel = (city: City) => `${city.city} - ${city.province}`;

// Minúsculas, sin tildes ni signos: "Villa María - Córdoba" -> "villa maria cordoba"
const toSearchable = (text: string) =>
  normalizeText(text).replace(/[^a-z0-9ñ]+/g, " ").trim();

// Errores de tipeo tolerados por palabra, igual que el fuzzy de Atlas Search:
// las palabras cortas deben coincidir exacto
const maxEditsFor = (length: number) => (length >= 8 ? 2 : length >= 4 ? 1 : 0);

// Letras agregadas, faltantes, cambiadas o invertidas ("mraia" -> "maria")
// cuentan como una edición cada una
const editDistance = (a: string, b: string): number => {
  const d = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
};

// Ediciones para que la palabra buscada coincida con la palabra completa o con
// su comienzo (se puede buscar sin terminar de escribir)
const wordDistance = (queryWord: string, word: string) => {
  if (word.startsWith(queryWord)) return 0;
  return Math.min(
    editDistance(queryWord, word),
    editDistance(queryWord, word.slice(0, queryWord.length)),
  );
};

// Puntaje de relevancia: primero las coincidencias exactas, después las que
// contienen el texto y por último las similares. null = no coincide
const scoreCity = (query: string, city: City): number | null => {
  const name = toSearchable(city.city);
  const label = toSearchable(`${city.city} ${city.province}`);

  if (name === query || label === query) return 1000;
  if (name.startsWith(query)) return 900;
  if (label.includes(query)) return 800;

  const words = label.split(" ");
  let totalEdits = 0;
  for (const queryWord of query.split(" ")) {
    const best = Math.min(...words.map((word) => wordDistance(queryWord, word)));
    if (best > maxEditsFor(queryWord.length)) return null;
    totalEdits += best;
  }
  return 700 - totalEdits;
};

const searchCities = (cities: City[], text: string): City[] => {
  const query = toSearchable(text);
  if (query.length < MIN_SEARCH_LENGTH) return [];

  return cities
    .map((city) => ({ city, score: scoreCity(query, city) }))
    .filter((result): result is { city: City; score: number } => result.score !== null)
    .sort((a, b) => b.score - a.score || cityLabel(a.city).localeCompare(cityLabel(b.city)))
    .slice(0, MAX_RESULTS)
    .map((result) => result.city);
};

interface Props {
  id: string;
  cities: City[];
  // Localidad seleccionada ("Ciudad - Provincia"), "" si no hay
  value: string;
  onChange: (city: string) => void;
  onBlur?: () => void;
  error?: boolean;
  className?: string;
}

const CitySearch = ({ id, cities, value, onChange, onBlur, error, className }: Props) => {
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchCities(cities, text), [cities, text]);
  const queryLength = toSearchable(text).length;

  // Mantiene visible la opción marcada al moverse con las flechas
  useEffect(() => {
    menuRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleSelect = (city: City) => {
    const label = cityLabel(city);
    setText(label);
    setOpen(false);
    onChange(label);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setActiveIndex(0);
    setOpen(true);
    // Al editar el texto se pierde la selección: hay que elegir de la lista
    if (value) onChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) {
      if (e.key === "ArrowDown" && results.length > 0) setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showHint = open && !value && queryLength > 0;

  return (
    <Dropdown className={className}>
      <Input
        id={id}
        type="text"
        placeholder={`Escribí al menos ${MIN_SEARCH_LENGTH} letras para buscar`}
        autoComplete="off"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-autocomplete="list"
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          onBlur?.();
        }}
        error={error}
      />

      <Dropdown.Menu show={showHint}>
        <div ref={menuRef}>
          {queryLength < MIN_SEARCH_LENGTH ? (
            <p className="px-4 py-2 text-sm text-muted-foreground">
              Escribí al menos {MIN_SEARCH_LENGTH} letras para buscar
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-2 text-sm text-muted-foreground">
              No se encontraron localidades
            </p>
          ) : (
            results.map((city, index) => (
              <Dropdown.Item
                key={city._id ?? cityLabel(city)}
                data-index={index}
                // mousedown evita que el blur del input cierre la lista antes del click
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setActiveIndex(index)}
                className={index === activeIndex ? "bg-muted" : undefined}
              >
                {cityLabel(city)}
              </Dropdown.Item>
            ))
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CitySearch;
