import * as React from 'react';
import { DatePickerBase } from './DatePicker.base';
import { DayOfWeek, ICalendarProps } from '../../Calendar';
import { FirstWeekOfYear } from '../../utilities/dateValues/DateValues';
import { ICalendarFormatDateCallbacks } from '../Calendar/Calendar.types';
import { IStyle, ITheme } from '../../Styling';
import { IStyleFunction } from '../../Utilities';
import { IComboBoxStyles, IComboBoxOption } from '../ComboBox/ComboBox.types';
import { IWithResponsiveModeState, ResponsiveMode } from '../../utilities/decorators/withResponsiveMode';

export interface IDatePicker {
  /** Sets focus to the text field */
  focus(): void;
}

export interface IDatePickerProps extends React.Props<DatePickerBase>, IWithResponsiveModeState {
  /**
   * Optional callback to access the IDatePicker interface. Use this instead of ref for accessing
   * the public methods and properties of the component.
   */
  componentRef?: (component: IDatePicker) => void;

  /**
   * Pass calendar props to calendar component
   */
  calendarProps?: ICalendarProps;

  /**
   * Callback issued when a date is selected
   */
  onSelectDate?: (date: Date | null | undefined) => void;

  /**
   * Label for the DatePicker
   */
  label?: string;

  /**
   * Whether the DatePicker is a required field or not
   * @defaultvalue false
   */
  isRequired?: boolean;

  /**
   * Disabled state of the DatePicker.
   * @default false
   */
  disabled?: boolean;

  /**
   * Aria Label for TextField of the DatePicker for screen reader users.
   */
  ariaLabel?: string;

  /**
   * Aria label for date picker popup for screen reader users.
   * @defaultvalue Calendar
   */
  pickerAriaLabel?: string;

  /**
   * Whether the month picker is shown beside the day picker or hidden.
   * @defaultvalue true
   */
  isMonthPickerVisible?: boolean;

  /**
  * Show month picker on top of date picker when visible.
  * @defaultvalue false
  */
  showMonthPickerAsOverlay?: boolean;

  /**
   * Whether the DatePicker allows input a date string directly or not
   * @defaultvalue false
   */
  allowTextInput?: boolean;

  /**
   * Whether the DatePicker should open automatically when the control is focused
   * @defaultvalue false
   */
  disableAutoFocus?: boolean;

  /**
   * Placeholder text for the DatePicker
   */
  placeholder?: string;

  /**
    * Value of today. If null, current time in client machine will be used.
    */
  today?: Date;

  /**
   * Default value of the DatePicker, if any
   */
  value?: Date;

  /**
   * Optional method to format the chosen date to a string to display in the DatePicker
   * @defaultvalue date.toString()
   */
  formatDate?: (date?: Date) => string;

  /**
   * Optional method to parse the text input value to date, it is only useful when allowTextInput is set to true
   * @defaultvalue new Date(Date.parse(dateStr))
   */
  parseDateFromString?: (dateStr: string) => Date | null;

  /**
   * The first day of the week for your locale.
   * @defaultvalue DayOfWeek.Sunday
   */
  firstDayOfWeek?: DayOfWeek;

  /**
   * Localized strings to use in the DatePicker
   */
  strings?: IDatePickerStrings;

  /**
  * Whether the month picker should highlight the current month
  * @defaultvalue false
  */
  highlightCurrentMonth?: boolean;

  /**
  * Whether the calendar should show the week number (weeks 1 to 53) before each week row
  * @defaultvalue false
  */
  showWeekNumbers?: boolean;

  /**
  * Defines when the first week of the year should start, FirstWeekOfYear.FirstDay,
  * FirstWeekOfYear.FirstFullWeek or FirstWeekOfYear.FirstFourDayWeek are the possible values
  * @defaultvalue FirstWeekOfYear.FirstFullWeek
  */
  firstWeekOfYear?: FirstWeekOfYear;

  /**
   * Whether the "Go to today" link should be shown or not
   */
  showGoToToday?: boolean;

  /**
   * Determines if DatePicker has a border.
   * @defaultvalue false
   */
  borderless?: boolean;

  /**
   * Optional Classname for datepicker root element .
   */
  className?: string;

  /**
  * Apply additional formating to dates, for example localized date formatting.
  */
  dateTimeFormatter?: ICalendarFormatDateCallbacks;

  /**
   * The minimum allowable date.
   */
  minDate?: Date;

  /**
   * The maximum allowable date.
   */
  maxDate?: Date;

  /**
   * The initially highlighted date in the calendar picker
   */
  initialPickerDate?: Date;

