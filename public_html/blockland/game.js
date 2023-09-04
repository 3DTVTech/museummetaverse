class Game {
  constructor() {
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    this.modes = Object.freeze({
      NONE: Symbol("none"),
      PRELOAD: Symbol("preload"),
      INITIALISING: Symbol("initialising"),
      CREATING_LEVEL: Symbol("creating_level"),
      ACTIVE: Symbol("active"),
      GAMEOVER: Symbol("gameover"),
    });

    this.mode = this.modes.NONE;
    this.container;
    this.player;
    this.npc_01 = {};
    this.npc_02 = {};
    this.old_lady;
    this.women_anim;
    this.cameras;
    this.camera;
    this.controls;
    this.scene;
    this.map01;
    this.map02;
    this.map03;
    this.informatiionsAll = [];
    this.renderer;
    this.animations = {};
    this.assetsPath = "assets/";

    this.remotePlayers = [];
    this.remoteColliders = [];
    this.initialisingPlayers = [];
    this.remoteData = [];

    this.messages = {
      text: ["Welcome to Blockland", "GOOD LUCK!"],
      index: 0,
    };
    this.container = document.createElement("div");

    this.container = document.createElement("div");
    this.container.style.height = "100%";
    document.body.appendChild(this.container);

    const game = this;
    this.anims = [
      "Walking",
      "Walking_Backward",
      "Turning",
      "Run",
      "Pointing",
      "Talking",
      "Pointing Gesture",
    ];

    const options = {
      assets: [
        `${this.assetsPath}images/nx.jpg`,
        `${this.assetsPath}images/px.jpg`,
        `${this.assetsPath}images/ny.jpg`,
        `${this.assetsPath}images/py.jpg`,
        `${this.assetsPath}images/nz.jpg`,
        `${this.assetsPath}images/pz.jpg`,
      ],
      oncomplete: function () {
        game.init();
      },
    };

    this.anims.forEach(function (anim) {
      options.assets.push(`${game.assetsPath}fbx/anims/${anim}.fbx`);
    });
    // options.assets.push(`${game.assetsPath}fbx/Map_SSS_02.fbx`);

    this.mode = this.modes.PRELOAD;

    $("#map02").click(function () {
      // ปัจจุบัน
      let map2 = game.envmap02;
      let map3 = game.envmap03;
      let old_lady = game.Old_lady;
      let women_anim = game.Women_anim;
      let removeMap = game.scene.children.find(
        (item) => item.uuid == map2.uuid
      );
      if (removeMap != undefined) {
        let index = game.scene.children.indexOf(removeMap);
        if (index != -1) {
          game.scene.remove(map2);
        }
      }

      removeMap = game.scene.children.find((item) => item.uuid == map3.uuid);
      if (removeMap != undefined) {
        let index = game.scene.children.indexOf(removeMap);
        if (index != -1) {
          game.scene.remove(map3);
        }
      }

      removeMap = game.scene.children.find(
        (item) => item.uuid == women_anim.uuid
      );
      if (removeMap != undefined) {
        let index = game.scene.children.indexOf(removeMap);
        if (index != -1) {
          game.scene.remove(women_anim);
        }
      }

      game.scene.add(game.envmap01);
      game.scene.add(old_lady);
    });
    $("#map01").click(function () {
      // อยุธยา
      let map1 = game.envmap01;
      let map3 = game.envmap03;
      let old_lady = game.Old_lady;
      let women_anim = game.Women_anim;
      let removeMap = game.scene.children.find(
        (item) => item.uuid == map1.uuid
      );
      if (removeMap != undefined) {
        let index = game.scene.children.indexOf(removeMap);
        if (index != -1) {
          game.scene.remove(map1);
        }
      }
      removeMap = game.scene.children.find((item) => item.uuid == map3.uuid);
      if (removeMap != undefined) {
        let index = game.scene.children.indexOf(removeMap);
        if (index != -1) {
          game.scene.remove(map3);
        }
      }
      removeMap = game.scene.children.find(
        (item) => item.uuid == old_lady.uuid
      );
      if (removeMap != undefined) {
        let index = game.scene.children.indexOf(removeMap);
        if (index != -1) {
          game.scene.remove(old_lady);
        }
      }

      game.scene.add(game.envmap02);
      game.scene.add(women_anim);
    });

    $("#map03").click(function () {
      // 2548
      let map1 = game.envmap01;
      let map2 = game.envmap02;
      let old_lady = game.Old_lady;
      let women_anim = game.Women_anim;
      let removeMap = game.scene.children.find(
        (item) => item.uuid == map1.uuid
      );
      if (removeMap != undefined) {
        let index = game.scene.children.indexOf(removeMap);
        if (index != -1) {
          game.scene.remove(map1);
        }
      }
      removeMap = game.scene.children.find((item) => item.uuid == map2.uuid);
      if (removeMap != undefined) {
        let index = game.scene.children.indexOf(removeMap);
        if (index != -1) {
          game.scene.remove(map2);
        }
      }
      removeMap = game.scene.children.find(
        (item) => item.uuid == old_lady.uuid
      );
      if (removeMap != undefined) {
        let index = game.scene.children.indexOf(removeMap);
        if (index != -1) {
          game.scene.remove(old_lady);
        }
      }

      game.scene.add(game.envmap03);
      game.scene.add(women_anim);
    });

    this.clock = new THREE.Clock();

    const preloader = new Preloader(options);

    window.onError = function (error) {
      console.error(JSON.stringify(error));
    };
  }

  set activeCamera(object) {
    this.cameras.active = object;
  }

  init() {
    this.mode = this.modes.INITIALISING;
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      10,
      200000
    );

    this.camera.position.set(5000, 4000, -5000);
    // this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 200000 );

    this.scene = new THREE.Scene();
    let lightAm = new THREE.AmbientLight(0x404040, 3);
    this.scene.add(lightAm);

    let lightHem = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.8);
    let lightHemhlp = new THREE.HemisphereLightHelper(lightHem, 0.8);
    let lightdi = new THREE.DirectionalLight(0xffffff, 1);

    this.scene.add(lightHemhlp);

    lightdi.position.set(0, 5000, 2000);
    lightdi.target.position.set(0, 0, 0);

    lightdi.castShadow = true;
    lightdi.shadow.camera.far = 6000;
    lightdi.shadow.camera.top = 4000;
    lightdi.shadow.camera.bottom = -10000;
    lightdi.shadow.camera.left = -7000;
    lightdi.shadow.camera.right = 7000;
    lightdi.shadow.mapSize.width = 10000;
    lightdi.shadow.mapSize.height = 10000;
    this.scene.add(lightdi);

    // const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
    // lightCameraHelper.visible = true;
    // this.scene.add(lightCameraHelper);

    // model
    const loader = new THREE.FBXLoader();
    const GLBloader = new THREE.GLTFLoader();

    const game = this;

    this.player = new PlayerLocal(this);

    this.loadEnvironment(loader, GLBloader);
    this.loadNextAnim(loader);

    this.npc01(loader);
    this.npc02(GLBloader);
    this.information01();

    this.speechBubble = new SpeechBubble(this, "", 150);
    this.speechBubble.mesh.position.set(0, 350, 0);
    // this.speechBubble = new SpeechBubble(this, "", 150);
    // this.speechBubble.mesh.position.set(0, 350, 0);

    this.joystick = new JoyStick({
      onMove: this.playerControl,
      game: this,
    });
    //   console.log(this.joystick);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // this.controls = new THREE.OrbitControls();
    // // this.camera,
    // // this.renderer.domElement
    // this.controls.target.set(0, 150, 0);
    // this.controls.update();

    if ("ontouchstart" in window) {
      window.addEventListener(
        "touchdown",
        (event) => game.onMouseDown(event),
        false
      );
    } else {
      window.addEventListener(
        "mousedown",
        (event) => game.onMouseDown(event),
        false
      );
    }

    window.addEventListener("touchstart", raycastTouch);
    window.addEventListener("click", raycastMouseClick);
    window.addEventListener("resize", () => game.onWindowResize(), false);

    function raycastTouch(e) {
      game.onTouch = true;
      raycast(e);
    }

    function raycastMouseClick(e) {
      game.onTouch = false;
      raycast(e);
    }

    function raycast(e) {
      if (e === undefined) return;

      const raycaster = new THREE.Raycaster();
      const mouse = { x: 0, y: 0 };

      if (game.onTouch == true) {
        mouse.x =
          (e.changedTouches[0].clientX / game.renderer.domElement.clientWidth) *
            2 -
          1;
        mouse.y =
          -(
            e.changedTouches[0].clientY / game.renderer.domElement.clientHeight
          ) *
            2 +
          1;
      } else {
        mouse.x = (e.clientX / game.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / game.renderer.domElement.clientHeight) * 2 + 1;
      }

      raycaster.setFromCamera(mouse, game.camera);
      console.log(raycaster);

      if (game.informatiionsAll != undefined) {
        const intersectinfor = raycaster.intersectObjects(
          game.informatiionsAll
        );
        console.log(intersectinfor);

        if (intersectinfor.length > 0) {
          if (intersectinfor[0].object.name.toLowerCase().includes("info01")) {
            console.log("information");
            console.log(intersectinfor);
            $("#myModal").modal("show");
            return;
          }
        }
      } else {
        console.log("information not found.");
      }
    }
  }

  loadEnvironment(loader, GLBloader) {
    const game = this;

    var colliders = [];

    GLBloader.load(`${this.assetsPath}fbx/Plan_test03.glb`, function (gltf) {
      let map = gltf.scene;
      game.envmap01 = map;
      game.scene.add(map);
      map.position.set(500, 10, 7000);
      map.scale.set(300, 300, 300);

      map.traverse(function (gltf) {
        if (gltf.isMesh) {
          if (gltf.name.startsWith("proxy")) {
            console.log(gltf);
            colliders.push(gltf);
            gltf.material.visible = false;
            gltf.material.wireframe = false;
          } else {
            gltf.castShadow = true;
            gltf.receiveShadow = true;
          }
        }
      });

      const tloader = new THREE.CubeTextureLoader();
      tloader.setPath(`${game.assetsPath}/images/`);

      var textureCube = tloader.load([
        "px.png",
        "nx.png",
        "py.png",
        "ny.png",
        "pz.png",
        "nz.png",
      ]);

      game.scene.background = textureCube;
    });

    // GLBloader.load(`${this.assetsPath}fbx/Fort.glb`, function (gltf) {
    //   let map = gltf.scene;
    //   game.envmap02 = map;
    //   map.position.set(-100, -35, 5000);
    //   map.scale.set(80, 80, 80);

    //   map.traverse(function (gltf) {
    //     if (gltf.isMesh) {
    //       if (gltf.name.startsWith("proxy")) {
    //         colliders.push(gltf);
    //         gltf.material.visible = false;
    //         gltf.material.wireframe = false;
    //       } else {
    //         gltf.castShadow = true;
    //         gltf.receiveShadow = true;
    //       }
    //     }
    //   });
    // });
    // GLBloader.load(
    //   `${this.assetsPath}fbx/MuseumSiam06_2548.glb`,
    //   function (gltf) {
    //     let map = gltf.scene;
    //     game.envmap03 = map;
    //     map.position.set(-100, -35, 5000);
    //     map.scale.set(80, 80, 80);

    //     map.traverse(function (gltf) {
    //       if (gltf.isMesh) {
    //         if (gltf.name.startsWith("proxy")) {
    //           colliders.push(gltf);
    //           gltf.material.visible = false;
    //           gltf.material.wireframe = false;
    //         } else {
    //           gltf.castShadow = true;
    //           gltf.receiveShadow = true;
    //         }
    //       }
    //     });
    //   }
    // );
  }

  loadNextAnim(loader) {
    let anim = this.anims.pop();
    const game = this;
    loader.load(`${this.assetsPath}fbx/anims/${anim}.fbx`, function (object) {
      game.player.animations[anim] = object.animations[0];
      if (game.anims.length > 0) {
        game.loadNextAnim(loader);
      } else {
        delete game.anims;
        game.action = "Idle";
        game.mode = game.modes.ACTIVE;
        game.animate();
      }
    });
  }
  npc01(loader) {
    const game = this;
    loader.load(`${this.assetsPath}fbx/people/Old_Lady.fbx`, function (object) {
      game.Old_lady = object;
      console.log(game.Old_lady);
      object.mixer = new THREE.AnimationMixer(object);

      game.npc_01.mixer = object.mixer;
      game.npc_01.root = object.mixer.getRoot();

      object.name = "Old_Lady";

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = false;
        }
      });

      game.scene.add(object);
      game.npc_01.object = object;
      game.npc_01.mixer.clipAction(object.animations[0]).play();
      game.animate();

      object.position.set(-100, 10, 7000);
      object.scale.set(4.3, 4.3, 4.3);
    });
  }

  npc02(GLBloader) {
    const game = this;

    let colliders = [];

    GLBloader.load(
      `${this.assetsPath}fbx/people/Women_anim.glb`,
      // `${this.assetsPath}fbx/people/Women_anim.glb`,
      function (gltf) {
        let object = gltf.scene;
        console.log(gltf);
        game.Women_anim = object;
        object.mixer = new THREE.AnimationMixer(object);

        object.name = "Women_anim";
        game.npc_02.object = object;

        game.scene.add(object);

        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        if (gltf.animations.length > 0) {
          game.npc_02.mixer = object.mixer;
          game.npc_02.root = object.mixer.getRoot();
          game.npc_02.mixer.clipAction(gltf.animations[2]).play();
        }

        object.position.set(-100, 10, 7000);
        object.scale.set(4.3, 4.3, 4.3);

        // object.position.set(1000, 10, 7000);
        // object.scale.set(150, 150, 150);
      }
    );
  }

  information01() {
    const game = this;
    const btn_modal = document.getElementById("modalbt01");

    const geometry = new THREE.PlaneGeometry(200, 200);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(1500, 100, 7000);
    sphere.name = "info01";
    game.scene.add(sphere);

    game.informatiionsAll.push(sphere);
    console.log(game.informatiionsAll);
    const loader = new THREE.TextureLoader();
    loader.load(
      // resource URL
      `assets/image/info_300.png`,

      // onLoad callback
      function (texture) {
        // in this example we create the material when the texture is loaded
        const img = texture.image;
        sphere.material.map = texture;
        sphere.material.transparent = true;
        sphere.material.needsUpdate = true;
      },

      undefined,

      function (err) {
        console.error("An error happened.");
      }
    );
  }

  playerControl(forward, turn) {
    turn = -turn;

    if (forward > 0.3) {
      if (this.player.action != "Walking" && this.player.action != "Run")
        this.player.action = "Walking";
    } else if (forward < -0.3) {
      if (this.player.action != "Walking_Backward")
        this.player.action = "Walking_Backward";
    } else {
      forward = 0;
      if (Math.abs(turn) > 0.1) {
        if (this.player.action != "Turning") this.player.action = "Turning";
      } else if (this.player.action != "Idle") {
        this.player.action = "Idle";
      }
    }

    if (forward == 0 && turn == 0) {
      delete this.player.motion;
    } else {
      this.player.motion = { forward, turn };
    }

    this.player.updateSocket();
  }

  createCameras() {
    const offset = new THREE.Vector3(0, 80, 0);
    const front = new THREE.Object3D();
    front.position.set(112, 100, 600);
    front.parent = this.player.object;
    const back = new THREE.Object3D();
    back.position.set(0, 350, -800);
    back.parent = this.player.object;
    const chat = new THREE.Object3D();
    chat.position.set(0, 200, -450);
    chat.parent = this.player.object;
    const wide = new THREE.Object3D();
    wide.position.set(178, 139, 1665);
    wide.parent = this.player.object;
    const overhead = new THREE.Object3D();
    overhead.position.set(0, 400, 0);
    overhead.parent = this.player.object;
    const collect = new THREE.Object3D();
    collect.position.set(40, 82, 94);
    collect.parent = this.player.object;
    this.cameras = { front, back, wide, overhead, collect, chat };
    this.activeCamera = this.cameras.back;
  }

  showMessage(msg, fontSize = 20, onOK = null) {
    const txt = document.getElementById("message_text");
    txt.innerHTML = msg;
    txt.style.fontSize = fontSize + "px";
    const btn = document.getElementById("message_ok");
    const panel = document.getElementById("message");
    const game = this;
    if (onOK != null) {
      btn.onclick = function () {
        panel.style.display = "none";
        onOK.call(game);
      };
    } else {
      btn.onclick = function () {
        panel.style.display = "none";
      };
    }
    panel.style.display = "flex";
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateRemotePlayers(dt) {
    if (
      this.remoteData === undefined ||
      this.remoteData.length == 0 ||
      this.player === undefined ||
      this.player.id === undefined
    )
      return;

    const newPlayers = [];
    const game = this;
    //Get all remotePlayers from remoteData array
    const remotePlayers = [];
    const remoteColliders = [];

    this.remoteData.forEach(function (data) {
      if (game.player.id != data.id) {
        //Is this player being initialised?
        let iplayer;
        game.initialisingPlayers.forEach(function (player) {
          if (player.id == data.id) iplayer = player;
        });
        //If not being initialised check the remotePlayers array
        if (iplayer === undefined) {
          let rplayer;
          game.remotePlayers.forEach(function (player) {
            if (player.id == data.id) rplayer = player;
          });
          if (rplayer === undefined) {
            //Initialise player
            game.initialisingPlayers.push(new Player(game, data));
          } else {
            //Player exists
            remotePlayers.push(rplayer);
            remoteColliders.push(rplayer.collider);
          }
        }
      }
    });

    this.scene.children.forEach(function (object) {
      if (
        object.userData.remotePlayer &&
        game.getRemotePlayerById(object.userData.id) == undefined
      ) {
        game.scene.remove(object);
      }
    });

    this.remotePlayers = remotePlayers;
    this.remoteColliders = remoteColliders;
    this.remotePlayers.forEach(function (player) {
      player.update(dt);
    });
  }

  onMouseDown(event) {
    if (
      this.remoteColliders === undefined ||
      this.remoteColliders.length == 0 ||
      this.speechBubble === undefined ||
      this.speechBubble.mesh === undefined
    )
      return;

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects(this.remoteColliders);
    const chat = document.getElementById("chat");

    if (intersects.length > 0) {
      const object = intersects[0].object;
      const players = this.remotePlayers.filter(function (player) {
        if (player.collider !== undefined && player.collider == object) {
          return true;
        }
      });
      if (players.length > 0) {
        const player = players[0];
        console.log(`onMouseDown: player ${player.id}`);
        this.speechBubble.player = player;
        this.speechBubble.update("");
        this.scene.add(this.speechBubble.mesh);
        this.chatSocketId = player.id;
        chat.style.bottom = "0px";
        this.activeCamera = this.cameras.chat;
      }
    } else {
      //Is the chat panel visible?
      if (
        chat.style.bottom == "0px" &&
        window.innerHeight - event.clientY > 40
      ) {
        console.log("onMouseDown: No player found");
        if (this.speechBubble.mesh.parent !== null)
          this.speechBubble.mesh.parent.remove(this.speechBubble.mesh);
        delete this.speechBubble.player;
        delete this.chatSocketId;
        chat.style.bottom = "-40px";
        this.activeCamera = this.cameras.back;
      } else {
        console.log("onMouseDown: typing");
      }
    }
  }

  getRemotePlayerById(id) {
    if (this.remotePlayers === undefined || this.remotePlayers.length == 0)
      return;

    const players = this.remotePlayers.filter(function (player) {
      if (player.id == id) return true;
    });

    if (players.length == 0) return;

    return players[0];
  }

  animate() {
    const game = this;
    const dt = this.clock.getDelta();

    requestAnimationFrame(function () {
      game.animate();
    });

    this.updateRemotePlayers(dt);

    if (this.player.mixer != undefined && this.mode == this.modes.ACTIVE)
      this.player.mixer.update(dt);

    if (this.player.action == "Walking") {
      const elapsedTime = Date.now() - this.player.actionTime;
      if (elapsedTime > 1000 && this.player.motion.forward > 0) {
        this.player.action = "Run";
      }
    }

    if (this.player.motion !== undefined) this.player.move(dt);

    if (
      this.cameras != undefined &&
      this.cameras.active != undefined &&
      this.player !== undefined &&
      this.player.object !== undefined
    ) {
      this.camera.position.lerp(
        this.cameras.active.getWorldPosition(new THREE.Vector3()),
        0.05
      );
      const pos = this.player.object.position.clone();
      if (this.cameras.active == this.cameras.chat) {
        pos.y += 200;
      } else {
        pos.y += 300;
      }
      this.camera.lookAt(pos);
    }
    if (this.npc_01.mixer !== undefined) this.npc_01.mixer.update(dt);
    if (this.npc_02.mixer !== undefined) this.npc_02.mixer.update(dt);

    if (this.sun !== undefined) {
      this.sun.position.copy(this.camera.position);
      this.sun.position.y += 10;
    }

    if (this.speechBubble !== undefined)
      this.speechBubble.show(this.camera.position);

    this.renderer.render(this.scene, this.camera);
  }
}

