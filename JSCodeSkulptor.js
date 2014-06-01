/*
    This file is part of JSCodeSkulptor.

    (C) Copyright 2014 W.G. Bell (https://github.com/steelwil/JSCodeSkulptor) and others.

    JSCodeSkulptor is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    JSCodeSkulptor is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with JSCodeSkulptor.  If not, see <http://www.gnu.org/licenses/>.

*/

//"use strict"; // uncomment for debugging (chrome does not like const)
// some helper / convenience functions
function pass() {
    return;
}

function range(start, stop, step) {
    if (stop === undefined) {
        stop = start;
        start = 0;
    }

    if (step === undefined) step = 1;

    var array = [];
    for (var i = start; i < stop; i += step) {
        array.push(i);
    }

    return array;
}

function print() {
    if (arguments.length > 0) {
        var args = (arguments.length > 1) ? Array.prototype.join.call(arguments, " ") : arguments[0];
        console.log(args);
    }
    else {
        console.log("");
    }
}

Array.prototype.make = function (size, value) {
    if (value === undefined) {
        value = 0;
    }

    var array = [];
    for (var i = 0; i < size; i++) {
        array.push(value);
    }

    return array;
};

Object.prototype.set_text = function(text) {
  this.innerHTML = text;
};

// Math-------------------------------------------------------------------------
Math.radians = function (value) {
    return value * Math.PI / 180;
}

Math.degrees = function (value) {
    return value / Math.PI * 180;
};

// Random-----------------------------------------------------------------------
function random() {}

random.random = function () {
    return Math.random();
};

random.randrange = function (start, stop, step) {
    if (stop === undefined) {
        stop = start;
        start = 0;
    }
    if (step === undefined) {
        step = 1;
    }
    return Math.floor(Math.random() * (stop - start) / step) * step + start;
};

random.shuffle = function (a_list) {
    // Fisher-Yates shuffle
    var i, j, tmp = 0;
    for (i = 1; i < a_list.length; i++) {
        j = Math.floor(Math.random() * (1 + i));
        if (j != i) {
            tmp = a_list[i];
            a_list[i] = a_list[j];
            a_list[j] = tmp;
        }
    }
    return a_list;
};

random.choice = function (array) {
    return array[Math.floor(Math.random()*array.length)];
};

random.randint = function (first_value, last_value) {
    return Math.round(Math.random() * (last_value - first_value) + first_value);
};

// Timer------------------------------------------------------------------------
function Timer(interval, handler) {
    this.handler = handler;
    this.interval = interval;
    this.timer = null;
}

Timer.prototype.timer = null;
Timer.prototype.handler = null;
Timer.prototype.interval = -1;

Timer.prototype.start = function () {
    this.timer = setInterval(this.handler, this.interval);
};

Timer.prototype.stop = function () {
    clearInterval(this.timer);
};

// Frame------------------------------------------------------------------------
function Frame(width, height) {
    Frame.canvas = new Canvas();
    var c = document.getElementById("myCanvas");
    if (c.getContext) {
        Frame.canvas.ctx = c.getContext("2d");
        Frame.canvas.element = c;
        c.width = width;
        c.height = height;
        Frame.canvas.element.color = "Black";
    }
}

Frame.drawhandler = null; // why does Frame.prototype.drawhandler not work?
Frame.canvas = null; // Frame.prototype.canvas does not work
Frame.mouse_click_up = null;
Frame.mouse_drag_handler = null;
Frame.mousedrag = false;

Frame.prototype.add_button = function (text, button_handler, width) {
    var newButton = document.createElement("button");
    newButton.innerHTML = text;
    newButton.addEventListener('click', button_handler);
    newButton.style.width = String(width) + 'px';
    newButton.style.clear = "left";
    newButton.style.cssFloat = "left";
    var parent = document.getElementById("leftPanel");
    parent.appendChild(newButton);
};

