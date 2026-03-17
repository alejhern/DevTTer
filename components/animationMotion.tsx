import { motion } from "framer-motion";

import useMounted from "@/hooks/useMounted";

export default function AnimatedMotion({
  children,
  initial,
  animate,
  transition,
  className,
}: any) {
  const mounted = useMounted();

  // SSR o JS desactivado: contenido visible plano
  if (!mounted) return <div className={className}>{children}</div>;

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
