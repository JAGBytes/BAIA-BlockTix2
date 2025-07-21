import { Paper, Table, Box, Stack, Title } from '@mantine/core';
import Events from './Events';
import { useBoletoEvento } from "../hooks/useBoletoEvento";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../contexts/Web3Context";

const upcomingEvents = [
  {
    name: 'Concierto de Música Electrónica',
    date: 'Sábado, 15 de junio · 20:00',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    precio: '0',
  },
];

// MOCK de eventos creados
const createdEvents = [
  {
    nombre: 'Conferencia de Innovación',
    fecha: '10 de julio de 2024',
    boletosDisponibles: 20,
    precio: 50,
    cantidadInicial: 100,
  },
  {
    nombre: 'Taller de Diseño UX/UI',
    fecha: '15 de agosto de 2024',
    boletosDisponibles: 10,
    precio: 30,
    cantidadInicial: 80,
  },
  {
    nombre: 'Feria de Tecnología',
    fecha: '22 de septiembre de 2024',
    boletosDisponibles: 0,
    precio: 100,
    cantidadInicial: 200,
  },
];

const cellStyle = { textAlign: 'center' as const, padding: '15px 35px' };
const thStyle = { textAlign: 'center' as const, padding: '15px 35px', background: '#f3f0ff', color: '#5f3dc4', fontWeight: 700, fontSize: 16 };

export default function MyEvents() {
  const { getOwner, contadorEventos, verEvento, cantidadInicial, boletosVendidos, tengoBoleto } = useBoletoEvento();
  const { account } = useContext(Web3Context);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [eventos, setEventos] = useState<any[]>([]);
  const [comprados, setComprados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      if (!account) {
        setIsOwner(null);
        return;
      }
      try {
        const owner = await getOwner();
        setIsOwner(owner && account && owner.toLowerCase() === account.toLowerCase());
      } catch {
        setIsOwner(false);
      }
    };
    checkOwner();
  }, [account, getOwner]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const count = Number(await contadorEventos());
        const eventsArr = [];
        for (let i = 0; i < count; i++) {
          try {
            const ev = await verEvento(i);
            const inicial = await cantidadInicial(i);
            const vendidos = await boletosVendidos(i);
            eventsArr.push({
              id: i,
              nombre: ev.nombre,
              fecha: new Date(Number(ev.fecha) * 1000).toLocaleString(),
              boletosDisponibles: Number(ev.boletosDisponibles),
              precio: Number(ev.precio),
              cantidadInicial: Number(inicial),
              boletosVendidos: Number(vendidos),
              fondosGenerados: Number(vendidos) * Number(ev.precio)
            });
          } catch (err) {}
        }
        setEventos(eventsArr);
      } catch (err) {
        setEventos([]);
      }
      setLoading(false);
    };

    if (isOwner) {
      fetchEvents();
      intervalId = setInterval(fetchEvents, 5000); // Poll cada 5 segundos
    }

    return () => clearInterval(intervalId);
  }, [isOwner, contadorEventos, verEvento, cantidadInicial, boletosVendidos]);

  // Nuevo efecto para boletos comprados
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchComprados = async () => {
      setLoading(true);
      try {
        const count = Number(await contadorEventos());
        const compradosArr = [];
        for (let i = 0; i < count; i++) {
          try {
            const tiene = await tengoBoleto(i);
            if (tiene) {
              const ev = await verEvento(i);
              compradosArr.push({
                name: ev.nombre,
                date: new Date(Number(ev.fecha) * 1000).toLocaleString(),
                image: "/fes.jpg",
                precio: ev.precio
              });
            }
          } catch (err) {}
        }
        setComprados(compradosArr);
      } catch (err) {
        setComprados([]);
      }
      setLoading(false);
    };

    if (account) {
      fetchComprados();
      intervalId = setInterval(fetchComprados, 5000); // Poll cada 5 segundos
    }

    return () => clearInterval(intervalId);
  }, [account, contadorEventos, verEvento, tengoBoleto]);

  return (
    <Box p="xl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
        <Stack gap="sm">
          <Title order={2} mt="xl" mb="md" style={{ color: '#5f3dc4', fontWeight: 800 }}>Boletos comprados</Title>
          <Title order={3} mb="sm" style={{ color: '#845ef7', fontWeight: 700 }}>Próximos</Title>
          <Events events={comprados} showButton={false} />

          <Title order={3} mt="xl" mb="md" style={{ color: '#845ef7', fontWeight: 700 }}>Eventos Creados</Title>
          {isOwner === null && (
            <Box p="xl" style={{ textAlign: 'center' }}>Cargando o conecta tu wallet para ver tus eventos creados.</Box>
          )}
          {isOwner === false && (
            <Box p="xl" style={{ textAlign: 'center', color: '#845ef7', fontWeight: 700 }}>
              Acceso restringido: solo el owner puede ver los eventos creados.
            </Box>
          )}
          {isOwner && (
            <Paper withBorder radius="md" mt="sm" p={0} style={{ background: '#fff' }}>
              <Table striped highlightOnHover withColumnBorders>
                <thead>
                  <tr>
                    <th style={thStyle}>Nombre del evento</th>
                    <th style={thStyle}>Fecha</th>
                    <th style={thStyle}>Boletos disponibles</th>
                    <th style={thStyle}>Precio del boleto</th>
                    <th style={thStyle}>Boletos vendidos</th>
                    <th style={thStyle}>Fondos generados</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.map((ev, idx) => {
                    const boletosVendidos = ev.cantidadInicial - ev.boletosDisponibles;
                    const fondosGenerados = boletosVendidos * ev.precio;
                    return (
                      <tr key={idx}>
                        <td style={cellStyle}>{ev.nombre}</td>
                        <td style={cellStyle}>{ev.fecha}</td>
                        <td style={cellStyle}>{ev.boletosDisponibles}</td>
                        <td style={cellStyle}>${ev.precio}</td>
                        <td style={cellStyle}>{boletosVendidos}</td>
                        <td style={cellStyle}>{fondosGenerados > 0 ? `$${fondosGenerados}` : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Paper>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
  