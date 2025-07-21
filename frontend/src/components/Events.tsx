import { Box, Flex, Image, Text, Button, Title } from '@mantine/core';

type EventType = {
  name: string;
  date: string;
  image: string;
  precio: string | number | bigint;
};

type EventsProps = {
  events: EventType[];
  title?: string;
  showButton?: boolean;
  buttonLabel?: string;
  onBuy?: (eventoId: number, precio: string) => void;
};

export default function Events({ events, title, showButton = true, buttonLabel = 'Comprar', onBuy }: EventsProps) {
  return (
    <Box>
      {title && <Title order={3} mt="xl" mb="md" style={{ color: '#845ef7', fontWeight: 700 }}>{title}</Title>}
      {events.map((event, idx) => (
        <Flex
          key={idx}
          align="center"
          gap="md"
          mb="sm"
          style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 1px 6px 0 #0001',
            padding: 16,
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          <Box style={{ flex: 1 }}>
            <Text fw={600}>{event.name}</Text>
            <Text size="sm" c="dimmed">{event.date}</Text>
            {showButton && (
              <Button
                mt="sm"
                variant="light"
                radius="xl"
                size="xs"
                onClick={() => onBuy?.(idx, event.precio?.toString() || "0")}
              >
                {buttonLabel}
              </Button>
            )}
          </Box>
          <Box style={{ width: 100, height: 100, flexShrink: 0 }}>
            <Image
              src={event.image}
              width={100}
              height={100}
              radius="md"
              fit="cover"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </Box>
        </Flex>
      ))}
    </Box>
  );
}
