import React from 'react';
import { CrossIcon } from './indicators';

export const multiValueCSS = ({
  theme: { spacing, borderRadius, colors }
}) => ({
  label: 'multiValue',
  backgroundColor: colors.neutral10,
  borderRadius: borderRadius / 2,
  display: 'flex',
  margin: spacing.baseUnit / 2,
  minWidth: 0 // resolves flex/text-overflow bug
});

export const multiValueLabelCSS = ({
  theme: { borderRadius, colors },
  cropWithEllipsis
}) => ({
  borderRadius: borderRadius / 2,
  color: colors.neutral80,
  fontSize: '85%',
  overflow: 'hidden',
  padding: 3,
  paddingLeft: 6,
  textOverflow: cropWithEllipsis ? 'ellipsis' : null,
  whiteSpace: 'nowrap'
});

export const multiValueRemoveCSS = ({
  theme: { spacing, borderRadius, colors },
  isFocused
}) => ({
  alignItems: 'center',
  borderRadius: borderRadius / 2,
  backgroundColor: isFocused && colors.dangerLight,
  display: 'flex',
  paddingLeft: spacing.baseUnit,
  paddingRight: spacing.baseUnit,
  ':hover': {
    backgroundColor: colors.dangerLight,
    color: colors.danger,
  }
});

export const MultiValueGeneric = ({
  children,
  innerProps,
}) => <div {...innerProps}>{children}</div>;

export const MultiValueContainer = MultiValueGeneric;
export const MultiValueLabel = MultiValueGeneric;

export function MultiValueRemove({
  children,
  innerProps
}) {
  return <div {...innerProps}>{children || <CrossIcon size={14} />}</div>;
}

const MultiValue = (props) => {
  const {
    children,
    className,
    components,
    data,
    innerProps,
    removeProps,
    selectProps
  } = props;

  const { Container, Label, Remove } = components;

  return (
        <Container
          data={data}
          innerProps={{
			...innerProps,
			className
          }}
          selectProps={selectProps}
        >
          <Label
            data={data}
            innerProps={{
              className
            }}
            selectProps={selectProps}
          >
            {children}
          </Label>
          <Remove
            data={data}
            innerProps={{
              className,
              ...removeProps,
            }}
            selectProps={selectProps}
          />
        </Container>
  );
};

MultiValue.defaultProps = {
  cropWithEllipsis: true,
};

export default MultiValue;
