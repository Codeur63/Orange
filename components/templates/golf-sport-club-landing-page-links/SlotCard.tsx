const micro = 'text-[12px] font-medium uppercase leading-[1.3]'

export default function SlotCard({ day, time, title, label = 'Temps fort', featured = false }: { day: string; time: string; title: string; label?: string; featured?: boolean }) {
  return (
    <div className={`flex min-h-[112px] w-full items-center gap-[16px] rounded-[18px] border p-[18px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.35)] ${
      featured ? 'border-[#000000] bg-[#000000]' : 'border-[#CCCCCC] bg-white'
    }`}>
      <span className={`flex h-[76px] w-[86px] shrink-0 flex-col items-center justify-center rounded-[12px] text-[#000000] transition-colors duration-500 ${featured ? 'bg-[#FF7900]' : 'bg-[#F5F5F5]'}`}>
        <span className={micro}>{day || '· · ·'}</span>
        <span className="text-[17px] font-medium leading-[1.2] tracking-[-0.015em]">{time.replace(':', ' h ')}</span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <span className={`${micro} ${featured ? 'text-[#FF7900]' : 'text-[#A64200]'}`}>{label}</span>
        <span className={`text-[16px] font-medium leading-[1.3] tracking-[-0.005em] transition-colors duration-500 ${featured ? 'text-[#FFFFFF]' : 'text-[#000000]'}`}>{title}</span>
      </span>
    </div>
  )
}
