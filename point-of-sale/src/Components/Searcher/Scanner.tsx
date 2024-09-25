import { type FC } from 'react'
import { makeStyles } from '@fluentui/react-components'
import { useZxing } from "react-zxing"

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

const Scanner: FC<ScannerProps> = ({ onInput }) => {
  const styles = useStyles()

  const { ref: videoRef } = useZxing({
    onDecodeResult(result) {
      const code = result.getText()
      if (code) {
        onInput(code)
      }
    },
  })

  return (
    <div className={styles.root}>
      <video ref={videoRef}></video>
    </div>
  )
}

export default Scanner

interface ScannerProps {
  onInput: (value: string) => void
}