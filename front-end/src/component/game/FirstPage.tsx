import * as THREE from 'three';
import { FBXLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import './style/playersInfo.css'
import { Socket } from 'socket.io-client';
import { Navigate } from 'react-router-dom';
import { GLTF } from 'three/examples/jsm/Addons.js';

interface props{
	infos : string[];
    mode : string;
	socket : Socket;
};

export class Player
{
	constructor(name :any, goals : any)
	{
		this.raquete = undefined;
		this.goals = goals;
		this.name = name;
	}
	raquete : any;
	goals : any;
	name : any;
}
let i = 0;


function FirstPage({infos , mode, socket} : props){
			if (i == 1){
				return ;
			}
			i++;
			let tableWidth : number;
			let tableHeight: number;
			let p2Speed =  2;
			let p1Speed = -2;
			let camera:any, scene:any, renderer:any;
			let initclientX = window.innerWidth / 2;
			let initClientY = window.innerHeight / 2;
			let index : number;
			
			scene = new THREE.Scene();
			renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
			renderer.setClearColor(0x000000, 0); 
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.shadowMap.enabled = true;
			const root = document.getElementById('root');
			const container = document.createElement('div');
			container.id = 'player-info'; 
			container.style.position = 'absolute';
			container.style.top = '0px';
			container.style.left = '0px';
			container.style.padding = '10px';
			const player1Info = document.createElement('div');
			const player2Info = document.createElement('div');
			const player1Name = document.createElement('a');
			const player2Name = document.createElement('a');
			const player1Img = document.createElement('img');
			const player2Img = document.createElement('img');
			const player1Score = document.createElement('span');
			const player2Score = document.createElement('span');
			const scoreInfo = document.createElement('div');
			const exit = document.createElement('button');
			const starting = document.createElement('div');
			
			// const htmlContent = `<div id="starting" style="background-image: url('https://www.couleurdenuit.com/img/cms/Match-de-ping-pong-23.jpg'); background-size: cover; background-position: center; display: flex; justify-content: center; align-items: center; min-height: 100vh;"><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"></head><div style="margin-left: 50px; padding-bottom: 100px;"><span class="spinner-grow spinner-grow-sm" style="margin-bottom: 100px; margin-right: 150px; font-size: 250%; color: #DB8C1B;">Waiting...</span><div class="spinner-border" style="color: #DB8C1B; width: 3rem; height: 3rem;" role="status"></div><button id="exit-button">Exit</button>`;
			// starting.innerHTML = htmlContent;
			// starting.style.pointerEvents = 'none';
			exit.id = 'exit-button';
			exit.innerText = "Exit";
			exit.onclick = () => {
				window.location.reload();
			}
			container.style.pointerEvents = 'none';
			if (mode == 'online'){
				player1Score.id = "player1-score";
				player2Score.id = "player2-score";
				player1Score.innerText = "0";
				player2Score.innerText = "0";

				scoreInfo.append(player1Score);
				scoreInfo.append(player2Score);

				scoreInfo.id = "score-info"
				container.append(scoreInfo);
				player1Img.src = infos[2];
				player2Img.src = infos[3];
				player1Name.innerText = infos[0];

				player1Info.appendChild(player1Name)
				player1Info.appendChild(player1Img)

				player1Info.id = 'player1-info';
				player2Name.innerText = infos[1];

				player2Info.appendChild(player2Name);
				player2Info.appendChild(player2Img);

				player2Info.id = 'player2-info';

				container.appendChild(player1Info);
				container.appendChild(player2Info);
			}
			if (root) {
				root.appendChild(renderer.domElement);
				root.appendChild(container);
				root.appendChild(exit);
				// root.appendChild(starting);

			} else {
				console.log("Element with ID 'root' not found.");
			}
			camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
			camera.position.set(
				0,
				70,
				-200 );
			camera.lookAt(0, 50, -100);


			const controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 100, 0 );
			controls.maxDistance = 400;
			controls.update();
			
			
			
			const	player1 = new Player(document.getElementById("player1Name"), 0);
			const	player2 = new Player(document.getElementById("player2Name"), 0);
			const	glbloader = new GLTFLoader();
			let		boundingBox : any;
			let		table : any;

			let ball = {
				dirX : 0,
				dirY : 0,
				moveY : -0.1,
				object : {position : { x: 0, y: 0, z: 0, }},
			}
			glbloader.load('src/component/game/assets/table.glb', (gltf)=>{
				table = gltf.scene;
				table.castShadow = true;
				table.scale.set(30, 30, 30);
				boundingBox = new THREE.Box3().setFromObject(table);
				tableWidth = (boundingBox?.max.x - boundingBox?.min.x);
				tableHeight = boundingBox?.max.z - boundingBox?.min.z;
				scene.add(table);
			})

			const clock = new THREE.Clock();
			let mixer:any;

			base();
			logic();

			function logic(){

				// scene.add(new THREE.AxesHelper(100))
				setTimeout(() =>{
					glbloader.load( 'src/component/game/assets/tennis_ball_blue.glb', function ( gltf : any ) {
					
						ball.object = gltf.scene;
						ball.object.position.y = 50;
						ball.object.position.z =  -(boundingBox?.max.z - boundingBox?.min.z) * 0.4;
						ball.object.position.x = 30;
						ball.object.scale.set(2, 2, 2);
						scene.add( ball.object );
							
					});
					// ball.object.position.y = 50;
					// ball.object.position.z =  -(boundingBox?.max.z - boundingBox?.min.z) * 0.4;
					// ball.object.position.x = 30;
					// ball.object.scale.set(20, 20, 20);
					// scene.add( ball.object );
					glbloader.load( 'src/component/game/assets/raquete.glb', function ( gltf : any ) {
					
						player1.raquete = gltf.scene;
						player1.raquete.scale.set(6, 6, 6);
						player1.raquete.position.set(0, 40, (boundingBox?.max.z - boundingBox?.min.z) * -0.5);
						scene.add( player1.raquete );
							
					});
					glbloader.load( 'src/component/game/assets/raquete.glb', function ( gltf : any ) {
					
						player2.raquete = gltf.scene;
						player2.raquete.scale.set(6, 6, 6);
						// boundingBox = new THREE.Box3().setFromObject(table);
				
						player2.raquete.position.set(0, 40, (boundingBox?.max.z - boundingBox?.min.z) * 0.5);
						scene.add( player2.raquete );
					});
				}, 1000)

				setTimeout(() => {
					starting.innerHTML = "";
				}, 4000);

				glbloader.load('src/component/game/assets/basketball_-_aizismus.glb', (gltf) => {

					gltf.scene.rotation.y = Math.PI / 2;
					gltf.scene.position.x = -1760;
					gltf.scene.position.z = 2435;
					// gltf.scene.position.y = -6000;
					gltf.scene.rotation.y -= Math.PI/2;

					// gltf.scene.scale.set(0.9, 0.9, 0.9);
					scene.add(gltf.scene);
				})

				renderer.domElement.addEventListener('mousemove', onMouseMove);

				let stepX = 0;
				let stepZ = -2;
				function onMouseMove(event : MouseEvent) {
						if (player1.raquete)// && !controls.enabled)
						{
							moveZ = (event.clientY - initClientY) / window.innerHeight * 120;
							stepX = (event.clientX - initclientX) / window.innerWidth * tableWidth*1.5 ; 
							player1.raquete.position.z -= moveZ;
							player1.raquete.position.x -=  stepX / 1.5;

							if (player1.raquete.position.x > 5)
								player1.raquete.rotation.z  = -Math.PI / 6;
							else if (player1.raquete.position.x < -5)
								player1.raquete.rotation.z  = Math.PI / 6;
							else
								player1.raquete.rotation.z  = 0;

							if (mode == 'online')
								socket.emit('PlayerMoves', [player1.raquete.position, player1.raquete.rotation, infos[0], index]);
							if (index == 1)
							{
								socket.emit('moveX', [infos[0] ,stepX]);
								socket.emit('moveZ', [infos[0] ,moveZ]);
								socket.emit('speed', [infos[0], event.clientY - initClientY]);
							}
							else{
								if (event.clientY - initClientY < -150){
									p1Speed =  -3;
									p1deltaT = 1 / 45;
									player1fp = (boundingBox.max.z - boundingBox.min.z) / 3.5;
								}
								else if (event.clientY - initClientY < -100){
									p1Speed =  -2.8;
									p1deltaT = 1 / 45;
									player1fp = (boundingBox.max.z - boundingBox.min.z) / 3.8;
								}
								else if (event.clientY - initClientY < -25){
									p1Speed =  -2.5;
									p1deltaT = 1 / 45;
									player1fp = (boundingBox.max.z - boundingBox.min.z) / 4;
								}
								else if (event.clientY - initClientY < -3){
									p1Speed =  -2.2;
									p1deltaT = 1 / 45;
									player1fp = (boundingBox.max.z - boundingBox.min.z) / 5;
								}
								else {
									p1Speed =  -1.7;
									p1deltaT = 1 / 46;
									player1fp = (boundingBox.max.z - boundingBox.min.z) / 6;
								}
							}
							initclientX = event.clientX ;
							initClientY = event.clientY;
						}

				}
				function	reset(){
					ball.object.position.y = 50;
					if (ball.object.position.x > maxX)
						ball.object.position.x = 35;
					if (ball.object.position.x < minX)
						ball.object.position.x = -35;

					if (mode == 'online'){
						if ((stepZ > 0 && lastFallingZ > 0) || (stepZ < 0 && !lastFallingZ)) {
							player1.goals++;
							player1Score.innerText = player1.goals;
						} else if ((stepZ < 0 && lastFallingZ < 0) || (stepZ > 0 && !lastFallingZ)) {
							player2.goals++;
							player2Score.innerText = player2.goals;
						}
						socket.emit('score', [player1.goals, player2.goals, infos[0]]);
						ball.object.position.z = -(boundingBox?.max.z - boundingBox?.min.z) * 0.4 *  (stepZ < 0 ? 1 : -1);
					}
					else
						ball.object.position.z = -(boundingBox?.max.z - boundingBox?.min.z) * 0.4;
					ball.dirX = 0;
					lastFallingZ = 0;
					stepZ  = 0;
					up = false;
					floorY = 45;
					deltaT = 1/50;
					p2deltaT = 1/50;
					p1deltaT = 1/50;
					touchNet = false;
					move = false;
					if (mode == "practice")
						player2.raquete.position.z = (boundingBox?.max.z - boundingBox?.min.z) * 0.5;
					if (player1.goals > 10 || player2.goals > 10){
						socket.emit('endGame',[player1.goals, player2.goals, infos[0]]);
					}
				}
					
				let maxZ : number;
				let minZ : number;
				let maxX : number;
				let minX : number;
				let moveX = 0;
				let moveZ = 0;
				let player1fp = (boundingBox?.max.z - boundingBox?.min.z) / 6;
				let player2fp = (boundingBox?.max.z - boundingBox?.min.z) / 6;

				let gravity = 9.8;
				let deltaT = 1/50;
				let p1deltaT = 1/50; 
				let p2deltaT = 1/50; 
				let up = false;
				let move = false;

				let factor = 10;
				function calculateStepY(){
					return ((-0.5 * gravity * Math.pow(deltaT, 2) - Math.abs(stepZ) * (deltaT)) * factor);
				}

				function touchRaquete(raqueteX : number, raqueteRotZ : number){
					if (ball.object.position.x <= 0 && raqueteX <= 0 && raqueteRotZ == 0)
						return((Math.abs(ball.object.position.x - raqueteX)) < 14 ? true : false);
					else if (ball.object.position.x <= 0 && raqueteX <= 0 && raqueteRotZ != 0)
						return((Math.abs(ball.object.position.x - (raqueteX - 7)) < 10) ? true : false);
					else if (ball.object.position.x >= 0 && raqueteX >= 0 && raqueteRotZ == 0)
						return((Math.abs(ball.object.position.x - raqueteX)) < 14 ? true : false);
					else if (ball.object.position.x >= 0 && raqueteX >= 0 && raqueteRotZ != 0)
						return((Math.abs(ball.object.position.x - (raqueteX + 7)) < 10) ? true : false);
					return(false);
				}

				let middle = 0;
				let falligPoint = (boundingBox?.max.z - boundingBox?.min.z) / 4;
				let floorY = 45;
				let touchNet = false;
				let lastFallingZ = 0;
		function animate() {
				if (index == undefined && mode == 'online')
					socket.emit('index', infos[0]);
				if (tableHeight && !maxZ){
					maxZ = tableHeight / 2;
					minZ = tableHeight / -2;
					maxX = tableWidth / 2.5;
					minX = tableWidth / -2.5;
				}
				if (ball.object && table && player1.raquete && player2.raquete && (index == 0 || mode == "practice"))
				{
						if (floorY != 0 &&  !touchNet && stepZ >= 0 && Math.abs(player2.raquete.position.z - ball.object.position.z) < 12 && touchRaquete(player2.raquete.position.x, player2.raquete.rotation.z))
						{
							falligPoint = player2fp;
							if (mode == "practice")
								falligPoint = (boundingBox.max.z - boundingBox.min.z) / 3.5;
							middle = ball.object.position.z - falligPoint;   
							stepZ = p2Speed;
							move = true;
							up = false; 
							stepZ *= -1;
							floorY = 45;
							ball.dirX += -moveX / 8;
							moveX = 0;
							deltaT = p2deltaT;
							lastFallingZ = 0;
							if (mode == "practice"){
								ball.dirX  = 0;
								player2.raquete.position.z -= (boundingBox.max.z - boundingBox.min.z) * 0.1;
								stepZ = -2;
							}
						}
						if (floorY != 0 && !touchNet && stepZ <= 0 && Math.abs(player1.raquete.position.z - ball.object.position.z) < 12 && touchRaquete(player1.raquete.position.x, player1.raquete.rotation.z))
						{
							falligPoint = player1fp;
							middle = ball.object.position.z + falligPoint;;
							stepZ = p1Speed;
							move = true;
							up = false;
							stepZ *= -1;
							floorY = 45;
							ball.dirX += -stepX / 8;
							stepX = 0;
							deltaT = p1deltaT;
							lastFallingZ = 0;
							if (mode == "practice")
								player2.raquete.position.z = (boundingBox.max.z - boundingBox.min.z) * 0.5;
						}
						if (ball.object.position.z > tableHeight * 3 || ball.object.position.z < tableHeight * -3){
							reset();
						}
						if (ball.object.position.z > maxZ*1.5 || ball.object.position.z < minZ*1.5 || ball.object.position.x > maxX || ball.object.position.x < minX)
							floorY = 0;
						ball.object.rotation.y += 0.15;

						if (move){
							ball.object.position.x += ball.dirX;
							ball.object.position.z += stepZ;

							if (!touchNet && Math.abs(ball.object.position.z) < 10 && ball.object.position.y < 50 && floorY  && (mode == "online" || stepZ > 0)){
								falligPoint = 0.1;
								middle = ball.object.position.z - falligPoint;;
								up = false;
								stepZ *= -1;
								touchNet = true;
							}
							if (ball.object.position.y > floorY && !up){
								if(ball.object.position.z < middle && stepZ > 0)
									ball.object.position.y -= calculateStepY();
								else if (ball.object.position.z  > middle && stepZ > 0)
									ball.object.position.y += calculateStepY();
								else if (ball.object.position.z < middle && stepZ < 0)
									ball.object.position.y += calculateStepY() ;
								else if (ball.object.position.z  > middle && stepZ < 0)
									ball.object.position.y -= calculateStepY();
							}
							else{
								ball.object.position.y -= calculateStepY();
								if (ball.object.position.y > floorY)
									up = false;
							}
							if (ball.object.position.y <= floorY){
								if (floorY != 0)
									lastFallingZ = ball.object.position.z;
								up = true;
								if (stepZ > 0)
									middle = ball.object.position.z + falligPoint / 1.2;
								else
									middle = ball.object.position.z - falligPoint / 1.2;
								deltaT = 1/50; 
							}
							
						}
						else{
							if (ball.object.position.y < 45)
								ball.moveY = 0.1;
							else if (ball.object.position.y > 55) 
								ball.moveY = -0.1;
							ball.object.position.y += ball.moveY;
						}
						if (mode == "practice" && floorY > 0){
							player2.raquete.position.x =  ball.object.position.x ;
						}
						}
						if (ball.object && mode == "online" && index == 0)
							socket.emit('data', [{x : ball.object.position.x, y : ball.object.position.y, z : ball.object.position.z}, infos[0]]);
						requestAnimationFrame( animate );
						renderer.render( scene, camera );

						const delta = clock.getDelta();

						if ( mixer ) mixer.update( delta );


				}
				document.addEventListener('mousedown', mouseDown);
				document.addEventListener('mouseup', mouseUp);

				function mouseUp(event : MouseEvent){
					if (controls)
						controls.enabled = true;
					if (player1.raquete)
						player1.raquete.rotation.x = 0;
				}

				
				function mouseDown(event : MouseEvent) {
					const mouse = new THREE.Vector2();
					mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
					mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
				
					const raycaster = new THREE.Raycaster();
					raycaster.setFromCamera(mouse, camera);

				
					if (player1 && player1.raquete) {
						const intersects = raycaster.intersectObject(player1.raquete);
						if (intersects.length > 0) {
							controls.enabled = false;
						}
					}
				}
				

				socket.on('data', (message : any)=> {
					if (index == 1 && ball.object){
						ball.object.position.x = message[0].x;
						ball.object.position.y = message[0].y;
						ball.object.position.z = -message[0].z;
					}
				})

				socket.on('moveX', (mx : number) => {
					moveX = mx;
				})

				socket.on('p2deltaT', (dt : number) =>{
					p2deltaT = dt;
				});

				socket.on('moveZ', (mz : number) => {
					player2.raquete.position.z -= mz;
				})

				socket.on('PlayerMoves', (pos : any, rot : any) => {
					player2.raquete.position.x = pos.x;
					player2.raquete.position.y = pos.y;
					player2.raquete.position.z = -pos.z;
					player2.raquete.rotation.copy(rot);
				})


				socket.on('index', (i) =>{
					index = i;
				})
				socket.on('speed', (spd) => {
					p2Speed = spd;
				})
				500
				
				socket.on('falligPoint', (fp) =>{
					player2fp = (boundingBox.max.z - boundingBox.min.z) / fp;
				});
				animate();
			}
			function base() {
				scene.background = new THREE.Color( 0x000000 );

				const hemiLight = new THREE.HemisphereLight( 0x999999, 0x999999, 5 );
				hemiLight.position.set( 0, 500, 0 );
				scene.add( hemiLight );

				const dirLight = new THREE.DirectionalLight( 0x999999, 5 );
				dirLight.position.set( 0, 500, 100 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.top = 180;
				dirLight.shadow.camera.bottom = - 100;
				dirLight.shadow.camera.left = - 120;
				dirLight.shadow.camera.right = 120;
				scene.add( dirLight );
				const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 4000, 4000 ), new THREE.MeshBasicMaterial( { color: 0x999999, depthWrite: false, side: THREE.DoubleSide}) );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );

				const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
				grid.material.opacity = 0.2;
				grid.material.transparent = true;
				scene.add( grid );

				const fbxloader = new FBXLoader();
				fbxloader.load( 'src/component/game/assets/people_freePack_webGl_ani.fbx', function ( object  : any) {
          
				mixer = new THREE.AnimationMixer( object );
		
				const action = mixer.clipAction( object.animations[ 0 ] );
				action.play();
				object.traverse( function ( child : any ) {
				if ( child.isMesh ) {
					child.castShadow = true;
					child.receiveShadow = true;
				}} );
				object.position.z = 100;
				object.position.x = 400 * (index == 0 ? -1 : 1);
				object.scale.set(0.5, 0.5, 0.5);
				object.rotation.y = Math.PI / 2 * (index == 0 ? 1 : -1);
				scene.add( object );
				});
			}
			window.addEventListener( 'resize', onWindowResize );
			function onWindowResize() {
				initclientX = window.innerWidth / 2;
				initClientY = window.innerHeight / 2;
				player1.raquete.position.x = 0;
				player1.raquete.position.z = (boundingBox?.max.z - boundingBox?.min.z) * -0.5;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			socket.on('score', (score : any[]) => {
				player1.goals = score[0];
				player1Score.innerText = score[0];
				player2.goals = score[1];
				player2Score.innerText = score[1];
			})
    }

export default FirstPage;