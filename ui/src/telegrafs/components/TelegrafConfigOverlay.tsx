// Libraries
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

// Components
import {ErrorHandling} from 'src/shared/decorators/errors'
import TelegrafConfig from 'src/telegrafs/components/TelegrafConfig'
import {
  ComponentColor,
  Button,
  RemoteDataState,
  SpinnerContainer,
  TechnoSpinner,
  Overlay,
  ComponentStatus,
} from '@influxdata/clockface'

// Utils
import {downloadTextFile} from 'src/shared/utils/download'

// Types
import {AppState} from 'src/types'
import {ITelegraf as Telegraf} from '@influxdata/influx'

interface OwnProps {
  onClose: () => void
}

interface StateProps {
  telegraf: Telegraf
  status: RemoteDataState
  telegrafConfig: string
  configStatus: RemoteDataState
}

type Props = OwnProps & StateProps

@ErrorHandling
class TelegrafConfigOverlay extends PureComponent<Props> {
  public render() {
    return <>{this.overlay}</>
  }

  private get overlay(): JSX.Element {
    const {telegraf, status} = this.props

    return (
      <Overlay.Container maxWidth={1200}>
        <Overlay.Header
          title={`Telegraf Configuration - ${_.get(telegraf, 'name', '')}`}
          onDismiss={this.handleDismiss}
        />
        <Overlay.Body>
          <SpinnerContainer
            loading={status}
            spinnerComponent={<TechnoSpinner />}
          >
            <div className="config-overlay">
              <TelegrafConfig />
            </div>
          </SpinnerContainer>
        </Overlay.Body>
        <Overlay.Footer>
          <Button
            color={ComponentColor.Secondary}
            text="Download Config"
            onClick={this.handleDownloadConfig}
            status={this.buttonStatus}
          />
        </Overlay.Footer>
      </Overlay.Container>
    )
  }
  private get buttonStatus(): ComponentStatus {
    const {configStatus} = this.props
    if (configStatus === RemoteDataState.Done) {
      return ComponentStatus.Default
    }
    return ComponentStatus.Disabled
  }

  private handleDismiss = () => {
    this.props.onClose()
  }

  private handleDownloadConfig = () => {
    const {
      telegrafConfig,
      telegraf: {name},
    } = this.props
    downloadTextFile(telegrafConfig, name || 'telegraf', '.conf')
  }
}

const mstp = ({telegrafs, overlays}: AppState): StateProps => {
  const id = overlays.params.id

  return {
    telegraf: telegrafs.list.find(t => {
      return t.id === id
    }),
    status: telegrafs.status,
    telegrafConfig: telegrafs.currentConfig.item,
    configStatus: telegrafs.currentConfig.status,
  }
}

export default connect<StateProps, {}, {}>(
  mstp,
  null
)(TelegrafConfigOverlay)
