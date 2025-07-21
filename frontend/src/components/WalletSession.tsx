import { useContext } from "react";
import { Web3Context } from "../contexts/Web3Context";
import { Button, Group } from "@mantine/core";

export function WalletSession() {
  const { account, connect, disconnect } = useContext(Web3Context);

  return (
    <Group>
      {account ? (
        <>
          <span>Conectado: {account.slice(0, 6)}...{account.slice(-4)}</span>
          {disconnect && (
            <Button color="red" variant="outline" onClick={disconnect}>
              Cerrar sesiónñ 
            </Button>
          )}
        </>
      ) : (
        <Button color="blue" onClick={connect}>
          Conectar Wallet
        </Button>
      )}
    </Group>
  );
} 