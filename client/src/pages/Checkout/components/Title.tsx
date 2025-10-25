import { type FC, useState, useEffect } from 'react'
import { makeStyles, Spinner, Title1 } from '@fluentui/react-components'
import { models } from '../../../../wailsjs/go/models'
import { GetConfig } from '../../../../wailsjs/go/controllers/Config'

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
  const [config, setConfig] = useState<models.ConfigData | null>(null)

  useEffect(() => {
    GetConfig()
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