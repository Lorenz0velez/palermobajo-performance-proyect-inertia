interface ClubShieldProps {
  size?: number
  className?: string
}

export default function ClubShield({ size = 40, className }: ClubShieldProps) {
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 100 110"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield outer border - gold */}
      <path
        d="M50,2 L96,2 L96,62 C96,84 75,100 50,109 C25,100 4,84 4,62 L4,2 Z"
        fill="#D4A017"
      />
      {/* Shield inner fill - deep burgundy */}
      <path
        d="M50,7 L91,7 L91,62 C91,82 71,97 50,106 C29,97 9,82 9,62 L9,7 Z"
        fill="#6B0D1A"
      />

      {/* CLUB text */}
      <text
        x="50" y="20"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="bold"
        fontFamily="serif"
        letterSpacing="2"
      >
        CLUB
      </text>

      {/* Spider body - thorax (upper) */}
      <ellipse cx="50" cy="52" rx="10" ry="7" fill="#A8A8A8" />

      {/* Spider abdomen (lower) */}
      <ellipse cx="50" cy="65" rx="9" ry="8" fill="#A8A8A8" />

      {/* Yellow diamond shield on body */}
      <path d="M50,46 L57,52 L50,58 L43,52 Z" fill="#D4A017" />
      {/* Inner diamond detail */}
      <path d="M50,49 L54,52 L50,55 L46,52 Z" fill="#F5C842" />

      {/* Left legs - 3 pairs */}
      <path d="M40,50 Q34,46 27,43" stroke="#A8A8A8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M40,53 Q33,52 26,53" stroke="#A8A8A8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M40,57 Q34,59 28,64" stroke="#A8A8A8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Right legs - 3 pairs */}
      <path d="M60,50 Q66,46 73,43" stroke="#A8A8A8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M60,53 Q67,52 74,53" stroke="#A8A8A8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M60,57 Q66,59 72,64" stroke="#A8A8A8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Left pincer */}
      <path d="M45,45 C43,40 39,37 37,39" stroke="#A8A8A8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M37,39 C35,40 35,43 37,44" stroke="#A8A8A8" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Right pincer */}
      <path d="M55,45 C57,40 61,37 63,39" stroke="#A8A8A8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M63,39 C65,40 65,43 63,44" stroke="#A8A8A8" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* PALERMO BAJO text */}
      <text
        x="50" y="89"
        textAnchor="middle"
        fill="white"
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="serif"
        letterSpacing="0.8"
      >
        PALERMO BAJO
      </text>
    </svg>
  )
}
