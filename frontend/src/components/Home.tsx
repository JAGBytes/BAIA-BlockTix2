import { useEffect, useState, useRef } from "react";
import {
  Container,
  Group,
  Title,
  Text,
  Button,
  TextInput,
  Box,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import Events from './Events';
import { useBoletoEvento } from "../hooks/useBoletoEvento";
import { showNotification } from "@mantine/notifications";

export default function Home() {
  const { contadorEventos, verEvento, comprarBoleto } = useBoletoEvento();
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventCount, setEventCount] = useState<number>(0);
  const lastCountRef = useRef<number>(0);

  // Detectar nuevos eventos
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const currentCount = Number(await contadorEventos());
        if (currentCount > lastCountRef.current) {
          lastCountRef.current = currentCount;
          setEventCount(currentCount); // Esto dispara el efecto de carga
        }
      } catch (err) {
        console.error("Error al verificar nuevos eventos", err);
      }
    }, 5000); // Poll cada 5 segundos solo para contar

    return () => clearInterval(intervalId);
  }, [contadorEventos]);

  // Cargar todos los eventos cuando cambia eventCount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const count = Number(await contadorEventos());
        lastCountRef.current = count;
        const eventsArr = [];
        for (let i = 0; i < count; i++) {
          try {
            const ev = await verEvento(i);
            eventsArr.push({
              name: ev.nombre,
              date: new Date(Number(ev.fecha) * 1000).toLocaleString(),
              image: "/fes.jpg",
              ...ev
            });
          } catch (err) {
            console.warn(`Evento ${i} inválido`, err);
          }
        }
        setEventos(eventsArr);
      } catch (err) {
        setEventos([]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [eventCount, contadorEventos, verEvento]);

  const handleBuy = async (eventoId: number, precio: string) => {
    try {
      await comprarBoleto(eventoId, precio);
      showNotification({
        color: "green",
        title: "¡Compra exitosa!",
        message: "Has comprado tu boleto correctamente.",
      });
    } catch (err: any) {
      showNotification({
        color: "red",
        title: "Error al comprar",
        message: err.message || "No se pudo comprar el boleto.",
      });
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <Box
        style={{
          height: '60vh',
          backgroundImage: 'url(/fes.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 70%',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container size="lg" style={{ color: '#fff' }}>
          <Title order={1} mb="xs" style={{ color: '#fff' }}>
            Discover Exclusive Events
          </Title>
          <Text size="lg" mb="lg" style={{ color: '#fff' }}>
            Find and purchase tickets for concerts, sports, and more, all secured by blockchain technology.
          </Text>
          <Group>
            <TextInput
              placeholder="Search for events"
              size="md"
              radius="md"
              w={300}
              leftSection={<IconSearch size={16} />}
            />
            <Button size="md" color="violet">
              Search
            </Button>
          </Group>
        </Container>
      </Box>

      {/* EVENTS */}
      <Container size="lg" my="xl">
        <Events
          events={eventos}
          title="Todos los Eventos"
          showButton={true}
          buttonLabel="Comprar"
          onBuy={handleBuy}
        />
        {loading && eventos.length === 0 && <div>Cargando eventos...</div>}
        {!loading && eventos.length === 0 && <div>No hay eventos creados aún.</div>}
      </Container>
    </>
  );
}