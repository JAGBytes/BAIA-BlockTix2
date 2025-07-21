import { useState } from "react";
import { useBoletoEvento } from "../hooks/useBoletoEvento";
import { Button, Text } from "@mantine/core";

export function TestBoletoEvento() {
  const { getOwner, contadorEventos, verEvento } = useBoletoEvento();
  const [owner, setOwner] = useState<string>("");
  const [eventCount, setEventCount] = useState<string>("");
  const [evento, setEvento] = useState<any>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Button
        onClick={async () => {
          try {
            const o = await getOwner();
            setOwner(o);
          } catch (err) {
            setOwner("Error: " + (err as Error).message);
          }
        }}
      >
        Ver Owner
      </Button>
      <Text>Owner: {owner}</Text>

      <Button
        onClick={async () => {
          try {
            const count = await contadorEventos();
            setEventCount(count.toString());
          } catch (err) {
            setEventCount("Error: " + (err as Error).message);
          }
        }}
      >
        Ver cantidad de eventos
      </Button>
      <Text>Cantidad de eventos: {eventCount}</Text>

      <Button
        onClick={async () => {
          try {
            const ev = await verEvento(0);
            setEvento(ev);
          } catch (err) {
            setEvento("Error: " + (err as Error).message);
          }
        }}
      >
        Ver primer evento (ID 0)
      </Button>
      <Text>Evento 0: {evento ? JSON.stringify(evento) : "Sin datos"}</Text>
    </div>
  );
} 