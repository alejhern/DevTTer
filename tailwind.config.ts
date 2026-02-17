// tailwind.config.ts
import { heroui } from "@heroui/theme";

export default {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  plugins: [heroui()],
};