class Player {
  constructor(game, options) {
    this.local = true;
    let model, colour;

    const colours = ["Black", "Brown", "White"];
    colour = colours[Math.floor(Math.random() * colours.length)];

    if (options === undefined) {
      // const people = ['Male_Idle','BeachBabe', 'BusinessMan', 'Doctor', 'FireFighter', 'Housewife', 'Policeman', 'Prostitute', 'Punk', 'RiotCop', 'Roadworker', 'Robber', 'Sheriff', 'Streetman', 'Waitress' , 'MALE_SSS'];
      const people = ["Male_purple", "Male_Idle", "Male_yellow"];
      // const people = ["Male_Idle"];
      model = people[Math.floor(Math.random() * people.length)];
    } else if (typeof options == "object") {
      this.local = false;
      this.options = options;
      this.id = options.id;
      model = options.model;
      colour = options.colour;
    } else {
      model = options;
    }
    this.model = model;
    this.colour = colour;
    this.game = game;
    this.animations = this.game.animations;

    const loader = new THREE.FBXLoader();
    const player = this;

    loader.load(`${game.assetsPath}fbx/people/${model}.fbx`, function (object) {
      object.mixer = new THREE.AnimationMixer(object);
      player.root = object;
      player.mixer = object.mixer;

      object.name = "Person";

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        `${game.assetsPath}images/SimplePeople_${model}_${colour}.png`,
        function (texture) {
          object.traverse(function (child) {
            if (child.isMesh) {
              child.material.map = texture;
            }
          });
        }
      );

      player.object = new THREE.Object3D();
      player.object.position.set(1, 10, 8000);
      player.object.rotation.set(0, 2.6, 0);
      // player.object.scale.set(0.5,0.5, 0.5);

      player.object.add(object);
      if (player.deleted === undefined) game.scene.add(player.object);

      if (player.local) {
        game.createCameras();
        // game.sun.target = game.player.object;
        game.animations.Idle = object.animations[0];
        if (player.initSocket !== undefined) player.initSocket();
      } else {
        const geometry = new THREE.BoxGeometry(100, 300, 100);
        const material = new THREE.MeshBasicMaterial({ visible: false });
        const box = new THREE.Mesh(geometry, material);
        box.name = "Collider";
        box.position.set(0, 150, 0);
        player.object.add(box);
        player.collider = box;
        player.object.userData.id = player.id;
        player.object.userData.remotePlayer = true;
        const players = game.initialisingPlayers.splice(
          game.initialisingPlayers.indexOf(this),
          1
        );
        game.remotePlayers.push(players[0]);
      }

      if (game.animations.Idle !== undefined) player.action = "Idle";
    });
  }

  set action(name) {
    //Make a copy of the clip if this is a remote player
    if (this.actionName == name) return;
    const clip = this.local
      ? this.animations[name]
      : THREE.AnimationClip.parse(
          THREE.AnimationClip.toJSON(this.animations[name])
        );
    const action = this.mixer.clipAction(clip);
    action.time = 0;
    this.mixer.stopAllAction();
    this.actionName = name;
    this.actionTime = Date.now();

    action.fadeIn(0.5);
    action.play();
  }

  get action() {
    return this.actionName;
  }

  update(dt) {
    this.mixer.update(dt);

    if (this.game.remoteData.length > 0) {
      let found = false;
      for (let data of this.game.remoteData) {
        if (data.id != this.id) continue;
        //Found the player
        this.object.position.set(data.x, data.y, data.z);
        const euler = new THREE.Euler(data.pb, data.heading, data.pb);
        this.object.quaternion.setFromEuler(euler);
        this.action = data.action;
        found = true;
      }
      if (!found) this.game.removePlayer(this);
    }
  }
}

