// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BoletoEvento {

    address public owner;

    struct Evento {
        string nombre;
        uint fecha;
        uint boletosDisponibles;
        uint precio;
        uint cantidadInicial; // <--- NUEVO CAMPO
        mapping(address => bool) boletosComprados;
    }

    uint public contadorEventos;
    mapping(uint => Evento) public eventos;

    modifier soloOwner() {
        require(msg.sender == owner, "Solo el owner puede realizar esta accion");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Crea un nuevo evento
    function crearEvento(string memory _nombre, uint _fecha, uint _cantidad, uint _precio) public soloOwner {
        Evento storage nuevo = eventos[contadorEventos];
        nuevo.nombre = _nombre;
        nuevo.fecha = _fecha;
        nuevo.boletosDisponibles = _cantidad;
        nuevo.precio = _precio;
        nuevo.cantidadInicial = _cantidad; // <--- ASIGNACIÓN
        contadorEventos++;
    }

    /// @notice Permite a un usuario comprar 1 boleto para un evento
    function comprarBoleto(uint _eventoId) public payable {
        require(_eventoId < contadorEventos, "Evento no existe");
        Evento storage evento = eventos[_eventoId];

        require(!evento.boletosComprados[msg.sender], "Ya compraste boleto para este evento");
        require(evento.boletosDisponibles > 0, "Boletos agotados");
        require(msg.value >= evento.precio, "Fondos insuficientes");

        evento.boletosComprados[msg.sender] = true;
        evento.boletosDisponibles--;
    }

    /// @notice Verifica si el usuario ya compró un boleto
    function tengoBoleto(uint _eventoId) public view returns (bool) {
        require(_eventoId < contadorEventos, "Evento no existe");
        return eventos[_eventoId].boletosComprados[msg.sender];
    }

    /// @notice Consulta la información de un evento
    function verEvento(uint _eventoId) public view returns (string memory nombre, uint fecha, uint boletosDisponibles, uint precio) {
        require(_eventoId < contadorEventos, "Evento no existe");
        Evento storage evento = eventos[_eventoId];
        return (evento.nombre, evento.fecha, evento.boletosDisponibles, evento.precio);
    }

    /// @notice Permite al owner retirar los fondos del contrato
    function retirarFondos() public soloOwner {
        payable(owner).transfer(address(this).balance);
    }

    function cantidadInicial(uint _eventoId) public view returns (uint) {
        require(_eventoId < contadorEventos, "Evento no existe");
        return eventos[_eventoId].cantidadInicial;
    }

    function boletosVendidos(uint _eventoId) public view returns (uint) {
        require(_eventoId < contadorEventos, "Evento no existe");
        Evento storage evento = eventos[_eventoId];
        return evento.cantidadInicial - evento.boletosDisponibles;
    }
}
