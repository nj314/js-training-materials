/**
 * Problem statement: https://gist.github.com/nj314/c96291ba9b6d00033be4f2b632c482f9
 * Problem originally authored by https://gist.github.com/mattpocock
 */
import { assign, createMachine } from "xstate";

const NetworkQualityRating = {
  disconnected: 0,
  veryBad: 1,
  bad: 2,
  good: 3,
  strong: 4,
};
type NetworkQuality = keyof typeof NetworkQualityRating;

type NetworkQualityEvent =
  | {
      type: "REPORT_NETWORK_QUALITY";
      value: NetworkQuality;
    }
  | {
      type: "DISMISS_NETWORK_QUALITY_WARNING";
    };
type Context = { currentQuality: number };
const machine = createMachine<Context, NetworkQualityEvent>(
  {
    context: {
      currentQuality: NetworkQualityRating.disconnected,
    },
    initial: "hidden",
    states: {
      hidden: {
        on: {
          REPORT_NETWORK_QUALITY: {
            cond: "qualityIsBadOrWorse",
            target: "shown",
          },
        },
      },
      shown: {
        initial: "stabilizing",
        states: {
          stabilizing: {
            after: {
              2000: "stabilized",
            },
          },
          stabilized: {
            always: {
              cond: "qualityIsGoodOrBetter",
              target: "done",
            },
            on: {
              REPORT_NETWORK_QUALITY: {
                cond: "qualityIsGoodOrBetter",
                target: "done",
              },
            },
          },
          done: {
            type: "final",
          },
        },
        onDone: "hidden",
      },
      permanentlyHidden: {},
    },
    on: {
      REPORT_NETWORK_QUALITY: {
        actions: assign((ctx, e) => ({
          currentQuality: NetworkQualityRating[e.value],
        })),
      },
      DISMISS_NETWORK_QUALITY_WARNING: "permanentlyHidden",
    },
  },
  {
    guards: {
      qualityIsBadOrWorse: (ctx, e) => {
        if (e.type !== "REPORT_NETWORK_QUALITY") return false;
        return NetworkQualityRating[e.value] <= NetworkQualityRating.bad;
      },
      qualityIsGoodOrBetter: (ctx, e) => {
        if (e.type !== "REPORT_NETWORK_QUALITY") return false;
        return NetworkQualityRating[e.value] > NetworkQualityRating.bad;
      },
    },
  }
);
