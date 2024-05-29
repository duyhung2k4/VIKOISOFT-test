var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

const HEIGHT_CV = 400;
const WIDTH_CV = 1200;
const start_x = 100;
const start_y = 25;

const data = [
    { x: 10, y: 65 },
    { x: 20, y: 59 },
    { x: 30, y: 80 },
    { x: 40, y: 81 },
    { x: 50, y: 56 },
    { x: 60, y: 55 },
    { x: 70, y: 40 },
];

const MAX_DATA_X = Math.max(data.map(d => d.x));
const MAX_DATA_Y = Math.max(data.map(d => d.y));

const drawContentBox = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(WIDTH_CV - start_x, start_y);
    ctx.lineTo(WIDTH_CV - start_x, HEIGHT_CV - start_y);
    ctx.lineTo(start_x, HEIGHT_CV - start_y);
    ctx.lineTo(start_x, start_y);
    ctx.stroke();
}

const drawShaftSection_Y = (ctx, maxData, step) => {
    const redundant = maxData % step == 0 ? step : maxData % step;
    const countStep = (maxData - redundant) / step + 1;
    let step_x = start_x;
    let step_y = HEIGHT_CV - start_y;
    for(let i = 0; i <= countStep; i++) {
        ctx.beginPath();

        ctx.moveTo(step_x, step_y);
        ctx.fillText(`${i * step}`, step_x - 50, step_y);
        ctx.lineTo(i % 2 == 0 ? step_x - 25 : step_x - 20, step_y);
        
        if(i === countStep) {
            ctx.fillText(`mg/dL`, step_x - 50, step_y + 10);
        }

        ctx.stroke();

        step_y -= i === countStep - 1 ? redundant : step;
    }
}

// draw hour
const drawShaftSection_X = (ctx) => {
    const step = (WIDTH_CV - (2 * start_x)) / 12;
    let step_x = start_x;
    let step_y = start_y;

    for(let i = 0; i <= 12; i++) {
        let text = i * 2 >= 10 ? `${i * 2}:00` : `0${i * 2}:00`;
        text = text === "24:00" ? "00:00" : text;

        
        ctx.beginPath();

        ctx.textAlign = 'center';
        ctx.fillText(text, step_x, step_y - 10);

        if(i > 0 && i < 12) {
            ctx.moveTo(step_x, step_y);
            ctx.lineTo(step_x, step_y + (HEIGHT_CV - 2 * start_y));
            ctx.setLineDash(i % 3 !== 0 ? [5,5] : [0,0]);
        }

        ctx.stroke();
        step_x += step;
    }
}

drawContentBox(ctx);
drawShaftSection_Y(ctx, 350, 50);
drawShaftSection_X(ctx);
