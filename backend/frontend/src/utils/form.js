import React from 'react'
import Dropzone from 'react-dropzone'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'

export const renderTextField = ({
  className,
  input,
  name,
  label,
  meta: { touched, error },
  fullWidth,
  ...custom
}) => (
  <FormControl
    className={className}
    error={(touched && !!error)}
    aria-describedby='name-error-text'
    fullWidth={fullWidth}
    {...custom}
  >
    <InputLabel htmlFor={name} {...custom}>{label}</InputLabel>
    <Input id={name} {...input} {...custom}/>
    <FormHelperText id={`${name}-error-text`}>{touched && error}</FormHelperText>
  </FormControl>
)

export const renderSelectField = ({
  className,
  input,
  name,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <FormControl
    className={className}
    error={(touched && !!error)}
    {...custom}
  >
    <InputLabel htmlFor={name}>{ label }</InputLabel>
    <Select
      onChange={(event, index, value) => input.onChange(value)}
      inputProps={input}
      children={children}
      {...input}
      {...custom}
    />
    <FormHelperText id={`${name}-error-text`}>{touched && error}</FormHelperText>
  </FormControl>
)

export const renderDropzoneInput = (field) => {
  const files = field.input.value;
  return (
    <div>
      <Dropzone
        name={field.name}
        onDrop={( filesToUpload, e ) => {
          field.onDrop(filesToUpload)
          return field.input.onChange(filesToUpload)
        }}
      >
        <div>Try dropping some files here, or click to select files to upload.</div>
      </Dropzone>
      {field.meta.touched &&
        field.meta.error &&
        <span className="error">{field.meta.error}</span>}
      {files && Array.isArray(files) && (
        <ul>
          { files.map((file, i) => <li key={i}>{file.name}</li>) }
        </ul>
      )}
    </div>
  )
}
