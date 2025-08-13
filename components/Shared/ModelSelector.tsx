type Props = {
  model: string
  setModel: (model: string) => void
}

export default function ModelSelector({ model, setModel }: Props) {
  return (
    <select className="border p-2 rounded" value={model} onChange={e => setModel(e.target.value)}>
      <option value="gpt-3.5">GPT‑3.5</option>
      <option value="gpt-4o-mini">GPT‑4o mini</option>
      <option value="gpt-4o">GPT‑4o</option>
    </select>
  )
}
