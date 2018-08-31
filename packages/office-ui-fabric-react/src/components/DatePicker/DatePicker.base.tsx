import * as React from 'react';
import {
  IDatePickerProps,
  IDatePickerStrings,
  DatePickerFormat,
  IDatePickerStyles,
  IDatePickerStyleProps
} from './DatePicker.types';
import {
  Calendar,
  ICalendar,
  DayOfWeek
} from '../../Calendar';
import { FirstWeekOfYear } from '../../utilities/dateValues/DateValues';
import { Callout } from '../../Callout';
import { DirectionalHint } from '../../common/DirectionalHint';
import { TextField, ITextField } from '../../TextField';
import { ComboBox, IComboBoxProps, IComboBoxOption, } from '../../ComboBox';
import { Label } from '../../Label';
import {
  autobind,
  BaseComponent,
  KeyCodes,
  customizable,
  classNamesFunction
} from '../../Utilities';
import { compareDates, compareDatePart } from '../../utilities/dateMath/DateMath';
import { IIconProps, IIconStyles } from '../Icon/Icon.types';
import { withResponsiveMode, ResponsiveMode } from '../../utilities/decorators/withResponsiveMode';
import { defaultTimeBoxStyle } from './DatePicker.Style';
import { concatStyleSets } from '../../Styling';

const getClassNames = classNamesFunction<IDatePickerStyleProps, IDatePickerStyles>();

export interface IDatePickerState {
  selectedDate?: Date;
  selectedTime?: string;
  selectedIndex?: number;
  formattedDate?: string;
  isDatePickerShown?: boolean;
  errorMessage?: string;
}

const DEFAULT_STRINGS: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],

  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],

  shortDays: [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S'
  ],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year'
};

const twelveHourTimeOptions = [
  { key: '0', text: '12:00 AM' },
  { key: '1', text: '12:30 AM' },
  { key: '2', text: '1:00 AM' },
  { key: '3', text: '1:30 AM' },
  { key: '4', text: '2:00 AM' },
  { key: '5', text: '2:30 AM' },
  { key: '6', text: '3:00 AM' },
  { key: '7', text: '3:30 AM' },
  { key: '8', text: '4:00 AM' },
  { key: '9', text: '4:30 AM' },
  { key: '10', text: '5:00 AM' },
  { key: '11', text: '5:30 AM' },
  { key: '12', text: '6:00 AM' },
  { key: '13', text: '6:30 AM' },
  { key: '14', text: '7:00 AM' },
  { key: '15', text: '7:30 AM' },
  { key: '16', text: '8:00 AM' },
  { key: '17', text: '8:30 AM' },
  { key: '18', text: '9:00 AM' },
  { key: '19', text: '9:30 AM' },
  { key: '20', text: '10:00 AM' },
  { key: '21', text: '10:30 AM' },
  { key: '22', text: '11:00 AM' },
  { key: '23', text: '11:30 AM' },
  { key: '24', text: '12:00 PM' },
  { key: '25', text: '12:30 PM' },
  { key: '26', text: '1:00 PM' },
  { key: '27', text: '1:30 PM' },
  { key: '28', text: '2:00 PM' },
  { key: '29', text: '2:30 PM' },
  { key: '30', text: '3:00 PM' },
  { key: '31', text: '3:30 PM' },
  { key: '32', text: '4:00 PM' },
  { key: '33', text: '4:30 PM' },
  { key: '34', text: '5:00 PM' },
  { key: '35', text: '5:30 PM' },
  { key: '36', text: '6:00 PM' },
  { key: '37', text: '6:30 PM' },
  { key: '38', text: '7:00 PM' },
  { key: '39', text: '7:30 PM' },
  { key: '40', text: '8:00 PM' },
  { key: '41', text: '8:30 PM' },
  { key: '42', text: '9:00 PM' },
  { key: '43', text: '9:30 PM' },
  { key: '44', text: '10:00 PM' },
  { key: '45', text: '10:30 PM' },
  { key: '46', text: '11:00 PM' },
  { key: '47', text: '11:30 PM' }
]

