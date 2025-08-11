'use client'

interface ImportFileInputProps {
  inputRef?: React.RefObject<HTMLInputElement>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ImportFileInput({ inputRef, onChange }: ImportFileInputProps) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept=".csv, application/json"
      className="hidden"
      onChange={onChange}
      data-testid="staff-import-input"
    />
  )
}


