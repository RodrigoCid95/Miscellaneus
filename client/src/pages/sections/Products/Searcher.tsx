import { type FC } from "react"
import { SearchBox } from "@fluentui/react-components"

const Searcher: FC<SearcherProps> = ({ onSearch }) => {
  return <SearchBox placeholder="Search..." onChange={(_, { value }) => onSearch(value)}/>
}

export default Searcher

interface SearcherProps {
  onSearch: (text: string) => void
}