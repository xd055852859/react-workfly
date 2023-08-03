import React, { useState, useRef } from 'react';
import './fireAnimate.css';
import { useMount } from '../../hook/common';
import { useEffect } from 'react';
declare var window: Window 
interface FireAnimateProps {

}

const FireAnimate: React.FC<FireAnimateProps> = (props) => {
    const [particle, setParticle] = useState<any>(null);
    let width = useRef<number>(0);
    let height = useRef<number>(0);
    let context = useRef<any>(null);
    let timer = useRef<any>(null);
    useMount(() => {
        init(300);
        return () => {
            if (timer.current) {
                clearTimeout(timer.current)
            }
        }
    })
    const init = (n) => {
        let canvas: any = document.getElementById("adai_canvas");
        context.current = canvas.getContext("2d");
        width.current = canvas.width = window.innerWidth;
        height.current = canvas.height = window.innerHeight;
        let particle: any = [];
        let colors = [
            '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
            '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
            '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
            '#FF5722', '#795548'
        ];
        let w = window.innerWidth, x = w / 2;
        function randomRange(min, max) {
            return min + Math.random() * (max - min);
        }
        for (var i = 0; i < n; i++) {
            particle.push({
                x: x,
                y: 340,
                boxW: randomRange(5, 20),
                boxH: randomRange(5, 20),
                size: randomRange(2, 8),
                spikeran: randomRange(3, 5),
                velX: randomRange(-8, 8),
                velY: randomRange(-50, -10),
                angle: convertToRadians(randomRange(0, 360)),
                color: colors[Math.floor(Math.random() * colors.length)],
                anglespin: randomRange(-0.2, 0.2),
                draw: function () {
                    context.current.save();
                    context.current.translate(this.x, this.y);
                    context.current.rotate(this.angle);
                    context.current.fillStyle = this.color;
                    context.current.beginPath();
                    context.current.fillRect(this.boxW / 2 * -1, this.boxH / 2 * -1, this.boxW, this.boxH);
                    context.current.fill();
                    context.current.closePath();
                    context.current.restore();
                    this.angle += this.anglespin;
                    this.velY *= 0.999;
                    this.velY += 0.3;

                    this.x += this.velX;
                    this.y += this.velY;
                    if (this.y < 0) {
                        this.velY *= -0.2;
                        this.velX *= 0.9;
                    };
                    if (this.y > height.current) {
                        this.anglespin = 0;
                        this.y = height.current;
                        this.velY *= -0.2;
                        this.velX *= 0.9;
                    };
                    if (this.x > width.current || this.x < 0) {

                        this.velX *= -0.5;
                    };
                },
            });
        }
        setParticle(particle)
    }
    useEffect(() => {
        if (particle) {
            timer.current = setInterval(() => {
                update();
            }, 20);
            setTimeout(() => {
                if (timer.current) {
                    clearTimeout(timer.current)
                }
                // $emit('close-fire', false);
            }, 5000);
        }
        //eslint-disable-next-line
    }, [particle])
    const drawScreen = () => {
        for (var i = 0; i < particle.length; i++) {
            particle[i].draw();
        }
    }
    const update = () => {
        context.current.clearRect(0, 0, width.current, height.current);
        drawScreen();
    }
    const convertToRadians = (degree) => {
        return degree * (Math.PI / 180);
    }
    return (
        <div className="adai_fire_wrap">
            <canvas id="adai_canvas"></canvas>
        </div>
    );
};
FireAnimate.defaultProps = {
};
export default FireAnimate;
