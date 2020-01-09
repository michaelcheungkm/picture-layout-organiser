import React from 'react'

import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarProvider, useSnackbar } from 'notistack'
import theme from './theme'

import useStyles from './style'

import Main from './Main'

const Wrapped = () => {
  const { enqueueSnackbar } = useSnackbar()
  return (<Main enqueueSnackbar={enqueueSnackbar} />)
}

const App = () => {

  const classes = useStyles()

  return (
    <div>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={5}
          classes={{
            variantInfo: classes.snackbarInfo
          }}
        >
          <Wrapped />
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
