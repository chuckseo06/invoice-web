"use client"

import useLocalStorageState from "use-local-storage-state"

export function useSidebar() {
  const [isOpen, setIsOpen] = useLocalStorageState("sidebar-open", {
    defaultValue: true,
  })

  return {
    isOpen: isOpen ?? true,
    toggle: () => setIsOpen((prev) => !prev),
    close: () => setIsOpen(false),
  }
}
