import { useMount } from '../../hook/common';


const HomeCanvas = (props) => {
  let count = 20;
  let innerRadius = 30;
  let outterRadius = 150;
  let moreOutterRadius = 200;
  let easing = 0.05;
  let mcolor = [
    '#f4433699',
    '#ffeb3b99',
    '#03a9f499'
  ]
  let animateStep
  class Ball {
    constructor(x, y, radius, color) {
      this.x = x || 0;
      this.y = y || 0;
      this.vx = 0;
      this.vy = 0;
      this.sx = 1;
      this.sy = 1;
      this.radius = radius || 10;
      this.color = color || 'black';
    }

    draw(type, ctx) {
      if (['fill', 'stroke'].indexOf(type) === -1) {
        // throw ('ball.draw need a right type');
      }
      if (ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.sx, this.sy);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 360 * Math.PI / 180);
        ctx.closePath();
        type === 'fill' ? ctx.fill() : ctx.stroke();
        ctx.restore();
      }
    }
  }

  // mouse class
  class Mouse {
    constructor() {
      this.x = 0;
      this.y = 0;
    }

    getMousePosition(home) {
      home.addEventListener('mousedown', (e) => {
        this.x = e.clientX - home.offsetLeft;
        this.y = e.clientY - home.offsetTop;
      }, false)
    }
  }
  useMount(() => {
    const home = document.getElementById('home');
    let mouse = new Mouse();
    mouse.getMousePosition(home);
    home.addEventListener('mousedown', () => {
      let balls = getEnoughBall(count, mouse.x, mouse.y);
      let circle = new Ball(mouse.x, mouse.y, innerRadius, '#f4433699');
      var opacticy = 0.6;
      animateStep = requestAnimationFrame(() => { animation(balls, circle, opacticy) })
    }, false)
    home.addEventListener('mouseup', () => {
      cancelAnimationFrame(animateStep)
    }, false)
    return () => {

    };
  });
  const animation = (balls, circle, opacticy) => {
    const cnv = document.getElementById('mineCanvas');
    let ctx = cnv.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      balls.forEach(item => {
        item.draw('fill', ctx);
        // 缓动动画
        item.vx = (item.dx - item.x) * easing;
        item.vy = (item.dy - item.y) * easing;
        item.x += item.vx;
        item.y += item.vy;
        item.sx += -item.sx * easing;
        item.sy += -item.sy * easing;
      })

      circle.draw('stroke');
      circle.radius += (outterRadius - circle.radius) * easing;
      opacticy = opacticy - 0.6 * easing;
      circle.color = `rgba(244, 67, 54, ${opacticy})`
    }
  }
  const getEnoughBall = (num, mouseX, mouseY) => {
    var balls = [];

    for (let i = 0; i < num; i++) {
      var ball = new Ball(0, 0, Math.random() * (40 - 5 + 1) + 5, mcolor[parseInt(Math.random() * 3)]);
      ball.x = mouseX + Math.random() * innerRadius - Math.random() * innerRadius;
      ball.y = mouseY + Math.random() * innerRadius - Math.random() * innerRadius;
      // 计算最终位置
      var x = mouseX - ball.x;
      var y = mouseY - ball.y;
      var scale = Math.abs(x / y);
      ball.dx = (x < 0 ? 1 : -1) * moreOutterRadius / Math.sqrt(scale * scale + 1) * Math.random() * scale + mouseX;
      ball.dy = (y < 0 ? 1 : -1) * moreOutterRadius / Math.sqrt(scale * scale + 1) * Math.random() + mouseY;
      balls.push(ball);
    }
    return balls;
  }
  return (
    <div>
      <canvas id="mineCanvas"></canvas>
    </div>
  );
};
export default HomeCanvas;
