import type { UIAction, UIState } from "@/types";

export function vsCodeReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "COPY_START":
      return { ...state, copied: true };
    case "COPY_RESET":
      return { ...state, copied: false };
    case "FULLSCREEN_TOGGLE":
      return { ...state, fullScreen: !state.fullScreen };
    case "FULLSCREEN_EXIT":
      return { ...state, fullScreen: false };
    case "RUN_START":
      return { ...state, output: "", status: "running", showOutput: true };
    case "RUN_DONE":
      return { ...state, output: action.payload, status: "done" };
    case "RUN_ERROR":
      return { ...state, output: action.payload, status: "error" };
    case "OUTPUT_CLOSE":
      return { ...state, showOutput: false };
    default:
      return state;
  }
}
