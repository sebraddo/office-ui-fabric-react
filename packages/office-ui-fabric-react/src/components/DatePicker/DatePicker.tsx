import { styled } from '../../Utilities';
import { DatePickerBase } from './DatePicker.base';
import { IDatePickerProps, IDatePickerStyleProps, IDatePickerStyles } from './DatePicker.types';
import { getStyles } from './DatePicker.Style'

export const DatePicker = styled<IDatePickerProps, IDatePickerStyleProps, IDatePickerStyles>(
  DatePickerBase,
  getStyles
);
