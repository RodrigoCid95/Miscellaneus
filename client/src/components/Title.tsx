import { type FC, useState, useEffect } from 'react'
import { makeStyles, Spinner, Title1 } from '@fluentui/react-components'

const useStyles = makeStyles({
  title: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
})

const Title: FC<TitleProps> = () => {
  const styles = useStyles()
  const [loading, setLoading] = useState<boolean>(true)
  const [config, setConfig] = useState<Miscellaneous.Config | null>(null)

  useEffect(() => {
    window.getConfig()
      .then(config => {
        setConfig(config)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <Spinner />
  }

  return <Title1 className={styles.title}>{config?.name || 'Miscellaneous'}</Title1>
}

export default Title

interface TitleProps {
}