const twentyFourHourTimeOptions = [
  { key: '0', text: '00:00' },
  { key: '1', text: '00:30' },
  { key: '2', text: '01:00' },
  { key: '3', text: '01:30' },
  { key: '4', text: '02:00' },
  { key: '5', text: '02:30' },
  { key: '6', text: '03:00' },
  { key: '7', text: '03:30' },
  { key: '8', text: '04:00' },
  { key: '9', text: '04:30' },
  { key: '10', text: '05:00' },
  { key: '11', text: '05:30' },
  { key: '12', text: '06:00' },
  { key: '13', text: '06:30' },
  { key: '14', text: '07:00' },
  { key: '15', text: '07:30' },
  { key: '16', text: '08:00' },
  { key: '17', text: '08:30' },
  { key: '18', text: '09:00' },
  { key: '19', text: '09:30' },
  { key: '20', text: '10:00' },
  { key: '21', text: '10:30' },
  { key: '22', text: '11:00' },
  { key: '23', text: '11:30' },
  { key: '24', text: '12:00' },
  { key: '25', text: '12:30' },
  { key: '26', text: '13:00' },
  { key: '27', text: '13:30' },
  { key: '28', text: '14:00' },
  { key: '29', text: '14:30' },
  { key: '30', text: '15:00' },
  { key: '31', text: '15:30' },
  { key: '32', text: '16:00' },
  { key: '33', text: '16:30' },
  { key: '34', text: '17:00' },
  { key: '35', text: '17:30' },
  { key: '36', text: '18:00' },
  { key: '37', text: '18:30' },
  { key: '38', text: '19:00' },
  { key: '39', text: '19:30' },
  { key: '40', text: '20:00' },
  { key: '41', text: '20:30' },
  { key: '42', text: '21:00' },
  { key: '43', text: '21:30' },
  { key: '44', text: '22:00' },
  { key: '45', text: '22:30' },
  { key: '46', text: '23:00' },
  { key: '47', text: '23:30' }
]

@withResponsiveMode
export class DatePickerBase extends BaseComponent<IDatePickerProps, IDatePickerState> {
  public static defaultProps: IDatePickerProps = {
    allowTextInput: false,
    formatDate: (date: Date) => {
      if (date) {
        return date.toDateString();
      }

      return '';
    },
    parseDateFromString: (dateStr: string) => {
      const date = Date.parse(dateStr);
      if (date) {
        return new Date(date);
      }

      return null;
    },
    firstDayOfWeek: DayOfWeek.Sunday,
    initialPickerDate: new Date(),
    isRequired: false,
    isMonthPickerVisible: true,
    showMonthPickerAsOverlay: false,
    strings: DEFAULT_STRINGS,
    highlightCurrentMonth: false,
    borderless: false,
    pickerAriaLabel: 'Calender',
    showWeekNumbers: false,
    firstWeekOfYear: FirstWeekOfYear.FirstDay,
    showGoToToday: true,
    dateTimeFormatter: undefined,
    displayDatePickerFormat: DatePickerFormat.dateOnly,
    isRTL: false,
    isTwentyFourHourTimeFormat: false
  };

  private _root: HTMLElement;
  private _calendar: ICalendar;
  private _datePickerDiv: HTMLDivElement;
  private _textField: ITextField;
  private _preventFocusOpeningPicker: boolean;
  private _focusOnSelectedDateOnUpdate: boolean;
  private _timeOptions: { key: string, text: string }[];
  // Bug on IE11 onTextBlur will fire when user user calendar to pick a date
  // whereas chrome, firefox will not
  private _formattedValueChanged?: boolean;

  constructor(props: IDatePickerProps) {
    super(props);

    this._timeOptions = props.isTwentyFourHourTimeFormat ? twentyFourHourTimeOptions : twelveHourTimeOptions;
    const { formatDate, value, displayFormattedDate, rawDate, defaultSetTimeValue } = props;
    const defaultSelectedTimeKey = (this.props.defaultSelectedTimeKey) ? this.props.defaultSelectedTimeKey : 10;
    const defaultTime = (this.props.displayDatePickerFormat === DatePickerFormat.dateOnly) ? this._timeOptions[0].text : (this.props.timeOptions ? this.props.timeOptions[defaultSelectedTimeKey].text : this._timeOptions[defaultSelectedTimeKey].text);

    this.state = {
      selectedDate: value || rawDate || undefined,
      selectedTime: defaultSetTimeValue || defaultTime,
      formattedDate: (formatDate && value) ? formatDate(value) : displayFormattedDate || '',
      isDatePickerShown: false,
      errorMessage: undefined
    };

    this._preventFocusOpeningPicker = false;
    this._formattedValueChanged = false;
  }

