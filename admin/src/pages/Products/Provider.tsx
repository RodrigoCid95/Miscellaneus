import { type FC, useEffect, useState } from "react"
import { Dropdown, Option, Field, useId, Spinner, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components"

const FieldProvider: FC<FieldProviderProps> = ({ verification, onBlur, value, onChange }) => {
  const dropdownId = useId("provider")
  const [loading, setLoading] = useState<boolean>(true)
  const [providers, setProviders] = useState<Miscellaneous.Provider[]>([])

  useEffect(() => {
    fetch(`${window.location.origin}/api/providers`)
      .then(res => res.json())
      .then(providers => {
        setProviders(providers)
        setLoading(false)
      })
  }, [setLoading])

  const handleChange = (_: SelectionEvents, data: OptionOnSelectData) => {
    const providerId = Number(data.optionValue)
    const provider = providers.find(provider => provider.id === providerId)
    if (provider) {
      onChange(provider)
    }
  }

  return (
    <Field
      label="Proveedor"
      validationState={verification.state}
      validationMessage={verification.message}
    >
      {loading && <Spinner />}
      {!loading && (
        <Dropdown
          aria-labelledby={dropdownId}
          placeholder="Selecciona un proveedor"
          value={value?.name || ''}
          onOptionSelect={handleChange}
          onBlur={onBlur}
        >
          {providers.map(provider => (
            <Option key={provider.id} value={provider.id.toString()}>{provider.name}</Option>
          ))}
        </Dropdown>
      )}
    </Field>
  )
}

export default FieldProvider

interface FieldProviderProps {
  verification: Verification
  onBlur: () => void
  value: Miscellaneous.Product['provider'] | null
  onChange: (value: Miscellaneous.Product['provider']) => void
}