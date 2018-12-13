// 
// 
function printAt(context , text, x, y, lineHeight, fitWidth){
  var lines = 1;
  function pa(context, text, x, y, lineHeight, maxWidth ) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            lines++;
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }
  pa(context , text, x, y, lineHeight, fitWidth);
  return lines;
}

// 
// 
 // 
 function THREEPERSON (author) {
  this.name = author.name;
  this.thumb = author.thumb;
  this.all_messages = author.messages;
  this.messages = [];
  var _this = this;
  _this.container = new THREE.Object3D();
      // load a image resource
      new THREE.ImageLoader().load(
        // resource URL
        author.thumb,

        // onLoad callback
        function ( imageBitmap ) {
          var texture = new THREE.CanvasTexture( imageBitmap );
          var material = new THREE.MeshBasicMaterial( { map: texture } );
          var geometry = new THREE.CircleGeometry( .3, 16 );
          var circle = new THREE.Mesh( geometry, material );
          
          _this.container.position.x = 7.5-Math.random()*15;
          _this.container.position.y = 1-Math.random()*2;           
        
          circle.position.z = 0.01;
          _this.container.add( circle );
          //_this.container.scale.x = _this.container.scale.y = 1;
          _this.container.name = _this.name;
          _this.mcontainer = Matter.Bodies.rectangle(_this.container.position.x, _this.container.position.y, 3, 2);
          Matter.World.add(world, _this.mcontainer);
          scene.add(_this.container);
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
          console.log( 'An error happened' );
        }
      );  
  return this;
}

THREEPERSON.prototype.addMessage = function (message, dontAnimate){
      var _this = this;
      var offsetY = .5;
      var cvs = document.createElement('canvas');
          cvs.width = cvs.height = 1024;
          var ctx = cvs.getContext('2d');
          ctx.font = '60px sans-serif';
      var lines = printAt(ctx, message, 100, 80, 90, 620);
          cvs.height = 118*lines;
          ctx.font = '60px sans-serif';
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, 1024, 118*lines);
          ctx.fillStyle = '#fff';
          lines = printAt(ctx, message, 100, 80, 90, 620);
  
      var planeHeight = .25*lines;
      var spacing = .1;
      var posY = -planeHeight/2 + offsetY;  
  
      var geometry = new THREE.PlaneGeometry( 2, planeHeight, 4 );
      var texttexture = new THREE.CanvasTexture( cvs, THREE.UVMapping , 1);
      var material = new THREE.MeshBasicMaterial( {map: texttexture } );
      var plane = new THREE.Mesh( geometry, material );
    
            plane.position.x = -1;
            plane.position.y = posY + 1;
            //plane.scale.y = .001;
            
            if(!dontAnimate){
              new TWEEN.Tween({y: posY + 1, a: 0, ry: .01}).
                  to({y: posY, a: 1, ry: 1}, 300)
                  .easing(TWEEN.Easing.Quadratic.InOut)
                  .onUpdate(function(){
                  plane.position.y = this.y;
                  //plane.scale.y = this.ry;
              })
              .start(); 
            }else{
              plane.position.y = posY;
            }

            this.container.add( plane );
        if(this.messages.length > 2){
            this.messages.slice(0,1).forEach(function(existingMessage){
              if(!dontAnimate || !existingMessage.plane){
                  new TWEEN.Tween({y: existingMessage.plane.position.y, sy: 1}).
                  to({y: existingMessage.plane.position.y - (+planeHeight + spacing), sy: .001}, 300)
                  .easing(TWEEN.Easing.Quadratic.InOut)
                  .onUpdate(function(){
                  existingMessage.plane.position.y = this.y;
                  existingMessage.plane.scale.y = this.sy;
              })
              .onComplete(function(){
                    _this.container.remove(existingMessage.plane);
                  })
              .start();
              }else{
                  _this.container.remove(existingMessage.plane);
              }
          })
          this.messages = this.messages.slice(1)
          }
          var prevMessage;
          this.messages.forEach(function(existingMessage, i) {
            // console.log('existingMessage',existingMessage)
              if(!dontAnimate || !existingMessage.plane){
                new TWEEN.Tween({y: existingMessage.plane.position.y }).
                  to({y: existingMessage.plane.position.y - (planeHeight + spacing) }, 300)
                  .easing(TWEEN.Easing.Quadratic.InOut)
                  .onUpdate(function(){
                  existingMessage.plane.position.y = this.y;
                })
              .start();
              }else{
                existingMessage.plane.position.y = existingMessage.plane.position.y - (+planeHeight + spacing) ;
              }
            });
  
            this.messages.push({
              plane: plane,
            });
      }

