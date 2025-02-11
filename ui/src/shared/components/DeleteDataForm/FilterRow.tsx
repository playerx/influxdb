// Libraries
import React, {FC} from 'react'
import {
  Button,
  ButtonShape,
  Form,
  IconFont,
  SelectDropdown,
} from '@influxdata/clockface'
import {connect} from 'react-redux'

// Components
import SearchableDropdown from 'src/shared/components/SearchableDropdown'

// Types
import {Filter} from 'src/types'

// Actions
import {setValuesByKey} from 'src/shared/actions/predicates'

interface Props {
  bucket: string
  filter: Filter
  keys: string[]
  onChange: (filter: Filter) => any
  onDelete: () => any
  orgID: string
  shouldValidate: boolean
  values: (string | number)[]
}

interface DispatchProps {
  setValuesByKey: (orgID: string, bucketName: string, keyName: string) => void
}

const FilterRow: FC<Props & DispatchProps> = ({
  bucket,
  filter: {key, equality, value},
  keys,
  onChange,
  onDelete,
  orgID,
  setValuesByKey,
  shouldValidate,
  values,
}) => {
  const keyErrorMessage =
    shouldValidate && key.trim() === '' ? 'Key cannot be empty' : null
  const equalityErrorMessage =
    shouldValidate && equality.trim() === '' ? 'Equality cannot be empty' : null
  const valueErrorMessage =
    shouldValidate && value.trim() === '' ? 'Value cannot be empty' : null

  const onChangeKey = input => onChange({key: input, equality, value})
  const onKeySelect = input => {
    setValuesByKey(orgID, bucket, input)
    onChange({key: input, equality, value})
  }
  const onChangeValue = input => onChange({key, equality, value: input})
  const onChangeEquality = e => onChange({key, equality: e, value})

  return (
    <div className="delete-data-filter">
      <Form.Element
        label="Tag Key"
        required={true}
        errorMessage={keyErrorMessage}
      >
        <SearchableDropdown
          className="dwp-filter-dropdown"
          searchTerm={key}
          emptyText="No Tags Found"
          searchPlaceholder="Search keys..."
          selectedOption={key}
          onSelect={onKeySelect}
          onChangeSearchTerm={onChangeKey}
          testID="dwp-filter-key-input"
          buttonTestID="tag-selector--dropdown-button"
          menuTestID="tag-selector--dropdown-menu"
          options={keys}
        />
      </Form.Element>
      <Form.Element
        label="Equality Filter"
        required={true}
        errorMessage={equalityErrorMessage}
      >
        <SelectDropdown
          className="dwp-filter-dropdown"
          options={['=', '!=']}
          selectedOption={equality}
          onSelect={onChangeEquality}
        />
      </Form.Element>
      <Form.Element
        label="Tag Value"
        required={true}
        errorMessage={valueErrorMessage}
      >
        <SearchableDropdown
          className="dwp-filter-dropdown"
          searchTerm={value}
          emptyText="No Tags Found"
          searchPlaceholder="Search values..."
          selectedOption={value}
          onSelect={onChangeValue}
          onChangeSearchTerm={onChangeValue}
          testID="dwp-filter-value-input"
          buttonTestID="tag-selector--dropdown-button"
          menuTestID="tag-selector--dropdown-menu"
          options={values}
        />
      </Form.Element>
      <Button
        className="delete-data-filter--remove"
        shape={ButtonShape.Square}
        icon={IconFont.Remove}
        onClick={onDelete}
      />
    </div>
  )
}

const mdtp = {setValuesByKey}

export default connect<{}, DispatchProps>(
  null,
  mdtp
)(FilterRow)
