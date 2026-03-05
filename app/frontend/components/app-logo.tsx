import ClubShield from "./club-shield"

export default function AppLogo() {
  return (
    <>
      <ClubShield size={32} />
      <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-tight font-semibold">
          CPB - Stats
        </span>
      </div>
    </>
  )
}
