import { styled } from '../../Utilities';
import { DatePickerBase } from './DatePicker.base';
import { IDatePickerProps, IDatePickerStyleProps, IDatePickerStyles } from './DatePicker.types';

export const DatePicker = styled<IDatePickerProps, IDatePickerStyleProps, IDatePickerStyles>(
  DatePickerBase,
  getStyles
);

export function getStyles(props: IDatePickerStyleProps): IDatePickerStyles {

  //By default the className only replies on the root level
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