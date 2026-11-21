import { useMemo, useState } from "react";
import useClients from "../../hooks/useClients";
import { normalizeText } from "../../constants/const";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Dropdown } from "../ui/Dropdown";

interface Props {
  value: string;
  onValueChange: (value: string) => void;
  // null cuando el usuario vuelve a escribir: el cliente elegido deja de ser válido
  onSelect: (client: Client | null) => void;
}

const ClientSearch: React.FC<Props> = ({ value, onValueChange, onSelect }) => {
  const { clients } = useClients();
  const [isOpen, setIsOpen] = useState(false);

  const filteredClients = useMemo(() => {
    const query = value.trim();
    if (query.length < 3) return [];
    const normalizedSearch = normalizeText(query);

    return clients.filter(
      (c) =>
        normalizeText(c.name).includes(normalizedSearch) ||
        c.document.toString().includes(normalizedSearch),
    );
  }, [clients, value]);

  const handleChange = (text: string) => {
    onValueChange(text);
    onSelect(null);
    setIsOpen(true);
  };

  const handleSelect = (client: Client) => {
    onValueChange(`${client.name} - ${client.document}`);
    onSelect({ ...client, document: client.document.toString() });
    setIsOpen(false);
  };

  return (
    <div className="mb-4 relative">
      <Label htmlFor="clientSearchId">Buscar cliente</Label>
      <Input
        id="clientSearchId"
        type="text"
        placeholder="Escriba el CUIT o nombre del cliente (al menos 3 caracteres)"
        value={value}
        autoComplete="off"
        onChange={(ev) => handleChange(ev.target.value)}
        className="mt-1"
      />

      <Dropdown.Menu show={isOpen && filteredClients.length > 0} className="mt-1">
        {filteredClients.map((client) => (
          <Dropdown.Item key={client.document} onClick={() => handleSelect(client)}>
            {client.name} - {client.document}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </div>
  );
};

export default ClientSearch;