Frame.prototype.add_label = function (text) {
    var newLabel = document.createElement("label");
    if (text === '') text = "&nbsp;";
    newLabel.innerHTML = text;
    newLabel.style.clear = "left";
    newLabel.style.cssFloat = "left";
    var parent = document.getElementById("leftPanel");
    parent.appendChild(newLabel);
    return newLabel;
};

Frame.prototype.set_keydown_handler = function (handler) {
    window.addEventListener('keydown', handler, true);
};

Frame.prototype.set_keyup_handler = function (handler) {
    window.addEventListener('keyup', handler, true);
};

Frame.prototype.set_draw_handler = function (handler) {
    Frame.drawhandler = handler;
    setInterval(this.draw_handler, 1000 / 60); // 60 fps
};

Frame.prototype.draw_handler = function () {
    Frame.canvas.ctx.fillStyle = Frame.canvas.element.color;
    Frame.canvas.ctx.fillRect(0, 0, Frame.canvas.element.width, Frame.canvas.element.height);
    Frame.drawhandler(Frame.canvas);
};

Frame.prototype.set_mouseclick_handler = function (handler) {
    Frame.mouse_click_up = handler;
    Frame.canvas.element.addEventListener('mouseup', this.mouse_click_handler, true);
};

Frame.prototype.mouse_click_handler = function (e) {
    Frame.mousedrag = false;
    var pos = [e.clientX - Frame.canvas.offsetLeft, e.clientY - Frame.canvas.offsetTop];
    Frame.mouse_click_up(pos);
};

Frame.prototype.set_mousedrag_handler = function (handler) {
    Frame.mouse_drag_handler = handler;
    Frame.canvas.element.addEventListener('mousemove', this.mouse_move_handler, true);
    Frame.canvas.element.addEventListener("touchmove", this.touch_move_handler, true);
    Frame.canvas.element.addEventListener('mousedown', this.mouse_down_handler, true);
};

Frame.prototype.mouse_move_handler = function (e) {
    if (Frame.mousedrag) {
        var pos = [e.pageX - Frame.canvas.element.offsetLeft, e.pageY - Frame.canvas.element.offsetTop];
        Frame.mouse_drag_handler(pos);
    }
};

Frame.prototype.touch_move_handler = function (e) {
    e.preventDefault();
    var pos = [e.targetTouches[0].pageX - Frame.canvas.element.offsetLeft, e.targetTouches[0].pageY - Frame.canvas.element.offsetTop];
    Frame.mouse_drag_handler(pos);
};

Frame.prototype.mouse_down_handler = function (e) {
    Frame.mousedrag = true;
};

Frame.prototype.start = function () {
    // does nothing
};

Frame.prototype.set_canvas_background = function (color) {
    Frame.canvas.element.color = color;
};

Frame.prototype.get_canvas_textwidth = function (text, size, face) {
    if (face !== undefined) {
        face = Frame.canvas.ctx.font.substring(Frame.canvas.ctx.font.indexOf(' ') + 1);
    }
    Frame.canvas.ctx.font = String(size) + "px " + face;
    return Frame.canvas.ctx.measureText(text).width;
}

// Canvas-----------------------------------------------------------------------
function Canvas() {
    this.ctx = null;
    this.element = null;
}

Canvas.prototype.draw_line = function (fromPos, toPos, width, color) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.moveTo(fromPos[0], fromPos[1]);
    this.ctx.lineTo(toPos[0], toPos[1]);
    this.ctx.stroke();
};

Canvas.prototype.draw_circle = function (pos, r, line_width, line_color, fill_color) {
    this.ctx.beginPath();
    this.ctx.arc(pos[0], pos[1], r, 0, Math.PI * 2);
    this.ctx.fillStyle = fill_color;
    this.ctx.fill();
    this.ctx.lineWidth = line_width;
    this.ctx.strokeStyle = line_color;
    this.ctx.stroke();
};