// 
// 

const width = window.innerWidth;
const height = window.innerHeight;
var vw = window.innerWidth / 100;
var vh = window.innerHeight / 100;

    // Add canvas
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    // 
    Matter.use('matter-attractors');

    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    world.gravity.x = 0;
    world.gravity.y = 0;

    // Add stats box
    stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    stats.dom.style.right = '0px'


    const near_plane = 2;
    const far_plane = 100;

    // Set up camera and scene
    let camera = new THREE.PerspectiveCamera(
      20,
      width / height,
      near_plane,
      far_plane 
    );
    camera.position.set(0, 0, far_plane);
    camera.lookAt(new THREE.Vector3(0,0,0));
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    var bigCircle = {};
    bigCircle.container = new THREE.Mesh(new THREE.CircleGeometry(3 ,32 ),
                              new THREE.MeshBasicMaterial( {color: 0xcccccc } ) 
                              );
    bigCircle.mcontainer = Matter.Bodies.circle(bigCircle.container.position.x, bigCircle.container.position.y, 3, {
        plugin: {
    attractors: [
      // there is a built in helper function for Newtonian gravity!
      // you can find out how it works in index.js
      MatterAttractors.Attractors.gravity
      ]}
      ,gravityConstant : .1
    });

    bigCircle.mcontainer.density = 1000;

    Matter.World.add(world, bigCircle.mcontainer);
                  
    scene.add(bigCircle.container);

    // Set up zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([near_plane, far_plane])
      .wheelDelta(function wheelDelta() {
        // this inverts d3 zoom direction, which makes it the rith zoom direction for setting the camera
        return d3.event.deltaY * (d3.event.deltaMode ? 120 : 1) / 500;
      })
      .on('zoom', () => {
        const event = d3.event;
        if (event.sourceEvent) {

          // Get z from D3
          const new_z = event.transform.k;
        
          if (new_z !== camera.position.z) {
            
            // Handle a zoom event
            const { clientX, clientY } = event.sourceEvent;

            // Project a vector from current mouse position and zoom level
            // Find the x and y coordinates for where that vector intersects the new
            // zoom level.
            // Code from WestLangley https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z/13091694#13091694
            const vector = new THREE.Vector3(
              clientX / width * 2 - 1,
              - (clientY / height) * 2 + 1,
              1 
            );
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = (new_z - camera.position.z)/dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));
            
            
            if (camera.position.z < 20) {
              scale = (20 -  camera.position.z)/camera.position.z;
              
            } else if (camera.position.z >= 20 ) {
            
            }
                            
            // Set the camera to new coordinates
            camera.position.set(pos.x, pos.y, new_z);

          } else {

            // Handle panning
            const { movementX, movementY } = event.sourceEvent;

            // Adjust mouse movement by current scale and set camera
            const current_scale = getCurrentScale();
            camera.position.set(camera.position.x - movementX/current_scale, camera.position.y +
              movementY/current_scale, camera.position.z);
          }
        }
      });

    // Add zoom listener
    const view = d3.select(renderer.domElement);
    view.call(zoom);
      
    // Disable double click to zoom because I'm not handling it in Three.js
    //view.on('dblclick.zoom', null);

    // Sync d3 zoom with camera z position
    zoom.scaleTo(view, far_plane);

    // Three.js render loop
    var saved_authors = {};

      function renderScene () {
      renderer.render(scene, camera);
      Matter.Engine.update(engine);
      if(undefined != saved_authors){
        for (const authorname in saved_authors) {
          const author = saved_authors[authorname].three;
          if(author.mcontainer){
            author.container.position.x = author.mcontainer.position.x - 1.5;
            author.container.position.y = author.mcontainer.position.y - 1;
          }
        }
      }
      // Object.keys(saved_authors).map(o => saved_authors[o]).forEach(author => {
      //     if(!author.mcontainer) return; 
      //     author.container.position.y = author.mcontainer.position.y; 
      //   })
      TWEEN.update();
      stats.update();
      requestAnimationFrame(renderScene);
    }
    renderScene();

    function getCurrentScale() {
      var vFOV = camera.fov * Math.PI / 180
      var scale_height = 2 * Math.tan( vFOV / 2 ) * camera.position.z
      var currentScale = height / scale_height
      return currentScale
    }