  public componentWillReceiveProps(nextProps: IDatePickerProps) {

    const { formatDate, isRequired, strings, value, minDate, maxDate, defaultSetTimeValue, parseDateFromString } = nextProps;

    if (compareDates(this.props.minDate!, nextProps.minDate!) &&
      compareDates(this.props.maxDate!, nextProps.maxDate!) &&
      this.props.isRequired === nextProps.isRequired &&
      (compareDates(this.state.selectedDate!, value!)) &&
      this.props.formatDate === formatDate &&
      this.props.displayFormattedDate === nextProps.displayFormattedDate &&
      this.props.defaultSetTimeValue === nextProps.defaultSetTimeValue) {
      // if the props we care about haven't changed, don't run validation or updates
    }

    let errorMessage = (isRequired && !value) ? (strings!.isRequiredErrorMessage || '*') : undefined;

    if (!errorMessage && value) {
      errorMessage = this._isDateOutOfBounds(value!, minDate, maxDate) ? strings!.isOutOfBoundsErrorMessage || '*' : undefined;
    }

    // Set error message
    this.setState({
      errorMessage: errorMessage
    });

    // Issue# 1274: Check if the date value changed from old value, i.e., if indeed a new date is being
    // passed in or if the formatting function was modified. We only update the selected date if either of these
    // had a legit change.
    const oldValue = this.state.selectedDate;
    const formattedDate = nextProps.displayFormattedDate;
    if (value !== undefined && !compareDates(oldValue!, value!) || this.props.formatDate !== formatDate) {
      this.setState({
        selectedDate: value || undefined,
        formattedDate: (formatDate && (value || oldValue)) ? formatDate(oldValue || value) : '',
      });
    } else if (formattedDate || this.props.defaultSetTimeValue !== nextProps.defaultSetTimeValue) {
      const selectedDate = this.calculatingTime(defaultSetTimeValue!, parseDateFromString!(formattedDate!)!);

      if (selectedDate) {
        this.setState({
          formattedDate: formattedDate,
          selectedDate: selectedDate,
          selectedTime: defaultSetTimeValue
        });
      }
    }

    return true;
  }

  public calculatingTime(newtime: string, newDate?: Date) {
    const time = this._parseHourAndTime(newtime);
    time.hour = (time.hour) ? time.hour : 0;
    time.minute = (time.minute) ? time.minute : 0;

    if (!newDate && newDate !== '') {
      // Reset invalid input field, if formatting is available
      this.setState({
        formattedDate: this.props.displayFormattedDate
      });
    }

    // Return the correct date object with the time modified
    const updatedDate = (newDate || newDate === '' ? newDate : this.state.selectedDate as Date);

    if (updatedDate) {
      updatedDate.setHours(time.hour, time.minute);
      return updatedDate;
    } else if (updatedDate === '') {
      return updatedDate;
    }

    return null;
  }

  public setSelectedDateTime(selectedDate: Date | undefined | null) {

    const { setSelectedDateTime } = this.props;
    // Prop callback
    if (setSelectedDateTime) {
      setSelectedDateTime(selectedDate);
    }
  }

