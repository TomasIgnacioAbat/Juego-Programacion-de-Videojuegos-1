class Juego {
  pixiApp;
  personas = [];
  anchoPantalla = 1280;
  altoPantalla = 720;

  constructor() {
    this.mouse = { posicion: { x: 0, y: 0 } };
    this.inciarPixi();
  }

  //async indica q este metodo es asincrónico, es decir q debe usar "await".
  async inciarPixi() {
    this.pixiApp = new PIXI.Application(); //creamos la aplicacion de pixi y la guardamos en la propiedad pixiApp

    this.renombrarEscenario("El Stage");

    globalThis.__PIXI_APP__ = this.pixiApp; //esto es para que funcione la extension de pixi

    const opcionesDePixi = {
      backgroundColor: "#1099bb",
      width: this.anchoPantalla,
      height: this.altoPantalla,
      antialias: false,
      SCALE_MODE: PIXI.SCALE_MODES.NEAREST,
    };

    //await indica q el codigo se frena hasta que el metodo init de la app de pixi haya terminado, puede tardar 2ms, 400ms.. no lo sabemos :O
    await this.pixiApp.init(opcionesDePixi); //cuando termina se incializa pixi con las opciones definidas anteriormente

    document.body.appendChild(this.pixiApp.canvas); //agregamos el elementos canvas creado por pixi en el documento html

    // const texture = await PIXI.Assets.load("bunny.png"); //cargamos la imagen bunny.png y la guardamos en la variable texture (deprecated, ahora lo tengo como ejemplo nomás)

    this.crear_Personajes(30);

    //agregamos el metodo this.gameLoop al ticker.
    //es decir: en cada frame vamos a ejecutar el metodo this.gameLoop
    this.pixiApp.ticker.add(this.gameLoop.bind(this));

    this.ejecutarCodigoDespuesDeIniciarPIXI();

    console.log(this.personas);
  }

  //Configuraciones de pixi --------
  renombrarEscenario(nuevoNombre) {
    this.pixiApp.stage.name = nuevoNombre;
  }

  async cargarTexturas(stringLocalizacionTextura) {
    const unaTextura = await PIXI.Assets.load(stringLocalizacionTextura);
    return unaTextura;
  }

  async crear_Personajes(numeroDePersonas) {
    const textura = await this.cargarTexturas("img/personaje.json");
    const x = 0.5 * this.anchoPantalla;
    const y = 0.5 * this.altoPantalla;
    const juego = this;
    for (let i = 0; i < numeroDePersonas; i++) {
      //Crea una instancia de clase que elijamos, el constructor de dicha clase toma como parametros la textura q queremos usar, X, Y y una referencia a la instancia del juego (la que sería this ya que estamos dentro de la clase Juego)
      this.personas.push(new Persona(textura, x, y, juego));
    }
    this.asignarEventosAPersonas();
  }

  ejecutarCodigoDespuesDeIniciarPIXI() {
    this.agregarInteractividadDelMouse();
  }

  //Cierra configuraciones de pixi --------

  asignarEventosAPersonas(){
    this.asignarElMouseComoTargetATodosLasPersonas()
    // this.asignarPerseguidorRandomATodos();
    // this.asignarTargets();
  }

  agregarInteractividadDelMouse() {
    // Escuchar el evento mousemove
    this.pixiApp.canvas.onmousemove = (event) => {
      this.mouse.posicion = { x: event.x, y: event.y };
    };
  }

  gameLoop(time) {
    for (let unaPersona of this.personas) {
      //ejecutamos el metodo tick de persona
      unaPersona.tick();
      unaPersona.render();
    }
  }

  getPersonaRandom() {
    return this.personas[Math.floor(this.personas.length * Math.random())];
  }

  asignarTargets() {
    for (let cone of this.personas) {
      cone.asignarTarget(this.getPersonaRandom());
    }
  }

  asignarElMouseComoTargetATodosLasPersonas() {
    for (let persona of this.personas) {
      persona.asignarTarget(this.mouse);
      console.log("Asignao");
    }
  }

  asignarPerseguidorRandomATodos() {
    for (let cone of this.personas) {
      cone.perseguidor = this.getPersonaRandom();
    }
  }
  asignarElMouseComoPerseguidorATodosLasPersonas() {
    for (let cone of this.personas) {
      cone.perseguidor = this.mouse;
    }
  }
}
