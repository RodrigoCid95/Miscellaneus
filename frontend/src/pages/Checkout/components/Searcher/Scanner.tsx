import { type FC } from 'react'
import { makeStyles } from '@fluentui/react-components'
import { useZxing } from "react-zxing"
import { useSearcher } from '../../context/searcher'

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflow: 'hidden',
    "& video": {
      width: '100%',
      maxHeight: '32px',
      objectFit: 'cover',
      transform: 'scale(1.5)',
      transformOrigin: 'center',
    },
  },
})

const Scanner: FC<ScannerProps> = () => {
  const styles = useStyles()
  const { setValue, loadProducts } = useSearcher()

  const { ref: videoRef } = useZxing({
    onDecodeResult(result) {
      const code = result.getText()
      if (code) {
        setValue(code)
        loadProducts(code)
      }
    },
  })

  return (
    <div className={styles.root}>
      <video ref={videoRef as React.RefObject<HTMLVideoElement>}></video>
    </div>
  )
}

export default Scanner

interface ScannerProps {
}