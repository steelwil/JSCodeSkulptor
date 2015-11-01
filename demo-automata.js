
var ring_size = 29;
var balls = [random.randrange(3)%2 for i in range(ring_size +3)];
var rules = [random.randrange(3)%2 for i in range(32)];
var cur_rule = 0;
for i in range(ring_size+2, ring_size - 3, -1) { cur_rule = cur_rule * 2 + balls[i]; }
var colour = ['#440000', '#00FF00'];
var cur_angle = 0;
var inner_rad = 40;
var init_rad = Math.sin(Math.radians(180/ring_size)) * inner_rad;
var ratio = 1.0075;

// timer_event
function add_ball() {

    cur_rule= (cur_rule * 2 + balls[ring_size - 3]) % 32;
    cur_angle = (cur_angle + 360/ring_size) % 360;
    balls.insert(0, rules[cur_rule]);
    if len(balls) > 300: balls.pop();
}

// button handlers
function new_rule() {
    rules = [random.randrange(3)%2 for i in range(32)];
}


// Handler to draw on canvas
function draw(canvas) {
    for i in range(len(balls)) {
        ball_ratio = ratio ** i;
        ball_range = inner_rad * ball_ratio;
        ball_radius = init_rad * ball_ratio;
        x = 250 + ball_range * Math.sin(Math.radians(cur_angle - 360/ring_size * i));
        y = 250 + ball_range * Math.cos(Math.radians(cur_angle - 360/ring_size * i));
        canvas.draw_circle((x, y), ball_radius-1, 1, colour[balls[i]], colour[balls[i]]);
    }
}

// Create a frame and assign callbacks to event handlers
var frame = new simplegui.create_frame("Home", 500, 500);
frame.set_draw_handler(draw);
add_timer = simplegui.create_timer(10, add_ball);
frame.add_button('New Rule', new_rule, 100);

// Start the frame animation
frame.start();
add_timer.start();