class PlayerLocal extends Player {
  constructor(game, model) {
    super(game, model);

    const player = this;
    const socket = io.connect();
    socket.on("setId", function (data) {
      player.id = data.id;
    });
    socket.on("remoteData", function (data) {
      game.remoteData = data;
    });
    socket.on("deletePlayer", function (data) {
      const players = game.remotePlayers.filter(function (player) {
        if (player.id == data.id) {
          return player;
        }
      });
      if (players.length > 0) {
        let index = game.remotePlayers.indexOf(players[0]);
        if (index != -1) {
          game.remotePlayers.splice(index, 1);
          game.scene.remove(players[0].object);
        }
      } else {
        index = game.initialisingPlayers.indexOf(data.id);
        if (index != -1) {
          const player = game.initialisingPlayers[index];
          player.deleted = true;
          game.initialisingPlayers.splice(index, 1);
        }
      }
    });

    socket.on("chat message", function (data) {
      document.getElementById("chat").style.bottom = "0px";
      const player = game.getRemotePlayerById(data.id);
      game.speechBubble.player = player;
      game.chatSocketId = player.id;
      game.activeCamera = game.cameras.chat;
      game.speechBubble.update(data.message);
    });

    $("#msg-form").submit(function (e) {
      socket.emit("chat message", {
        id: game.chatSocketId,
        message: $("#m").val(),
      });
      $("#m").val("");
      return false;
    });

    this.socket = socket;
  }
  initSocket() {
    this.socket.emit("init", {
      model: this.model,
      colour: this.colour,
      x: this.object.position.x,
      y: this.object.position.y,
      z: this.object.position.z,
      h: this.object.rotation.y,
      pb: this.object.rotation.x,
    });
  }
  updateSocket() {
    if (this.socket !== undefined) {
      this.socket.emit("update", {
        x: this.object.position.x,
        y: this.object.position.y,
        z: this.object.position.z,
        h: this.object.rotation.y,
        pb: this.object.rotation.x,
        action: this.action,
      });
    }
  }
  move(dt) {
    const pos = this.object.position.clone();
    pos.y += 60;
    let dir = new THREE.Vector3();
    this.object.getWorldDirection(dir);
    if (this.motion.forward < 0) dir.negate();
    let raycaster = new THREE.Raycaster(pos, dir);
    let blocked = false;
    const colliders = this.game.colliders;
    if (colliders !== undefined) {
      const intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        if (intersect[0].distance < 50) blocked = true;
      }
    }

