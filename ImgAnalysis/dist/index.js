import * as ImgPath from "./path_creator/ImgPath.js";
import * as Visualize2D from "./path_creator/visualize2d_scripts.js";
const root = document.getElementById("root");
const blur_button = document.createElement("button");
blur_button.innerHTML = "BLUR";
root.appendChild(blur_button);
var eimg1 = new ImgPath.EulerImg("./training_sample/coke1.jpg", root, 3);
var eimg2 = new ImgPath.EulerImg("./training_sample/coke8.jpg", root, 3);
const KP_button_1 = document.createElement("button");
KP_button_1.innerHTML = "KeyPoints1";
root.appendChild(KP_button_1);
const KP_button_2 = document.createElement("button");
KP_button_2.innerHTML = "KeyPoints1";
root.appendChild(KP_button_2);
const compare_button = document.createElement("button");
compare_button.innerHTML = "optimize transformation";
root.appendChild(compare_button);
function main(runtimeVars, time) {
    var [contrast_threshold] = runtimeVars;
    blur_button.addEventListener("click", (e) => {
        for (var i = 0; i < 8; i++) {
            eimg1.gaussianBlur();
            eimg2.gaussianBlur();
        }
    });
    const bothImgKeyPoints = [];
    const handleClick1 = (eimg) => {
        var keyPoints = eimg.keyPointDetection(10, contrast_threshold, true, true, false);
        bothImgKeyPoints.push(keyPoints);
        console.log(keyPoints);
        const canvas = document.createElement("canvas");
        root.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = eimg.img.width;
        canvas.height = eimg.img.height;
        const ImgData = ctx.createImageData(canvas.width, canvas.height);
        const data = ImgData.data;
        data.fill(0);
        const radius = 2;
        keyPoints.forEach(coord => {
            for (var ky = -radius; ky <= radius; ky++) {
                for (var kx = -radius; kx <= radius; kx++) {
                    var coordIndex = (coord[1] + ky) * canvas.width * 4 + (coord[0] + kx) * 4;
                    data[coordIndex] = 255;
                    data[coordIndex + 1] = 0;
                    data[coordIndex + 2] = 0;
                    data[coordIndex + 3] = 255;
                }
            }
        });
        ctx.putImageData(ImgData, 0, 0);
    };
    const handleClick2 = (eimg) => {
        var keyPoints = eimg.keyPointDetection(10, contrast_threshold, true, true, false);
        const f = (x) => { return x; };
        keyPoints = keyPoints.map(elem => { return [f(elem[0]), f(elem[1])]; });
        bothImgKeyPoints.push(keyPoints);
        console.log(keyPoints);
        const canvas = document.createElement("canvas");
        root.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = eimg.img.width;
        canvas.height = eimg.img.height;
        const ImgData = ctx.createImageData(canvas.width, canvas.height);
        const data = ImgData.data;
        data.fill(0);
        const radius = 2;
        keyPoints.forEach(coord => {
            for (var ky = -radius; ky <= radius; ky++) {
                for (var kx = -radius; kx <= radius; kx++) {
                    var coordIndex = (coord[1] + ky) * canvas.width * 4 + (coord[0] + kx) * 4;
                    data[coordIndex] = 255;
                    data[coordIndex + 1] = 0;
                    data[coordIndex + 2] = 0;
                    data[coordIndex + 3] = 255;
                }
            }
        });
        ctx.putImageData(ImgData, 0, 0);
    };
    // remove event listeners
    KP_button_1.onclick = () => { handleClick1(eimg1); };
    KP_button_2.onclick = () => {
        handleClick2(eimg2);
    };
    compare_button.onclick = () => {
        eimg1.optimizeTransformation(eimg2.keyPoints);
    };
}
Visualize2D.SetWorkspace();
const runtime = new Visualize2D.Runtime(main); // init Runtime
runtime.CreateTicker(Visualize2D.DefaultTicker);
runtime.varNumber("contrast_threshold", 0, 16); // set desired vars
runtime.UpdateScreen(0);
