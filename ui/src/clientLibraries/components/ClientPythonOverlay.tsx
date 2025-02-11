// Libraries
import React, {FunctionComponent} from 'react'
import {connect} from 'react-redux'

// Components
import ClientLibraryOverlay from 'src/clientLibraries/components/ClientLibraryOverlay'
import TemplatedCodeSnippet from 'src/shared/components/TemplatedCodeSnippet'

// Constants
import {clientPythonLibrary} from 'src/clientLibraries/constants'

// Types
import {AppState} from 'src/types'

interface StateProps {
  org: string
}

type Props = StateProps

const ClientPythonOverlay: FunctionComponent<Props> = props => {
  const {
    name,
    url,
    initializePackageCodeSnippet,
    initializeClientCodeSnippet,
    executeQueryCodeSnippet,
    writingDataLineProtocolCodeSnippet,
    writingDataPointCodeSnippet,
    writingDataBatchCodeSnippet,
  } = clientPythonLibrary
  const {org} = props
  const server = window.location.origin

  return (
    <ClientLibraryOverlay title={`${name} Client Library`}>
      <p>
        For more detailed and up to date information check out the{' '}
        <a href={url} target="_blank">
          GitHub Repository
        </a>
      </p>
      <h5>Install Package</h5>
      <TemplatedCodeSnippet
        template={initializePackageCodeSnippet}
        label="Code"
      />
      <h5>Initialize the Client</h5>
      <TemplatedCodeSnippet
        template={initializeClientCodeSnippet}
        label="Python Code"
        defaults={{
          server: 'serverUrl',
          token: 'token',
        }}
        values={{
          server,
        }}
      />
      <h5>Write Data</h5>
      <p>Option 1: Use InfluxDB Line Protocol to write data</p>
      <TemplatedCodeSnippet
        template={writingDataLineProtocolCodeSnippet}
        label="Python Code"
        defaults={{
          bucket: 'bucketID',
          org: 'orgID',
        }}
        values={{
          org,
        }}
      />
      <p>Option 2: Use a Data Point to write data</p>
      <TemplatedCodeSnippet
        template={writingDataPointCodeSnippet}
        label="Python Code"
        defaults={{
          bucket: 'bucketID',
          org: 'orgID',
        }}
        values={{
          org,
        }}
      />
      <p>Option 3: Use a Batch Sequence to write data</p>
      <TemplatedCodeSnippet
        template={writingDataBatchCodeSnippet}
        label="Python Code"
        defaults={{
          bucket: 'bucketID',
          org: 'orgID',
        }}
        values={{
          org,
        }}
      />
      <h5>Execute a Flux query</h5>
      <TemplatedCodeSnippet
        template={executeQueryCodeSnippet}
        label="Python Code"
        defaults={{
          bucket: 'my_bucket',
          org: 'orgID',
        }}
        values={{
          org,
        }}
      />
    </ClientLibraryOverlay>
  )
}

const mstp = (state: AppState): StateProps => {
  const org = state.orgs.org.id

  return {
    org,
  }
}

export {ClientPythonOverlay}
export default connect<StateProps, {}, Props>(
  mstp,
  null
)(ClientPythonOverlay)
