import { IDatePickerProps, IDatePickerStyles, IDatePickerStyleProps, DatePickerFormat } from './DatePicker.types';
import { memoizeFunction } from '../../Utilities';
import { concatStyleSets, IStyle } from '../../Styling';
import { ResponsiveMode } from '../../utilities/decorators/withResponsiveMode';
import { IComboBox, IComboBoxStyles } from 'src/index.bundle';

export function getStyles(props: IDatePickerStyleProps): IDatePickerStyles {

  const { displayDatePickerFormat } = props;
  if (displayDatePickerFormat !== DatePickerFormat.dateOnly) {
    return getDateAndTimePickerStyle(props);
  }

  //Inheriting from existing behavior, classname only override on root level style
  const { responsiveMode, className, disabled, label } = props;
  return {
    root: [
      'ms-DatePicker',
      className],
    dateTextField: [
      'ms-DatePicker-TextField',
      disabled && {
        pointerEvents: 'initials',
        cursor: 'pointer'
      }],
    iconStyle: [
      'icon-style',
      {
        color: ' #666666',
        fontSize: '16px',
        lineHeight: '18px',
        position: 'absolute',
        bottom: label ? '5px' : 'unset',
        top: label ? 'unset' : '7px',
        right: '9px'
      },
      disabled && {
        pointerEvents: 'initial',
        cursor: 'pointer'
      }
    ]
  };
};

export function getDateAndTimePickerStyle(props: IDatePickerStyleProps): IDatePickerStyles {
  const { responsiveMode, className, disabled, label, displayDatePickerFormat } = props;
  return {
    root: [
      'ms-DatePicker',
      {
        display: 'flex',
        flexDirection: 'column'
      },
      className],
    dateContainer: [
      'ms-DatePicker-Container',
      {
        height: '100%',
        display: 'flex',
        minWidth: responsiveMode! <= ResponsiveMode.small ? '9rem' : '18rem',
        flexDirection: responsiveMode! <= ResponsiveMode.small ? 'column' : 'row'
      }],
    dateTextField: [
      'ms-DatePicker-TextField',
      {
        border: '1px solid transparent',
        selectors: {
          ':hover': {
            border: '1px solid rgb(226, 226, 226)'
          }
        },
        marginRight: responsiveMode! <= ResponsiveMode.small ? '0rem' : '0.5rem'
      }],
    dateCalendar: [
      'ms-DatePicker-Calendar',
      {
        border: '1px solid rgb(226, 226, 226)',
        boxShadow: 'none'
      }],
    iconStyle: [
      'icon-style',
      {
        color: ' #666666',
        fontSize: '16px',
        lineHeight: '18px',
        position: 'absolute',
        bottom: label ? '5px' : 'unset',
        top: label ? 'unset' : '7px',
        right: '9px'
      },
      disabled && {
        pointerEvents: 'initial',
        cursor: 'pointer'
      }
    ],
    timePickerIconStyle: [
      'ms-timepicker-icon',
      {
        fontSize: "16px",
        lineHeight: "18px"
      }]
  };
}

//This needs to be refactoried after combobox opt-in new mergeStyle
export const defaultTimeBoxStyle: Partial<IComboBoxStyles> = {
  root: {
    border: '1px solid #a6a6a6',
    margin: '0px',
    paddingRight: '10px',
    paddingLeft: '14px'
  },
  rootHovered: {
    selectors: {
      ':hover': {
        border: '1px solid #a6a6a6'
      }
    },
  },
  rootPressed: {
    selectors: {
      ':focus': {
        border: '1px solid #a6a6a6'
      }
    }
  },
  rootFocused: {
    selectors: {
      ':focus': {
        border: '1px solid #a6a6a6'
      }
    }
  },
  container: {
    border: '1px solid transparent'
  },
  callout: {
    boxShadow: 'none',
    borderColor: 'rgb(226, 226, 226)'
  }
}