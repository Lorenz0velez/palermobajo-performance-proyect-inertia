import { Link, router, usePage } from "@inertiajs/react"
import { LogOut, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface CpbHeaderProps {
  profileHref?: string
}

export default function CpbHeader({ profileHref = "/player/profile" }: CpbHeaderProps) {
  const { props } = usePage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const userName: string =
    (props as any).auth?.user?.name ??
    (props as any).current_user?.name ??
    ""

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  function handleLogout() {
    router.delete("/session")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bordo-800 text-white shadow-md h-14 flex items-center border-b-2 border-yellow-400/70">
      <div className="flex w-full items-center px-4 gap-2">

        {/* Left: Bienvenido + nombre */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-white/50 leading-none uppercase tracking-wide">Bienvenido</p>
          <p className="font-bold text-sm text-white leading-tight truncate">
            {userName ? userName.split(" ").slice(0, 2).join(" ") : "—"}
          </p>
        </div>

        {/* Center: Club Palermo Bajo */}
        <div className="flex-1 text-center">
          <p className="text-xs font-bold text-yellow-300 tracking-wide whitespace-nowrap">Club Palermo Bajo</p>
        </div>

        {/* Right: shield = dropdown */}
        <div className="flex-1 flex justify-end relative" ref={ref}>
          <button
            onClick={() => setOpen(v => !v)}
            className="focus:outline-none"
            aria-label="Menú de usuario"
          >
            <img
              src="/club-shield.png"
              alt="Palermo Bajo"
              className="h-10 w-10 object-contain drop-shadow-md hover:opacity-80 transition-opacity"
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
              {userName && (
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-400">Sesión iniciada como</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                </div>
              )}
              <Link
                href={profileHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4 text-gray-400" />
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
