import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BoletoEvento from '../abis/BoletoEvento.json';
import contractAddressJson from '../abis/contract-address.json';

export const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer,   setSigner]   = useState(null);
  const [account,  setAccount]  = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const contratoAddress = contractAddressJson.BoletoEvento;

  // Al montar: detecta si MetaMask está disponible y lista cuentas
  useEffect(() => {
    if (window.ethereum) {
      localStorage.clear();
      sessionStorage.clear();
      setAccount(null);
      setSigner(null);
      setContract(null);
      setProvider(null);
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      (async () => {
        try {
          const accs = await p.listAccounts();
          console.log('Cuentas detectadas:', accs);
          if (accs.length) {
            const s = await p.getSigner();
            setAccount(accs[0].address);
            setSigner(s);
            console.log('Signer:', s);
            console.log('Dirección del contrato:', contratoAddress);
            console.log('ABI:', BoletoEvento);
            try {
              const c = new ethers.Contract(contratoAddress, BoletoEvento, s);
              setContract(c);
              console.log('Contrato instanciado:', c);
            } catch (err) {
              console.error('Error al instanciar el contrato:', err);
            }
          }
        } catch (err) {
          console.error('Error en useEffect Web3Context:', err);
        }
      })();
    } else {
      console.warn('MetaMask no detectado');
    }
  }, []);

  // Función para disparar la petición de conexión
  const connect = async () => {
    if (!provider || isConnecting) return;
  
    setIsConnecting(true);
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);

      const s = await provider.getSigner();
      setSigner(s);

      const c = new ethers.Contract(contratoAddress, BoletoEvento, s);
      setContract(c);
      console.log('Conectado. Cuenta:', accounts[0]);
      console.log('Signer:', s);
      console.log('Contrato instanciado:', c);
    } catch (err) {
      if (err.code === 4001) {
        alert('El usuario rechazó la conexión');
      } else {
        alert('Error al conectar:', err);
        console.error('Error al conectar:', err);
      }
    }
  };

  return (
    <Web3Context.Provider value={{ provider, signer, account, contract, connect }}>
      {children}
    </Web3Context.Provider>
  );
}