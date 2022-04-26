//TODO: extends Canvas
class CustomCanvas extends HTMLElement {
    /** Кастомный элемент для строки с цветами*/
    constructor() {
        super();
        this.template = document.querySelector('#canvasTemplate')
        this.clone = this.template.content.cloneNode(true);

        this.canvas = this.clone.querySelector('#glcanvas');
    }
    connectedCallback() {
        /** Вызывается при рендере */
        this._render();
        this._attachEventHandlers();

    }
    _render(){
        webglMain();
    }
    _attachEventHandlers(){
        /** Добавляет события */

    }

    /** Набор геттеров и сеттеров для удобства работы с аттрибутами*/
    get color() { return this.getAttribute('color') || "#FFDD00";}
    set color(value) {this.setAttribute("color", value);}


    /** Для рендера новых значений при изменении свойств*/
    static get observedAttributes() {
        return ['color'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "color":
                let rgb = hexToRgb(newValue);
                webglMain(rgb);
                break;
        }
    }
}
customElements.define('custom-canvas', CustomCanvas);

const modifyCanvas = (color) =>{
    /** Установить новый цвет в аттрибут кастомного canvas */
    let canvas = document.querySelector('custom-canvas');
    canvas.setAttribute('color',color);
}

document.addEventListener("modifycanvas", (e)=>{
    /** Изменить цвет в canvas*/
    modifyCanvas(e.detail.color)
})

/**** ***/
function hexToRgb(hex) {
    /** Преобразование цвета из hex формата в rgb.
     * Используется округление до 2 знаков после запятой
     * и преобразование в число через "+" в начаое строки*/
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let resultArr = [];
    resultArr.push(+(parseInt(result[1], 16) / 255).toFixed(2));
    resultArr.push(+(parseInt(result[2], 16) / 255).toFixed(2));
    resultArr.push(+(parseInt(result[3], 16) / 255).toFixed(2));
    resultArr.push(1.0); // для alpha канала
    console.log(resultArr)
    return resultArr;
}
var cubeRotation = 0.0;


function webglMain (color=[1.0,1.0,1.0,1.0]) {
    const canvas = document.querySelector('#glcanvas2');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a GL context, give up now
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    /** Вершинный (вертексный) шейдер - определяет положение и форму каждой вершины */
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

    /** Фрагментный шейдер - управление цветом пикселей
     * в полигоне (фрагментов) */
    const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    /** Информация, которую мы будем использовать в шейдерной программе.
     * В том числи и об аттрибутах расположении uniform.
     *      Uniform - Глобальные во всех смыслах данные.
     * Передаются извне, одинаковы для всех вызовов вершинных и
     * фрагментных шейдеров.
     *      Attribute — Эти данные передаются уже более точечно
     * и для каждого вызова шейдера могут быть разными
     * */
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        }
    };

    const buffers = initBuffers(gl,color);

    let then = 0;

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function initBuffers(gl,color) {
    /** Перед отрисовкой создаются буферы, которые содержат вершины */

    /** Буфер создается и привязывается к контексту */
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the cube.

    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];

    /** Преобразование этого JS массива в массив вещественных чисел webGL и
     * назначение вершин объекту */
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Now set up the colors for the faces. We'll use solid colors
    // for each face.
    const faceColors = [
        color,    // Front face:
        color,    // Back face:
        color,    // Top face:
        color,    // Bottom face:
        color,    // Right face:
        color,    // Left face:
    ];

    // Convert the array of colors into a table for all the vertices.
    let colors = [];

    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    // Now send the element array to GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
    };
}


function drawScene(gl, programInfo, buffers, deltaTime) {
    /** Отрисовка сцены */

    gl.clearColor(0.0, 0.0, 0.0, 1.0);   // установить в качестве цвета очистки буфера цвета чёрный, полная непрозрачность
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);            // включает использование буфера глубины
    gl.depthFunc(gl.LEQUAL);            // определяет работу буфера глубины: более ближние объекты перекрывают дальние

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // очистить буфер цвета и буфер глубины.

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [-0.0, 0.0, -6.0]);  // amount to translate
    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        cubeRotation,     // amount to rotate in radians
        [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        cubeRotation * .7,// amount to rotate in radians
        [0, 1, 0]);       // axis to rotate around (X)

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // Update the rotation for the next draw
    /** Это для анимации. Если не удалю остальное*/
    //cubeRotation += deltaTime;
}


function initShaderProgram(gl, vsSource, fsSource) {
    /** Инициализация шейдеров */
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    /** Создание шейдерной программы и присоединение к ней двух шейдеров */
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    /** Создание шейдера выбранного типа, установка источника и компиляция */
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}