    if (!blocked) {
      if (this.motion.forward > 0) {
        const speed = this.action == "Run" ? 500 : 150;
        this.object.translateZ(dt * speed);
      } else {
        this.object.translateZ(-dt * 150);
      }
    }

    if (colliders !== undefined) {
      //cast left
      dir.set(-1, 0, 0);
      dir.applyMatrix4(this.object.matrix);
      dir.normalize();
      raycaster = new THREE.Raycaster(pos, dir);

      let intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        if (intersect[0].distance < 50)
          this.object.translateX(100 - intersect[0].distance);
      }

      //cast right
      dir.set(1, 0, 0);
      dir.applyMatrix4(this.object.matrix);
      dir.normalize();
      raycaster = new THREE.Raycaster(pos, dir);

      intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        if (intersect[0].distance < 50)
          this.object.translateX(intersect[0].distance - 100);
      }

      //cast down
      dir.set(0, -1, 0);
      pos.y += 200;
      raycaster = new THREE.Raycaster(pos, dir);
      const gravity = 30;

      intersect = raycaster.intersectObjects(colliders);
      if (intersect.length > 0) {
        const targetY = pos.y - intersect[0].distance;
        if (targetY > this.object.position.y) {
          //Going up
          this.object.position.y = 0.8 * this.object.position.y + 0.2 * targetY;
          this.velocityY = 0;
        } else if (targetY < this.object.position.y) {
          //Falling
          if (this.velocityY == undefined) this.velocityY = 0;
          this.velocityY += dt * gravity;
          this.object.position.y -= this.velocityY;
          if (this.object.position.y < targetY) {
            this.velocityY = 0;
            this.object.position.y = targetY;
          }
        }
      }
    }
    this.object.rotateY(this.motion.turn * dt);

    this.updateSocket();
  }
}

