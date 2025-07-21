# BlockTix - Plataforma de Venta de Boletos con Blockchain

Este proyecto es una aplicación descentralizada (dApp) para la creación y venta de boletos para eventos, utilizando contratos inteligentes en la blockchain.

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Yarn](https://yarnpkg.com/) (gestor de paquetes)
- [MetaMask](https://metamask.io/) (extensión de navegador)

---

## Instalación

1.  **Clona el repositorio:**

    ```sh
    git clone <URL_DEL_REPOSITORIO>
    cd BlockTix
    ```

2.  **Instala las dependencias de la raíz:**
    Esto instala Hardhat y todas las dependencias para el desarrollo de contratos.

    ```sh
    yarn install
    ```

3.  **Instala las dependencias del frontend:**
    ```sh
    cd frontend
    yarn install
    ```

---

## Ejecución en Entorno Local

Para probar la dApp localmente, necesitarás 3 terminales abiertas en la raíz del proyecto (`BlockTix`).

### **Terminal 1: Iniciar el Nodo Local de Hardhat**

Este comando levanta una blockchain local en tu máquina, con cuentas de prueba y fondos.

```sh
yarn hardhat node
```

> **Nota:** Deja esta terminal abierta mientras desarrollas. Si la cierras, la blockchain se reiniciará y perderás los contratos desplegados.

### **Terminal 2: Desplegar el Contrato Inteligente**

Este comando compila (si es necesario) y despliega el contrato `BoletoEvento` a la red local. También actualiza el ABI y la dirección del contrato en el frontend.

```sh
yarn hardhat run scripts/deploy.js --network localhost
```

> **Nota:** Debes volver a ejecutar este comando cada vez que reinicies el nodo local de Hardhat.

### **Terminal 3: Iniciar el Frontend**

Este comando levanta la aplicación React.

```sh
cd frontend
yarn start
```

La aplicación se abrirá en tu navegador en `http://localhost:3000`.

---

## Configuración de MetaMask

Para interactuar con la dApp, necesitas conectar MetaMask a tu red local de Hardhat.

1.  **Agrega la red local a MetaMask:**

    - **Nombre de la red:** Hardhat Local
    - **Nueva URL de RPC:** `http://127.0.0.1:8545`
    - **ID de cadena:** `31337`
    - **Símbolo de moneda:** `ETH`

2.  **Importa una cuenta de prueba:**
    - La terminal donde corres `yarn hardhat node` te mostrará una lista de cuentas con sus claves privadas.
    - En MetaMask, ve a "Importar cuenta" y pega una de las claves privadas.
    - ¡Ahora tienes una cuenta con ETH de prueba para interactuar con tu dApp!

---

## Scripts Disponibles

- `yarn hardhat compile`: Compila los contratos.
- `yarn hardhat test`: Ejecuta los tests del contrato.
- `yarn start` (en la carpeta `frontend`): Inicia el frontend.
