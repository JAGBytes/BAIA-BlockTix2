import { useState } from "react";
import { useBoletoEvento } from "../hooks/useBoletoEvento";
import { TextInput, NumberInput, Button, Group, Notification } from "@mantine/core";

export default function CreateEvent() {
  const { crearEvento, contadorEventos } = useBoletoEvento();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState<string>("");
  const [cantidad, setCantidad] = useState<number | undefined>(undefined);
  const [precio, setPrecio] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Convertir fecha a timestamp (segundos)
      const timestamp = fecha ? Math.floor(new Date(fecha).getTime() / 1000) : 0;
      await crearEvento(
        nombre,
        timestamp,
        cantidad ?? 0,
        precio ?? 0
      );
      // Guardar la cantidad inicial de boletos en localStorage (opcional, para referencia rápida)
      const count = Number(await contadorEventos());
      const eventoId = count - 1;
      const iniciales = JSON.parse(localStorage.getItem('boletosIniciales') || '{}');
      iniciales[eventoId] = cantidad ?? 0;
      localStorage.setItem('boletosIniciales', JSON.stringify(iniciales));
      setSuccess(true);
      setNombre("");
      setFecha("");
      setCantidad(undefined);
      setPrecio(undefined);
    } catch (err: any) {
      setError(err.message || "Error al crear el evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "120px auto 0 auto",
        border: '1px solid #e0e0e0',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 #0002',
        background: '#fff',
        padding: 32,
        paddingTop: 48
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextInput
          label="Nombre del evento"
          value={nombre}
          onChange={e => setNombre(e.currentTarget.value)}
          required
        />
        <label style={{ fontWeight: 500 }}>
          Fecha y hora del evento
          <input
            type="datetime-local"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
            style={{ marginTop: 4, padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: 16, width: "100%" }}
          />
        </label>
        <NumberInput
          label="Cantidad de boletos"
          value={cantidad}
          onChange={value => setCantidad(typeof value === "number" ? value : undefined)}
          required
          min={1}
        />
        <NumberInput
          label="Precio (wei)"
          value={precio}
          onChange={value => setPrecio(typeof value === "number" ? value : undefined)}
          required
          min={0}
        />
        <Group mt="md">
          <Button type="submit" loading={loading} disabled={loading}>
            Crear evento
          </Button>
        </Group>
        {success && (
          <Notification color="green" title="¡Evento creado!" mt="md" onClose={() => setSuccess(false)}>
            El evento se creó correctamente en la blockchain.
          </Notification>
        )}
        {error && (
          <Notification color="red" title="Error" mt="md" onClose={() => setError(null)}>
            {error}
          </Notification>
        )}
      </div>
    </form>
  );
}

