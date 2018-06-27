import { styled } from '../../Utilities';
import { DatePickerBase } from './DatePicker.base';
import { IDatePickerProps, IDatePickerStyleProps, IDatePickerStyles } from './DatePicker.types';
import { getStyles } from './DatePicker.Style';

export const DatePicker = styled<IDatePickerProps, IDatePickerStyleProps, IDatePickerStyles>(
  DatePickerBase,
  getStyles
);

// Export 3 different controls for different getStyles(), and getProps()
// Revert the icon change
// Hand pointer on date
// Disabled mode change
// customizeTimeConverter
// Enum to boolean
// All upper case for default time

// OnRender function Component
// Utility function