  public render() {
    const {
      firstDayOfWeek,
      strings,
      label,
      initialPickerDate,
      isRequired,
      disabled,
      ariaLabel,
      pickerAriaLabel,
      placeholder,
      allowTextInput,
      borderless,
      className,
      minDate,
      maxDate,
      calendarProps,
      responsiveMode,
      displayDatePickerFormat,
      timeComboboxStyles,
      defaultSetTimeValue,
      getStyles
    } = this.props;
    const timeOptions = (this.props.timeOptions) ? this.props.timeOptions : this._timeOptions;
    const { isDatePickerShown, formattedDate, selectedDate, errorMessage } = this.state;
    const classNames = getClassNames(getStyles, { className: className!, disabled, responsiveMode, label, displayDatePickerFormat });

    const buttonIconProps: IIconProps = {
      iconName: 'Clock',
      className: classNames.timePickerIconStyle
    };

    const textFieldIconStyles = this.props.isRTL ? {
      right: 'auto',
      left: '9px',
      'margin-left': '-25px',
      'margin-right': 'auto',
      'padding-right': '20px',
      'padding-left': 'unset',
      'text-align': 'right'
    } : {};

    const timeComboboxCustomizedStyles = concatStyleSets(defaultTimeBoxStyle, timeComboboxStyles);

    return (
      <div className={ classNames.root } ref={ this._resolveRef('_root') }>
        { label && (
          <Label required={ isRequired }>{ label }</Label>
        ) }
        <div className={ classNames.dateContainer } >
          { displayDatePickerFormat !== DatePickerFormat.timeOnly &&
            <div className={ classNames.dateContainerChildDiv } ref={ this._resolveRef('_datePickerDiv') }>
              <TextField
                className={ classNames.dateTextField }
                ariaLabel={ ariaLabel }
                aria-haspopup='true'
                aria-expanded={ isDatePickerShown }
                required={ isRequired }
                disabled={ disabled }
                onKeyDown={ this._onTextFieldKeyDown }
                onFocus={ this._onTextFieldFocus }
                onBlur={ this._onTextFieldBlur }
                onClick={ this._onTextFieldClick }
                onChanged={ this._onTextFieldDateChanged }
                errorMessage={ errorMessage }
                placeholder={ placeholder }
                borderless={ borderless }
                iconProps={ {
                  iconName: 'Calendar',
                  onClick: this._onIconClick,
                  className: classNames.iconStyle,
                  style: textFieldIconStyles
                } }
                readOnly={ !allowTextInput }
                value={ formattedDate }
                componentRef={ this._resolveRef('_textField') }
                role={ allowTextInput ? 'combobox' : 'menu' }
              />
            </div> }
          { displayDatePickerFormat !== DatePickerFormat.dateOnly && <ComboBox
            selectedKey={ `${this.state.selectedIndex}` }
            defaultSelectedKey={ `${this.props.defaultSelectedTimeKey}` }
            disabled={ disabled }
            id='Basicdrop1'
            ariaLabel='Basic ComboBox example'
            styles={ timeComboboxCustomizedStyles }
            onChanged={ this._onTextFieldTimeChanged }
            value={ this.state.selectedTime }
            allowFreeform={ true }
            autoComplete='on'
            options={ timeOptions }
            useComboBoxAsMenuWidth
            buttonIconProps={ buttonIconProps }
            isRTL={ this.props.isRTL }
          /> }
        </div>
        { isDatePickerShown && (
          <Callout
            role='dialog'
            preventDismissOnScroll
            ariaLabel={ pickerAriaLabel }
            isBeakVisible={ false }
            className={ classNames.dateCalendar }
            gapSpace={ 0 }
            doNotLayer={ false }
            target={ this._datePickerDiv }
            directionalHint={ DirectionalHint.bottomLeftEdge }
            onDismiss={ this._calendarDismissed }
            onPositioned={ this._onCalloutPositioned }
          >
            <Calendar
              { ...calendarProps }
              onSelectDate={ this._onSelectDate }
              onDismiss={ this._calendarDismissed }
              isMonthPickerVisible={ this.props.isMonthPickerVisible }
              showMonthPickerAsOverlay={ this.props.showMonthPickerAsOverlay }
              today={ this.props.today }
              value={ selectedDate || initialPickerDate }
              firstDayOfWeek={ firstDayOfWeek }
              strings={ strings! }
              highlightCurrentMonth={ this.props.highlightCurrentMonth }
              showWeekNumbers={ this.props.showWeekNumbers }
              firstWeekOfYear={ this.props.firstWeekOfYear }
              showGoToToday={ this.props.showGoToToday }
              dateTimeFormatter={ this.props.dateTimeFormatter }
              minDate={ minDate }
              maxDate={ maxDate }
              componentRef={ this._resolveRef('_calendar') }
            />
          </Callout>
        )
        }
      </div>
    );
  }

  public focus(): void {
    if (this._textField) {
      this._textField.focus();
    }
  }

  @autobind
  private _onSelectDate(date: Date) {
    const { formatDate, onSelectDate, displayFormattedDate } = this.props;

    this.setState({
      selectedDate: date,
      isDatePickerShown: false,
      formattedDate: formatDate && date ? formatDate(date) : displayFormattedDate || '',
    });

    if (onSelectDate) {
      onSelectDate(date);
    }

    const modifiedTime = this.calculatingTime(this.state.selectedTime as string, date);
    this.setSelectedDateTime(modifiedTime);

    this.focus();
    this._preventFocusOpeningPicker = true;
  }

  @autobind
  private _onCalloutPositioned() {
    this._calendar.focus();
  }

