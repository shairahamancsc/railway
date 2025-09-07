
"use client"
import { useEffect } from 'react'
import { usePathname } from 'next/navigation';
import Lenis from '@studio-freight/lenis'

const useSmoothScroll = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    if (isDashboard) {
      // Don't initialize smooth scrolling on dashboard pages
      return;
    }

    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [isDashboard])
}

export default useSmoothScroll
