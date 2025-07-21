import { useState } from "react";
import { useContext, useMemo } from "react";
import { Web3Context } from "../contexts/Web3Context";
import rawBoletoEventoAbi from "../abis/BoletoEvento.json";
import contractAddressJson from "../abis/contract-address.json";
import { ethers } from "ethers";

// Tipos básicos para TypeScript
/**
 * Representa los datos de un evento en el contrato BoletoEvento.
 */
type EventoData = {
  nombre: string;
  fecha: bigint;
  boletosDisponibles: bigint;
  precio: bigint;
};

/**
 * Hook personalizado para interactuar con el contrato BoletoEvento.
 * Proporciona funciones para crear eventos, comprar boletos, consultar eventos y otras utilidades del contrato.
 * Todas las funciones lanzan un error si el contrato no está conectado.
 */
export function useBoletoEvento() {
  const { signer } = useContext(Web3Context);
  const contractAddress = contractAddressJson.BoletoEvento;

  // Compatibilidad: usa .abi si existe, si no el objeto directamente
  const BoletoEventoAbi = (rawBoletoEventoAbi as any).abi || rawBoletoEventoAbi;
  console.log('ABI leído en useBoletoEvento:', BoletoEventoAbi);
  console.log('Dirección del contrato en useBoletoEvento:', contractAddress);

  // Memoiza la instancia del contrato
  const contract = useMemo(() => {
    if (!signer) return null;
    try {
      const c = new ethers.Contract(contractAddress, BoletoEventoAbi, signer);
      console.log('Contrato instanciado en useBoletoEvento:', c);
      return c;
    } catch (err) {
      console.error('Error al instanciar el contrato en useBoletoEvento:', err);
      return null;
    }
  }, [signer, contractAddress]);

  /**
   * Crea un nuevo evento en el contrato.
   */
  const crearEvento = async (
    nombre: string,
    fecha: number,
    cantidad: number,
    precio: number
  ) => {
    if (!contract) throw new Error("Contrato no conectado");
    console.log('Llamando crearEvento:', nombre, fecha, cantidad, precio);
    const tx = await contract.crearEvento(nombre, fecha, cantidad, precio);
    await tx.wait();
    console.log('Transacción crearEvento completada:', tx);
    return tx;
  };

  /**
   * Compra un boleto para un evento específico.
   */
  const comprarBoleto = async (eventoId: number, valueInEther: string) => {
    if (!contract) throw new Error("Contrato no conectado");
    console.log('Llamando comprarBoleto:', eventoId, valueInEther);
    const tx = await contract.comprarBoleto(eventoId, {
      value: ethers.parseEther(valueInEther)
    });
    await tx.wait();
    console.log('Transacción comprarBoleto completada:', tx);
    return tx;
  };

  /**
   * Consulta los datos de un evento por su ID.
   */
  const verEvento = async (eventoId: number): Promise<EventoData> => {
    if (!contract) throw new Error("Contrato no conectado");
    console.log('Llamando verEvento:', eventoId);
    const [nombre, fecha, boletosDisponibles, precio] = await contract.verEvento(eventoId);
    console.log('Resultado verEvento:', { nombre, fecha, boletosDisponibles, precio });
    return { nombre, fecha, boletosDisponibles, precio };
  };

  /**
   * Llama a una función de solo lectura del contrato por nombre.
   */
  const callContract = async (fnName: string, ...args: any[]) => {
    if (!contract) throw new Error("Contrato no conectado");
    console.log(`Llamando ${fnName} con argumentos:`, args);
    const result = await contract[fnName](...args);
    console.log(`Resultado de ${fnName}:`, result);
    return result;
  };

  // NUEVAS FUNCIONES PARA EL CONTRATO MODIFICADO
  const cantidadInicial = async (eventoId: number) => {
    if (!contract) throw new Error("Contrato no conectado");
    return await contract.cantidadInicial(eventoId);
  };

  const boletosVendidos = async (eventoId: number) => {
    if (!contract) throw new Error("Contrato no conectado");
    return await contract.boletosVendidos(eventoId);
  };

  return {
    contract,
    crearEvento,
    comprarBoleto,
    verEvento,
    tengoBoleto: (id: number) => callContract("tengoBoleto", id),
    contadorEventos: () => callContract("contadorEventos"),
    getOwner: () => callContract("owner"),
    retirarFondos: () => callContract("retirarFondos"),
    cantidadInicial,
    boletosVendidos
  };
}