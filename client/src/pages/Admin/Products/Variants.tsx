import { type FC, createContext, useContext } from "react"

const VariantsContext = createContext<{
  variants: any[]
}>({
  variants: []
})

const List = () => {
  const { variants } = useContext(VariantsContext)

  return (
    <>
      {variants.map(() => (
        <></>
      ))}
    </>
  )
}

const Variants: FC<VariantsProps> = ({ variants }) => {
  return (
    <VariantsContext.Provider value={{ variants }}>
      <List />
    </VariantsContext.Provider>
  )
}

export default Variants

interface VariantsProps {
  variants: any[]
  onChange: (variants: any[]) => void
}