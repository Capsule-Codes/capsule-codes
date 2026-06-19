"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ProjectLightboxImage {
  src: string
  alt: string
}

interface ProjectLightboxProps {
  images: ProjectLightboxImage[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function ProjectLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ProjectLightboxProps) {
  const isOpen = index !== null
  const hasMultiple = images.length > 1
  const [displayIndex, setDisplayIndex] = useState(index ?? 0)

  useEffect(() => {
    if (index !== null) {
      setDisplayIndex(index)
    }
  }, [index])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    startIndex: displayIndex,
  })

  // Sync embla to the externally controlled `index`.
  useEffect(() => {
    if (!emblaApi || !isOpen) return
    if (emblaApi.selectedScrollSnap() !== displayIndex) {
      emblaApi.scrollTo(displayIndex, true)
    }
  }, [displayIndex, emblaApi, isOpen])

  // Report slide changes back up.
  const onSelect = useCallback(() => {
    if (!emblaApi || !isOpen) return
    const nextIndex = emblaApi.selectedScrollSnap()
    setDisplayIndex(nextIndex)
    onIndexChange(nextIndex)
  }, [emblaApi, isOpen, onIndexChange])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  // Keyboard navigation (Escape is handled by Dialog).
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        scrollPrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        scrollNext()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, scrollPrev, scrollNext])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[100vw] w-screen h-screen max-h-screen border-0 bg-black/95 p-0 sm:rounded-none grid-rows-1"
      >
        <DialogTitle className="sr-only">Image viewer</DialogTitle>
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <DialogClose
            aria-label="Close image viewer"
            className={cn(
              "absolute right-4 top-4 z-20 inline-flex size-11 items-center justify-center rounded-full",
              "border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-md",
              "transition hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-0",
            )}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </DialogClose>
          <div className="h-full w-full overflow-hidden" ref={emblaRef}>
            <div className="flex h-full touch-pan-y">
              {images.map((image, i) => (
                <div
                  key={i}
                  className="relative flex h-full min-w-0 flex-[0_0_100%] items-center justify-center p-4 md:p-12"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="100vw"
                    priority={i === displayIndex}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={scrollPrev}
                className={cn(
                  "absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground shadow-lg backdrop-blur",
                  "transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring md:left-6",
                )}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={scrollNext}
                className={cn(
                  "absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground shadow-lg backdrop-blur",
                  "transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring md:right-6",
                )}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