  @autobind
  private _onTextFieldFocus(ev: React.FocusEvent<HTMLElement>) {
    if (this.props.disableAutoFocus) {
      return;
    }

    if (!this.props.allowTextInput) {
      if (!this._preventFocusOpeningPicker) {
        this._showDatePickerPopup();
      } else {
        this._preventFocusOpeningPicker = false;
      }
    }
  }

  @autobind
  private _onTextFieldBlur(ev: React.FocusEvent<HTMLElement>) {
    this._validateTextInput();

    if (this._formattedValueChanged) {
      const { parseDateFromString } = this.props;
      const modifiedTime = this.calculatingTime(this.state.selectedTime as string, parseDateFromString!(this.state.formattedDate!)!);
      this.setSelectedDateTime(modifiedTime);
      this._formattedValueChanged = false;
    }
  }

  @autobind
  private _onTextFieldDateChanged(newValue: string) {
    if (this.props.allowTextInput) {
      if (this.state.isDatePickerShown) {
        this._dismissDatePickerPopup();
      }

      const { isRequired, value, strings } = this.props;
      if (newValue !== this.state.formattedDate) {
        this.setState({
          errorMessage: (isRequired && !value) ? (strings!.isRequiredErrorMessage || '*') : undefined,
          formattedDate: newValue
        });
        this._formattedValueChanged = true;
      }
    }
  }

  @autobind
  private _onTextFieldTimeChanged(option?: IComboBoxOption, index?: number, value?: string) {
    const { onChangeTimeCombobox } = this.props;

    if (onChangeTimeCombobox) {
      onChangeTimeCombobox(index, value);
    }

    const newValue = (value !== undefined) ? value : (option ? option.text : undefined);
    const isTimeChanged = newValue !== this.state.selectedTime && newValue !== undefined;

    if (this.props.displayDatePickerFormat === DatePickerFormat.bothDateAndTime) {
      // If user didn't pick a date yet, it's not an valid output
      if (!this.state.selectedDate) {
        this.setState({
          selectedTime: newValue,
          selectedIndex: index || this.state.selectedIndex
        });
        return;
      }

      if (isTimeChanged) {
        const modifiedTime = this.calculatingTime(newValue!);

        if (modifiedTime) {
          this.setState({
            selectedTime: newValue,
            selectedDate: modifiedTime,
            selectedIndex: index || this.state.selectedIndex
          });

          this.setSelectedDateTime(modifiedTime);
        }
      }
    } else {
      // For most scenarios only showing time picker indicates there's a default date implying somewhere in the system
      // So we are allowing user to provide the default date themselves
      if (isTimeChanged) {
        // For most scenarios only showing time picker indicates there's a default date implying somewhere in the system
        // So we are allowing user to provide the default date themselves
        const defaultDate = this.props.defaultDate ? this.props.defaultDate : new Date();
        const modifiedTime = this.calculatingTime(newValue!, defaultDate);

        this.setState({
          selectedTime: newValue,
          selectedIndex: index || this.state.selectedIndex
        });

        this.setSelectedDateTime(modifiedTime);
      }
    }
  }

  // Due to time supports user manual input
  // Structured data model wouln't work, so we have to parse out the hour and time
  // By default our time is xx:xx
  private _parseHourAndTime(time: string) {
    const indexOfSeprator = time.indexOf(':');
    let hour = Number(time.substring(0, indexOfSeprator)), minute = Number(time.substring(indexOfSeprator + 1, indexOfSeprator + 3));

    // Invalid input return default value
    hour = (hour) ? hour : 0;
    minute = (minute) ? minute : 0;

    if ((hour === 12 && time.indexOf('AM') > -1) || (hour !== 12 && time.indexOf('PM') > -1)) {
      hour = hour + 12;
    }

    return {
      hour,
      minute
    };
  }

