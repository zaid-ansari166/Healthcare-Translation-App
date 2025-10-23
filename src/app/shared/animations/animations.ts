import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
  group,
} from "@angular/animations";

// Toast slide in/out animation
export const slideInOut = trigger("slideInOut", [
  transition(":enter", [
    style({
      transform: "translateX(100%)",
      opacity: 0,
    }),
    animate(
      "300ms ease-out",
      style({
        transform: "translateX(0)",
        opacity: 1,
      }),
    ),
  ]),
  transition(":leave", [
    animate(
      "250ms ease-in",
      style({
        transform: "translateX(100%)",
        opacity: 0,
      }),
    ),
  ]),
]);

// Fade in/out animation
export const fadeInOut = trigger("fadeInOut", [
  transition(":enter", [
    style({ opacity: 0 }),
    animate("200ms ease-in", style({ opacity: 1 })),
  ]),
  transition(":leave", [animate("200ms ease-out", style({ opacity: 0 }))]),
]);

// Scale animation for modals and popups
export const scaleInOut = trigger("scaleInOut", [
  transition(":enter", [
    style({
      transform: "scale(0.8)",
      opacity: 0,
    }),
    animate(
      "200ms ease-out",
      style({
        transform: "scale(1)",
        opacity: 1,
      }),
    ),
  ]),
  transition(":leave", [
    animate(
      "150ms ease-in",
      style({
        transform: "scale(0.8)",
        opacity: 0,
      }),
    ),
  ]),
]);

// Slide up/down animation for dropdowns
export const slideUpDown = trigger("slideUpDown", [
  transition(":enter", [
    style({
      transform: "translateY(-10px)",
      opacity: 0,
    }),
    animate(
      "200ms ease-out",
      style({
        transform: "translateY(0)",
        opacity: 1,
      }),
    ),
  ]),
  transition(":leave", [
    animate(
      "150ms ease-in",
      style({
        transform: "translateY(-10px)",
        opacity: 0,
      }),
    ),
  ]),
]);

// Bounce animation for notifications
export const bounceIn = trigger("bounceIn", [
  transition(":enter", [
    animate(
      "600ms",
      keyframes([
        style({
          transform: "scale3d(0.3, 0.3, 0.3)",
          opacity: 0,
          offset: 0,
        }),
        style({
          transform: "scale3d(1.1, 1.1, 1.1)",
          opacity: 1,
          offset: 0.2,
        }),
        style({
          transform: "scale3d(0.9, 0.9, 0.9)",
          offset: 0.4,
        }),
        style({
          transform: "scale3d(1.03, 1.03, 1.03)",
          offset: 0.6,
        }),
        style({
          transform: "scale3d(0.97, 0.97, 0.97)",
          offset: 0.8,
        }),
        style({
          transform: "scale3d(1, 1, 1)",
          opacity: 1,
          offset: 1,
        }),
      ]),
    ),
  ]),
]);

// List animations with stagger effect
export const listAnimation = trigger("listAnimation", [
  transition("* <=> *", [
    query(
      ":enter",
      [
        style({ opacity: 0, transform: "translateY(-15px)" }),
        stagger(
          "50ms",
          animate(
            "300ms ease-out",
            style({ opacity: 1, transform: "translateY(0px)" }),
          ),
        ),
      ],
      { optional: true },
    ),
    query(
      ":leave",
      animate(
        "200ms ease-in",
        style({ opacity: 0, transform: "translateY(-15px)" }),
      ),
      { optional: true },
    ),
  ]),
]);

// Route transition animations
export const slideInFromLeft = trigger("slideInFromLeft", [
  transition(":enter", [
    style({ transform: "translateX(-100%)" }),
    animate("300ms ease-in", style({ transform: "translateX(0%)" })),
  ]),
]);

export const slideInFromRight = trigger("slideInFromRight", [
  transition(":enter", [
    style({ transform: "translateX(100%)" }),
    animate("300ms ease-in", style({ transform: "translateX(0%)" })),
  ]),
]);

// Complex route transition with fade and slide
export const routeTransition = trigger("routeTransition", [
  transition("* <=> *", [
    group([
      query(
        ":enter",
        [
          style({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            opacity: 0,
            transform: "translateX(-50px)",
          }),
          animate(
            "300ms ease-out",
            style({
              opacity: 1,
              transform: "translateX(0)",
            }),
          ),
        ],
        { optional: true },
      ),
      query(
        ":leave",
        [
          style({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            opacity: 1,
            transform: "translateX(0)",
          }),
          animate(
            "200ms ease-in",
            style({
              opacity: 0,
              transform: "translateX(50px)",
            }),
          ),
        ],
        { optional: true },
      ),
    ]),
  ]),
]);

// Loading spinner animation
export const spin = trigger("spin", [
  state("spinning", style({ transform: "rotate(360deg)" })),
  transition("* => spinning", [
    animate("1s linear", style({ transform: "rotate(360deg)" })),
  ]),
]);

// Shake animation for error states
export const shake = trigger("shake", [
  transition("* => shake", [
    animate(
      "600ms",
      keyframes([
        style({ transform: "translateX(0)", offset: 0 }),
        style({ transform: "translateX(-10px)", offset: 0.1 }),
        style({ transform: "translateX(10px)", offset: 0.2 }),
        style({ transform: "translateX(-10px)", offset: 0.3 }),
        style({ transform: "translateX(10px)", offset: 0.4 }),
        style({ transform: "translateX(-10px)", offset: 0.5 }),
        style({ transform: "translateX(10px)", offset: 0.6 }),
        style({ transform: "translateX(-10px)", offset: 0.7 }),
        style({ transform: "translateX(10px)", offset: 0.8 }),
        style({ transform: "translateX(-10px)", offset: 0.9 }),
        style({ transform: "translateX(0)", offset: 1 }),
      ]),
    ),
  ]),
]);

// Pulse animation for attention
export const pulse = trigger("pulse", [
  state("pulsing", style({ transform: "scale(1)" })),
  transition("* => pulsing", [
    animate(
      "1s",
      keyframes([
        style({ transform: "scale(1)", offset: 0 }),
        style({ transform: "scale(1.05)", offset: 0.5 }),
        style({ transform: "scale(1)", offset: 1 }),
      ]),
    ),
  ]),
]);

// Height expand/collapse animation
export const expandCollapse = trigger("expandCollapse", [
  state(
    "collapsed",
    style({ height: "0px", minHeight: "0", overflow: "hidden" }),
  ),
  state("expanded", style({ height: "*", overflow: "hidden" })),
  transition(
    "expanded <=> collapsed",
    animate("300ms cubic-bezier(0.4, 0.0, 0.2, 1)"),
  ),
]);

// Opacity fade with transform
export const fadeSlideIn = trigger("fadeSlideIn", [
  transition(":enter", [
    style({
      opacity: 0,
      transform: "translateY(20px)",
    }),
    animate(
      "300ms ease-out",
      style({
        opacity: 1,
        transform: "translateY(0)",
      }),
    ),
  ]),
  transition(":leave", [
    animate(
      "200ms ease-in",
      style({
        opacity: 0,
        transform: "translateY(-20px)",
      }),
    ),
  ]),
]);