class SpeechBubble {
  constructor(game, msg, size = 1) {
    this.config = {
      font: "Calibri",
      size: 24,
      padding: 10,
      colour: "#222",
      width: 256,
      height: 256,
    };

    const planeGeometry = new THREE.PlaneGeometry(size, size);
    const planeMaterial = new THREE.MeshBasicMaterial();
    this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    game.scene.add(this.mesh);

    const self = this;
    const loader = new THREE.TextureLoader();
    loader.load(
      // resource URL
      `${game.assetsPath}images/speech.png`,

      // onLoad callback
      function (texture) {
        // in this example we create the material when the texture is loaded
        self.img = texture.image;
        self.mesh.material.map = texture;
        self.mesh.material.transparent = true;
        self.mesh.material.needsUpdate = true;
        if (msg !== undefined) self.update(msg);
      },

      undefined,

      function (err) {
        console.error("An error happened.");
      }
    );
  }
  update(msg) {
    if (this.mesh === undefined) return;

    let context = this.context;

    if (this.mesh.userData.context === undefined) {
      const canvas = this.createOffscreenCanvas(
        this.config.width,
        this.config.height
      );
      this.context = canvas.getContext("2d");
      context = this.context;
      context.font = `${this.config.size}pt ${this.config.font}`;
      context.fillStyle = this.config.colour;
      context.textAlign = "center";
      this.mesh.material.map = new THREE.CanvasTexture(canvas);
    }

    const bg = this.img;
    context.clearRect(0, 0, this.config.width, this.config.height);
    context.drawImage(
      bg,
      0,
      0,
      bg.width,
      bg.height,
      0,
      0,
      this.config.width,
      this.config.height
    );
    this.wrapText(msg, context);

    this.mesh.material.map.needsUpdate = true;
  }

  createOffscreenCanvas(w, h) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    return canvas;
  }

  wrapText(text, context) {
    const words = text.split(" ");
    let line = "";
    const lines = [];
    const maxWidth = this.config.width - 2 * this.config.padding;
    const lineHeight = this.config.size + 8;

    words.forEach(function (word) {
      const testLine = `${line}${word} `;
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth) {
        lines.push(line);
        line = `${word} `;
      } else {
        line = testLine;
      }
    });

    if (line != "") lines.push(line);

    let y = (this.config.height - lines.length * lineHeight) / 2;

    lines.forEach(function (line) {
      context.fillText(line, 128, y);
      y += lineHeight;
    });
  }

  show(pos) {
    if (this.mesh !== undefined && this.player !== undefined) {
      this.mesh.position.set(
        this.player.object.position.x,
        this.player.object.position.y + 380,
        this.player.object.position.z
      );
      this.mesh.lookAt(pos);
    }
  }
}
