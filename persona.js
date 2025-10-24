class Persona extends GameObject {
  constructor(texture, x, y, juego) {
    super(texture, x, y, juego);
  }

  obtenerOtraPersona() {
    return this.juego.personas;
  }
}