  /**
   * This is to be removed after combobox refactoring to take getStyle functional style
   */
  timeComboboxStyles?: Partial<IComboBoxStyles>;

  /**
  * onChange event for time combobox
  */
  onChangeTimeCombobox?: (index?: number, value?: string) => void;

  /**
   * Collection of options for this ComboBox
   */
  timeOptions?: IComboBoxOption[];

  /**
   * Default display and selected key of time options
   */
  defaultSetTimeValue?: string;

  /**
   * Default display and selected key of time options
   */
  defaultSelectedTimeKey?: number;

  /**
   * If you supply your own timeOptions, please provide a corresponding converter
   * Input time as a string return from combobox
   * Output hour as number and minute as number
   */
  customizeTimeConverter?: (time: string) => { hour: number, minute: number };

  /**
   * Prop to indicate whether you want to display datepicker, timepicker or both date and time picker
   */
  displayDatePickerFormat?: DatePickerFormat;

  /**
  * Call to provide customized styling that will layer on top of the variant rules.
  */
  getStyles?: IStyleFunction<IDatePickerStyleProps, IDatePickerStyles>;

  /**
  * Callback that returns you the modified date time as a date type object
  * Need to verify the format
  */
  setSelectedDateTime?: (selectedDate: Date | null | undefined) => void;

  /**
  * Callback that runs after DatePicker's menu (Calendar) is closed
  */
  onAfterMenuDismiss?: () => void;

  /**
  * For time picker scenario, a default date is provided to return a proper date object
  */
  defaultDate?: Date;

  /**
  * For time picker scenario, a default date is provided to return a proper date object
  */
  byPassValidation?: boolean;

  /**
  * Formatter of date was done in different module, this is the output of the date formatter
  */
  displayFormattedDate?: string;

  /**
  * Compliment with showing displayFormattedDate, since we are bypassing the formatter pipeline here
  * consumer needs to supply the rawDate
  */
  rawDate?: Date;
}

export enum DatePickerFormat {
  dateOnly = 0,
  timeOnly = 1,
  bothDateAndDate = 2,
}

export interface IDatePickerStrings {
  /**
   * An array of strings for the full names of months.
   * The array is 0-based, so months[0] should be the full name of January.
   */
  months: string[];

  /**
   * An array of strings for the short names of months.
   * The array is 0-based, so shortMonths[0] should be the short name of January.
   */
  shortMonths: string[];

  /**
   * An array of strings for the full names of days of the week.
   * The array is 0-based, so days[0] should be the full name of Sunday.
   */
  days: string[];

  /**
   * An array of strings for the initials of the days of the week.
   * The array is 0-based, so days[0] should be the initial of Sunday.
   */
  shortDays: string[];

  /**
   * String to render for button to direct the user to today's date.
   */
  goToToday: string;

  /**
   * Error message to render for TextField if isRequired validation fails.
   */
  isRequiredErrorMessage?: string;

  /**
   * Error message to render for TextField if input date string parsing fails.
   */
  invalidInputErrorMessage?: string;

  /**
   * Error message to render for TextField if date boundary (minDate, maxDate) validation fails.
   */
  isOutOfBoundsErrorMessage?: string;

  /**
   * Aria-label for the "previous month" button.
   */
  prevMonthAriaLabel?: string;

  /**
   * Aria-label for the "next month" button.
   */
  nextMonthAriaLabel?: string;

  /**
   * Aria-label for the "previous year" button.
   */
  prevYearAriaLabel?: string;

  /**
   * Aria-label for the "next year" button.
   */
  nextYearAriaLabel?: string;
}

export interface IDatePickerStyleProps {
  displayDatePickerFormat?: DatePickerFormat;
  responsiveMode?: ResponsiveMode;
  className?: string;
  disabled?: boolean;
  label?: string;
}

export interface IDatePickerStyles {

  /**
   * Base styles for the root element of datepicker
   */
  root?: IStyle;

  /**
   * Base styles for the date container
   */
  dateContainer?: IStyle;

  /**
   * Base styles for the date container
   */
  dateContainerChildDiv?: IStyle;

  /**
   * Base styles for the date text field
   */
  dateTextField?: IStyle;

  /**
   * Base styles for the call out that wraps the calendar
   */
  dateCallout?: IStyle;

  /**
   * Base styles for the actually Calendar
   */
  dateCalendar?: IStyle;

  /**
   * Base styles for the time picker text field
   */
  timepickerTextField?: IStyle;

  /**
   * the icon renders in the date picker text field
   */
  iconStyle?: IStyle;

  /**
   * Base styles for Icon renders in the time picker combobox
   */
  timePickerIconStyle?: IStyle;
}
