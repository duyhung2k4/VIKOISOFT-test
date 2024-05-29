var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

const HEIGHT_CV = 400;
const WIDTH_CV = 1200;
const start_x = 100;
const start_y = 25;

const data = {
    hba1c: [],
    sub_meals: ["09:04", "11:23", "15:44", "21:33"],
    primary_meals: ["12:05", "19:10"],
}

const ARR_HOUR = Array.from({ length: 24 }).map((_, i) => i);
const ARR_MINUTE = Array.from({ length: 60 }).map((_, i) => i);
const STEP_MINUTE = (WIDTH_CV - 2 * start_x) / (24 * 60);

const randomHBA1C = () => {
    ARR_HOUR.forEach(h => {
        ARR_MINUTE.forEach(m => {
            const text_h = h >= 10 ? h : `0${h}`;
            const text_m = m >= 10 ? m : `0${m}`;

            if (m % 60 === 0) {
                data.hba1c.push({
                    time: `${text_h}:${text_m}`,
                    value: Math.floor(Math.random() * 351),
                })
            }
            const convert_m = h * 60 + m;

            data.sub_meals.forEach(item => {
                const h_sub = Number(`${item}`.split(":")[0], 10);
                const m_sub = Number(`${item}`.split(":")[1], 10);
                const convert_m_sub = h_sub * 60 + m_sub;

                if (convert_m_sub === convert_m) {
                    const text_h = h_sub >= 10 ? h_sub : `0${h_sub}`;
                    const text_m = m_sub >= 10 ? m_sub : `0${m_sub}`;
                    data.hba1c.push({
                        time: `${text_h}:${text_m}`,
                        value: Math.floor(Math.random() * 351),
                        type: "sub",
                    })
                }
            });

            data.primary_meals.forEach(item => {
                const h_pri = Number(`${item}`.split(":")[0], 10);
                const m_pri = Number(`${item}`.split(":")[1], 10);
                const convert_m_pri = h_pri * 60 + m_pri;

                if (convert_m_pri === convert_m) {
                    const text_h = h_pri >= 10 ? h_pri : `0${h_pri}`;
                    const text_m = m_pri >= 10 ? m_pri : `0${m_pri}`;
                    data.hba1c.push({
                        time: `${text_h}:${text_m}`,
                        value: Math.floor(Math.random() * 351),
                        type: "pri",
                    })
                }
            });
        })
    });

    data.hba1c.push({
        time: `24:00`,
        value: Math.floor(Math.random() * 351),
    })
}

const drawIcon = (ctx, x, y, size, path) => {
    let img = new Image();
    img.src = path;

    let new_x = x - size / 2;
    let new_y = y - size / 2;
    img.onload = () => {
        ctx.drawImage(img, new_x, new_y, size, size);
    }
}

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
    for (let i = 0; i <= countStep; i++) {
        ctx.beginPath();

        ctx.moveTo(step_x, step_y);
        ctx.fillText(`${i * step}`, step_x - 50, step_y);
        ctx.lineTo(i % 2 == 0 ? step_x - 25 : step_x - 20, step_y);

        if (i === countStep) {
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

    for (let i = 0; i <= 12; i++) {
        let text = i * 2 >= 10 ? `${i * 2}:00` : `0${i * 2}:00`;
        text = text === "24:00" ? "00:00" : text;


        ctx.beginPath();

        ctx.textAlign = 'center';
        ctx.fillText(text, step_x, step_y - 10);

        if (i > 0 && i < 12) {
            ctx.moveTo(step_x, step_y);
            ctx.lineTo(step_x, step_y + (HEIGHT_CV - 2 * start_y));
            ctx.setLineDash(i % 3 !== 0 ? [5, 5] : [0, 0]);
        }

        ctx.stroke();
        step_x += step;
    }

    ctx.setLineDash([0, 0]);
}

const drawPoint = (ctx) => {
    let x = start_x;
    ctx.beginPath();

    ctx.strokeStyle = "#159FDD";
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    for (let i = 0; i < data.hba1c.length; i++) {
        const item = data.hba1c[i];

        const h = Number(`${item.time}`.split(":")[0], 10);
        const m = Number(`${item.time}`.split(":")[1], 10);
        const minute = h * 60 + m;
        let value_y = (HEIGHT_CV - start_y) - item.value;
        let value_x = x + minute * STEP_MINUTE;

        ctx.lineTo(value_x, value_y);

    }

    ctx.stroke();
}

const drawSmoothLine = (ctx) => {
    let x = start_x;
    ctx.beginPath();

    ctx.strokeStyle = "#159FDD";
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    for (let i = 0; i < data.hba1c.length - 1; i++) {
        const current = data.hba1c[i];
        const next = data.hba1c[i + 1];

        const current_h = Number(current.time.split(":")[0], 10);
        const current_m = Number(current.time.split(":")[1], 10);
        const current_minute = current_h * 60 + current_m;

        const next_h = Number(next.time.split(":")[0], 10);
        const next_m = Number(next.time.split(":")[1], 10);
        const next_minute = next_h * 60 + next_m;

        const current_y = (HEIGHT_CV - start_y) - current.value;
        const next_y = (HEIGHT_CV - start_y) - next.value;

        const current_x = x + current_minute * STEP_MINUTE;
        const next_x = x + next_minute * STEP_MINUTE;

        if (i === 0) {
            ctx.moveTo(current_x, current_y);
        } else {
            const cpx1 = (current_x + next_x) / 2;
            const cpy1 = current_y;
            const cpx2 = (current_x + next_x) / 2;
            const cpy2 = next_y;
            ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, next_x, next_y);
        }


        const h = Number(`${current.time}`.split(":")[0], 10);
        const m = Number(`${current.time}`.split(":")[1], 10);
        const minute = h * 60 + m;
        let value_y = (HEIGHT_CV - start_y) - current.value;
        let value_x = x + minute * STEP_MINUTE;
        if (current.type === "sub") {
            ctx.textAlign = "right";
            ctx.fillText(current.value, value_x - 8, value_y);
            drawIcon(ctx, value_x, value_y, 15, "./icon/apple-svgrepo-com.svg");
        }
        if (current.type === "pri") {
            ctx.textAlign = "right";
            ctx.fillText(current.value, value_x - 20, value_y);
            drawIcon(ctx, value_x, value_y, 30, "./icon/plate-svgrepo-com.svg");
        }
    }

    ctx.stroke();
}

randomHBA1C();
drawContentBox(ctx);
drawShaftSection_Y(ctx, 350, 50);
drawShaftSection_X(ctx);
drawSmoothLine(ctx);