import type { Comp, Vec2, GameObj} from "kaplay";

// --- Interface for the game object using this component ---
interface ArcFlightObject extends Comp {
    pos: Vec2;
    velocity: Vec2;
}

interface ArcFlightComp extends Comp {
    applyArcFlight: (player: GameObj<ArcFlightObject>) => void;
}

/**
 * A component for a dynamic flight model that rewards flying in smooth arcs.
 */
export function ArcFlightComp(player: GameObj): ArcFlightComp {
    const speedScaleFactor: number = 200;  // A divisor to scale the effect of speed on turn rate.
    const turnSmoothFrames: number = 10;  // The number of frames to average the turn rate over.
    // --- Tunable Gameplay Constants ---
    const MIN_CURVE_SWEETSPOT = 230;
    const MAX_CURVE_SWEETSPOT = 500;
    const CURVE_BUILD_RATE = 25;
    const CURVE_DECAY_RATE = 15;
    const MAX_CHARGE = 100;
    const BOOST_CHARGE_THRESHOLD = 70;
    const STRAIGHT_LINE_DRAG = 1;
    const CURVE_EXIT_THRESHOLD = 0.005; // How "straight" do you have to be to trigger the boost

    // --- Component State ---
    let lastHeading: Vec2 = vec2(1, 0);
    let turnRates: number[] = [];
    let arcCharge = 0;
    let lastCurvature = 0; // NEW: Track the last frame's curvature

    return {
        id: "arcFlight",
        require: [ "pos",], //"vel" ],

        applyArcFlight(arcFlightObject: GameObj<ArcFlightObject>) {
            const vel = arcFlightObject.velocity.clone();
            const speed = vel.len();

            if (speed <= 0.001) return;

            // --- 1. Compute smoothed turn rate (our measure of curvature) ---
            const heading = vel.unit();
            const rawTurnRate = Math.abs(heading.angle(lastHeading));
            const scaledTurnRate = rawTurnRate * (1 + speed / speedScaleFactor);

            turnRates.push(scaledTurnRate);
            if (turnRates.length > turnSmoothFrames) turnRates.shift();
            const smoothedTurn = turnRates.reduce((a, b) => a + b, 0) / turnRates.length;


            // --- Debug log ---
            // debug.log(
            //     `[ArcFlight] rawTurnRate=${rawTurnRate.toFixed(2)}, smoothedTurn=${smoothedTurn.toFixed(4)}, arcCharge=${arcCharge.toFixed(2)}`
            // );
            // debug.log( `[ArcFlight] arcCharge=${arcCharge.toFixed(2)}`);

            // --- 2. Build or decay arcCharge based on turning ---
            if (smoothedTurn > MIN_CURVE_SWEETSPOT && smoothedTurn < MAX_CURVE_SWEETSPOT) {
                debug.log(`[ArcFlight] Building arcCharge: smoothedTurn=${smoothedTurn.toFixed(2)}`);
                arcCharge += CURVE_BUILD_RATE * dt();
            } else {
                // debug.log(`[ArcFlight] Decaying arcCharge: smoothedTurn=${smoothedTurn.toFixed(2)}`);
                arcCharge -= CURVE_DECAY_RATE * dt();
            }
            arcCharge = clamp(arcCharge, 0, MAX_CHARGE);

            // debug.

            // --- 3. Detect the exit of a curve using change in curvature ---
            const curveExited = smoothedTurn < CURVE_EXIT_THRESHOLD && lastCurvature > CURVE_EXIT_THRESHOLD;

            // --- 4. Release boost if curve is exited or charge is high ---
            if (curveExited || arcCharge >= BOOST_CHARGE_THRESHOLD) {
                debug.log(`[ArcFlight] Boost triggered! curveExited=${curveExited}, arcCharge=${arcCharge.toFixed(2)}`);
                const boostStrength = 200 + arcCharge * 2;
                arcFlightObject.velocity.add(heading.scale(boostStrength));
                arcCharge *= 0.5;
            }

            // --- 5. Apply drag penalty for flying too straight ---
            if (smoothedTurn < MIN_CURVE_SWEETSPOT * 0.5) {
               
                arcFlightObject.velocity = arcFlightObject.velocity.scale(1 - STRAIGHT_LINE_DRAG * dt());
            }

            // --- Update state for the next frame ---
            lastHeading = heading;
            lastCurvature = smoothedTurn; // Store this frame's curvature for the next one
        }
    }
}