  @autobind
  private _onTextFieldKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
    switch (ev.which) {
      case KeyCodes.enter:
        ev.preventDefault();
        ev.stopPropagation();
        if (!this.state.isDatePickerShown) {
          this._showDatePickerPopup();
        } else {
          // When DatePicker allows input date string directly,
          // it is expected to hit another enter to close the popup
          if (this.props.allowTextInput) {
            this._dismissDatePickerPopup();
          }
        }
        break;

      case KeyCodes.escape:
        this._handleEscKey(ev);
        break;

      default:
        break;
    }
  }

  @autobind
  private _onTextFieldClick(ev: React.MouseEvent<HTMLElement>) {
    if (!this.state.isDatePickerShown && !this.props.disabled) {
      this._showDatePickerPopup();
    } else {
      if (this.props.allowTextInput) {
        this.setState({
          isDatePickerShown: false
        });
      }
    }
  }

  @autobind
  private _onIconClick(ev: React.MouseEvent<HTMLElement>) {
    ev.stopPropagation();
    this._onTextFieldClick(ev);
  }

  private _showDatePickerPopup() {
    if (!this.state.isDatePickerShown) {
      this._preventFocusOpeningPicker = true;
      this._focusOnSelectedDateOnUpdate = true;
      this.setState({
        isDatePickerShown: true,
        errorMessage: ''
      });
    }
  }

  @autobind
  private _dismissDatePickerPopup() {
    if (this.state.isDatePickerShown) {
      this.setState({
        isDatePickerShown: false
      });

      this._validateTextInput();
    }
  }

  /**
   * Callback for closing the calendar callout
   */
  @autobind
  private _calendarDismissed() {
    this._preventFocusOpeningPicker = true;
    this._dismissDatePickerPopup();
  }

  @autobind
  private _handleEscKey(ev: React.KeyboardEvent<HTMLElement>) {
    this._calendarDismissed();
  }

  @autobind
  private _validateTextInput() {

    const { isRequired, allowTextInput, strings, parseDateFromString,
      onSelectDate, formatDate, minDate, maxDate, byPassValidation } = this.props;
    const inputValue = this.state.formattedDate;

    if (byPassValidation) {
      return;
    }

    // Do validation only if DatePicker's popup is dismissed
    if (byPassValidation || this.state.isDatePickerShown) {
      return;
    }

    // Check when DatePicker is a required field but has NO input value
    if (isRequired && !inputValue) {
      this.setState({
        // Since fabic react doesn't have loc support yet
        // use the symbol '*' to represent error message
        errorMessage: strings!.isRequiredErrorMessage || '*'
      });
      return;
    }

    if (allowTextInput) {
      let date = null;

      // When user deletes calendar value
      // We should still set the proper state but no formatting needed
      // Only null value or mininum date with time
      if (inputValue !== undefined && inputValue === '' && this.state.selectedDate !== undefined) {
        this.setState({
          selectedDate: undefined
        });

        return;
      }

      if (inputValue) {
        // Don't parse if the selected date has the same formatted string as what we're about to parse.
        // The formatted string might be ambiguous (ex: "1/2/3" or "New Year Eve") and the parser might
        // not be able to come up with the exact same date.
        if (this.state.selectedDate && formatDate && formatDate(this.state.selectedDate) === inputValue) {
          date = this.state.selectedDate;
        } else {
          date = parseDateFromString!(inputValue);

          // Check if date is null, or date is Invalid Date
          if (!date || isNaN(date.getTime())) {

            // Reset invalid input field, if formatting is available
            if (formatDate) {
              date = this.state.selectedDate;
              this.setState({
                formattedDate: formatDate(date!).toString()
              });
            }

            this.setState({
              errorMessage: strings!.invalidInputErrorMessage || '*'
            });

          } else {
            // Check against optional date boundaries
            if (this._isDateOutOfBounds(date, minDate, maxDate)) {
              this.setState({
                errorMessage: strings!.isOutOfBoundsErrorMessage || '*'
              });
            } else {
              this.setState({
                selectedDate: date,
                errorMessage: ''
              });

              // When formatting is available. If formatted date is valid, but is different from input, update with formatted date
              // This occurs when an invalid date is entered twice
              if (formatDate && formatDate(date) !== inputValue) {
                this.setState({
                  formattedDate: formatDate(date).toString()
                });
              }
            }
          }
        }
        const newDate = this.calculatingTime(this.state.selectedTime!, date as Date);
      } else {
        // No input date string shouldn't be an error if field is not required
        this.setState({
          errorMessage: ''
        });
      }
      // Execute onSelectDate callback
      if (onSelectDate) {
        // If no input date string or input date string is invalid
        // date variable will be null, callback should expect null value for this case
        onSelectDate(date);
      }

      this.setSelectedDateTime(date);
    }
  }

  private _isDateOutOfBounds(date: Date, minDate?: Date, maxDate?: Date): boolean {
    return ((!!minDate && compareDatePart(minDate!, date) > 0) || (!!maxDate && compareDatePart(maxDate!, date) < 0));
  }
}