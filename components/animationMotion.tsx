import { motion, useReducedMotion } from "framer-motion";

import useMounted from "@/hooks/useMounted";

export default function AnimatedMotion({
  children,
  initial,
  animate,
  transition,
  className,
}: any) {
  const isMounted = useMounted();
  const shouldReduceMotion = useReducedMotion();

  // SSR o JS desactivado: contenido visible plano
  if (!isMounted || shouldReduceMotion)
    return <div className={className}>{children}</div>;

  // Cliente activo: Motion animando
  return (
    <motion.div
      animate={animate}
      className={className}
      initial={initial}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
