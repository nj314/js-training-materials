/**
 * Problem originally authored by https://gist.github.com/mattpocock
 * Problem statement:
 * 1. When the page first loads, check if the user is logged in using a service.
 * 2. If the user is logged in, get the user's data from the API and save it to context. If getting the user's data fails, log them out.
 * 3. If the user isn't logged in, redirect them to the login page.
 * 4. The loggedOut state should accept a LOG_IN event which gets the user's data and directs them to the dashboard page.
 * 5. The loggedIn state should accept a LOG_OUT event which directs the user to a log in page.
 */
import { assign, createMachine } from "xstate";

type UserData = { id: string; firstName: string };

function fetchAuthStatus(): Promise<boolean> {
  return Promise.resolve(true);
}
function fetchUserData(): Promise<UserData> {
  return Promise.resolve({
    id: "1",
    firstName: "Nathan",
  });
}

const machine = createMachine({
  initial: "initializing",
  id: "auth",
  context: {
    page: "",
  },
  states: {
    initializing: {
      invoke: {
        id: "fetchAuthStatus",
        src: fetchAuthStatus,
        onDone: [
          { target: "loggedIn", cond: (ctx, e) => e.data === true },
          { target: "loggedOut" },
        ],
        onError: "loggedOut",
      },
    },
    loggedIn: {
      initial: "initializing",
      states: {
        initializing: {
          invoke: {
            id: "fetchUserData",
            src: fetchUserData,
            onDone: "ready",
            onError: { target: "error" },
          },
        },
        ready: {
          entry: assign({ page: "dashboard" }),
        },
        error: { type: "final" },
      },
      on: {
        LOG_OUT: "loggedOut",
      },
      exit: "loggedOut",
    },
    loggedOut: {
      entry: assign({ page: "login" }),
      on: {
        LOG_IN: "loggedIn",
      },
    },
  },
});
