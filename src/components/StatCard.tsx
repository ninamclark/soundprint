interface Props {
    label: string
    value: string
    caption: string
  }
  
  export default function StatCard({ label, value, caption }: Props) {
    return (
      <div>
        <h3 className="text-sm text-stone-400">{label}</h3>
        <p className="mt-1 text-5xl font-semibold tracking-tight">{value}</p>
        <p className="mt-2 text-sm text-stone-400">{caption}</p>
      </div>
    )
  }