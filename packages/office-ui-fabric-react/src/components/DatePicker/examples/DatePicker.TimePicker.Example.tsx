import * as React from 'react';
import { autobind } from '../../../Utilities';
import { DatePicker, DayOfWeek, IDatePickerStrings, DatePickerFormat } from 'office-ui-fabric-react/lib/DatePicker';

const DayPickerStrings: IDatePickerStrings = {
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
  weekNameAriaLabel: 'Week',
  daysOfTheWeekAriaLabel: 'Days of the week',
};

export interface IDatePickerTimePickerExampleState {
  firstDayOfWeek?: DayOfWeek;
}

export class DatePickerTimePickerExample extends React.Component<{}, IDatePickerTimePickerExampleState> {
  public constructor(props: {}) {
    super(props);

    this.state = {
      firstDayOfWeek: DayOfWeek.Sunday
    };
  }

  public render() {
    const { firstDayOfWeek } = this.state;

    return (
      <div>
        <DatePicker disableAutoFocus setSelectedDateTime={ this._timeChangeCallback } displayDatePickerFormat={ DatePickerFormat.bothDateAndTime } firstDayOfWeek={ firstDayOfWeek } allowTextInput strings={ DayPickerStrings } showGoToToday={ false } isMonthPickerVisible={ false } placeholder='Select a date...' />
      </div>
    );
  }

  private _timeChangeCallback(date: Date) {
    console.log(date);
  }

}