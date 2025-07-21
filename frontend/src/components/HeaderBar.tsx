import { Group, Title, TextInput, Avatar, Button, AppShell } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Create', to: '/create' },
];

export default function HeaderBar() {
  const location = useLocation();
  const { connect, account, isConnecting } = useContext(Web3Context);
  return (
    <AppShell.Header>
      <Group px="md" h="100%" justify="space-between">
        <Title order={3}>BlockTix</Title>
        <Group gap="md">
          {navItems.map((item) => {
            const selected = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 90, // ancho mínimo igual para todos
                  height: 36,
                  padding: '6px 18px',
                  borderRadius: 8,
                  color: selected ? '#fff' : '#845ef7',
                  background: selected ? '#845ef7' : 'transparent',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'background 0.2s, color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!selected) {
                    e.currentTarget.style.background = '#f3f0ff';
                    e.currentTarget.style.color = '#5f3dc4';
                  }
                }}
                onMouseLeave={e => {
                  if (!selected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#845ef7';
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </Group>
        <Group>
        {account ? (
            <Button variant="light" color="green">
            {account.slice(0, 6)}...{account.slice(-4)}
            </Button>
        ) : (
            <Button onClick={connect} color="blue" disabled={isConnecting}>
            {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
            </Button>
        )}


          <Avatar radius="xl" />
        </Group>
      </Group>
    </AppShell.Header>
  );
}
