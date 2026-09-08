/** Abstract category artwork, never a photograph of a stocked product. */
export function OpticalIllustration({ label }: { label: string }) {
  const name = label.toLocaleLowerCase('tr-TR');
  const isSun = name.includes('güneş');
  const isFrame = isSun || name.includes('çerçeve') || name.includes('gözlük');
  return <svg viewBox="0 0 440 240" fill="none" aria-hidden="true" className="optical-illustration">
    {isFrame ? <g transform="rotate(-9 220 120)">
      <path d="M66 100 45 73M374 100l23-27M188 112q32-25 64 0" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M64 96q50-16 121 0l-8 64q-8 30-56 26-48-4-52-38ZM255 96q71-16 121 0l-5 52q-4 34-52 38-48 4-56-26Z" fill={isSun ? '#36483e' : '#dae6e4'} stroke="currentColor" strokeWidth="9" />
      <path d="m87 110 64-5M278 109l65-4" stroke="white" strokeOpacity=".4" strokeWidth="3" strokeLinecap="round" />
    </g> : <g>
      <ellipse cx="190" cy="120" rx="74" ry="87" transform="rotate(-22 190 120)" fill="#d9e5e2" fillOpacity=".55" stroke="#819f98" strokeWidth="2" />
      <ellipse cx="259" cy="123" rx="74" ry="87" transform="rotate(22 259 123)" fill="#e4eaf3" fillOpacity=".7" stroke="#8e9eb5" strokeWidth="2" />
      <path d="M160 57q-34 23-30 64M280 58q35 28 30 65" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <path d="M159 169q50-35 123-3" stroke="#819f98" strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="4 5" />
    </g>}
  </svg>;
}