Canvas.prototype.draw_text = function (text, pos, size, fill) {
    this.ctx.fillStyle = fill;
    this.ctx.font = String(size) + "px serif";
    this.ctx.fillText(text, pos[0], pos[1]);
};

Canvas.prototype.draw_polyline = function (point_list, line_width, line_color) {
    this.ctx.strokeStyle = line_color;
    this.ctx.lineWidth = line_width;
    this.ctx.beginPath();
    this.ctx.moveTo(point_list[0][0], point_list[0][1]);
    for (var i = 1; i < point_list.length; i++) {
        this.ctx.lineTo(point_list[i][0], point_list[i][1]);
    }
    this.ctx.stroke();
};

Canvas.prototype.draw_polygon = function (point_list, line_width, line_color, fill_color) {
    if (fill_color !== undefined) this.ctx.fillStyle = fill_color;
    this.ctx.strokeStyle = line_color;
    this.ctx.lineWidth = line_width;
    this.ctx.beginPath();
    this.ctx.moveTo(point_list[0][0], point_list[0][1]);

    for (var i = 1; i < point_list.length; i++) {
        this.ctx.lineTo(point_list[i][0], point_list[i][1]);
    }

    this.ctx.closePath();

    if (fill_color !== undefined) this.ctx.fill();
    this.ctx.stroke();
};

Canvas.prototype.draw_image = function (image, center_source, width_height_source, center_dest, width_height_dest, angle) {
    var sourceX = center_source[0] - width_height_source[0] / 2;
    var sourceY = center_source[1] - width_height_source[1] / 2;
    var destX = center_dest[0] - width_height_source[0] / 2;
    var destY = center_dest[1] - width_height_source[1] / 2;

    if (angle === undefined || isNaN(angle)) angle = 0;

    if (angle !== 0) {
        this.ctx.save();
        this.ctx.translate(center_dest[0], center_dest[1]);
        this.ctx.rotate(angle);
        this.ctx.drawImage(image, sourceX, sourceY, width_height_source[0], width_height_source[1], -width_height_dest[0] / 2, -width_height_dest[1] / 2, width_height_dest[0], width_height_dest[1]);
        this.ctx.restore();
    } else {
        this.ctx.drawImage(image, sourceX, sourceY, width_height_source[0], width_height_source[1], destX, destY, width_height_dest[0], width_height_dest[1]);
    }
};

// Sound------------------------------------------------------------------------
function Sound(sound_url) {
    this.audio = new Audio(sound_url);
}

Sound.prototype.audio = null;

Sound.prototype.load_sound = function (sound_url) {
    this.audio = new Audio(sound_url);
};

Sound.prototype.play = function () {
    this.audio.play();
};

Sound.prototype.pause = function () {
    this.audio.pause();
};

Sound.prototype.rewind = function () {
    if (this.audio.readyState == 4) { // 4 = HAVE_ENOUGH_DATA
        this.audio.currentTime = 0;
        this.audio.pause();
    }
};

Sound.prototype.set_volume = function (volume) {
    if (volume >= 0 && volume <= 1) this.audio.volume = volume;
};

// Simplegui--------------------------------------------------------------------
function Simplegui() {}

Simplegui.prototype.KEY_MAP = {
    "left": 37,
        "right": 39,
        "up": 38,
        "down": 40,
        "space": 32
};

Simplegui.prototype.create_frame = function (text, width, height) {
    document.title = text;
    return new Frame(width, height);
};

Simplegui.prototype.load_image = function (image_url) {
    var imageObj = new Image();
    imageObj.src = image_url;
    return imageObj;
};

Simplegui.prototype.load_sound = function (sound_url) {
    return new Sound(sound_url);
};

Simplegui.prototype.create_timer = function (ms, handler) {
    return new Timer(ms, handler);
};

// Global variables-------------------------------------------------------------
var simplegui = new Simplegui();
