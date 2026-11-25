interface Props {
    label: string
    value: string
    caption: string
  }
  
  export default function StatCard({ label, value, caption }: Props) {
    return (
      <div>
        <h3>{label}</h3>
        <p>{value}</p>
        <p>{caption}</p>
      </div>
    )
  }