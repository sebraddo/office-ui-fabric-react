import { IDatePickerStyles } from './DatePicker.types';
import { memoizeFunction } from '../../Utilities';
import {
  mergeStyles,
} from '../../Styling';

export interface IDatePickerClassNames {
  //TODO: Comments
  root?: string;

  dateContainer?: string;

  dateTextField?: string;

  dateCallout?: string;

  dateCalendar?: string;

  timepickerTextField?: string;

  timeCombobox?: string;

  iconStyle?: string;

  timePickerIconStyle?: string;
}

export const getClassNames = memoizeFunction((
  styles: any,
  className: string,
): IDatePickerClassNames => {
  return {
    root: mergeStyles('ms-DatePicker', styles.root, className),
    dateContainer: mergeStyles('ms-DatePicker-Container', styles.dateContainer, className),
    dateTextField: mergeStyles('ms-DatePicker-TextField', styles.dateTextField, className),
    dateCallout: mergeStyles('ms-DatePicker-Callout', styles.dateCallout, className),
    dateCalendar: mergeStyles('ms-DatePicker-Calendar', styles.dateCalendar, className),
    timepickerTextField: mergeStyles('ms-TimePicker-TextField', styles.timepickerTextField, className),
    timeCombobox: mergeStyles('ms-timePicker-Combobox', styles.timeCombobox, className),
    iconStyle: mergeStyles('ms-icon', styles.iconStyle, className),
    timePickerIconStyle: mergeStyles('ms-timepicker-icon', styles.timePickerIconStyle, className)
  };
})