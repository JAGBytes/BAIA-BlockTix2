import React from 'react';
import { MantineProvider, AppShell } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { Web3Provider } from './contexts/Web3Context';
import '@mantine/core/styles.css';
import './App.css';
import Home from './components/Home';
import CreateEvent from './components/CreateEvent';
import HeaderBar from './components/HeaderBar';
import MyEvents from './components/MyEvents';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TestBoletoEvento } from './components/TestBoletoEvento';

function App() {
  return (
    <MantineProvider>
      <ModalsProvider>
        <Web3Provider>
          <Notifications position="top-right" />
          <BrowserRouter>
            <AppShell header={{ height: 60 }}>
              <HeaderBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateEvent />} />
                <Route path="/explore" element={<MyEvents />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </Web3Provider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;

