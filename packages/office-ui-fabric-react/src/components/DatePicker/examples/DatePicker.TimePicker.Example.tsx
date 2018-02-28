import * as React from 'react';
import { autobind } from '../../../Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
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
};

export interface IDatePickerTimePickerExampleState {
  firstDayOfWeek?: DayOfWeek;
}

const TimeCombobox = {
  root: {
    border: '1px solid transparent',
    margin: '0px',
    paddingRight: '10px',
    paddingLeft: '12px'
  },
  rootHovered: {
    selectors: {
      ':hover': {
        border: '1px solid rgb(226, 226, 226)'
      }
    }
  },
  rootPressed: {
    selectors: {
      ':focus': {
        border: '1px solid rgb(226, 226, 226)'
      }
    }
  },
  rootFocused: {
    selectors: {
      ':focus': {
        border: '1px solid rgb(226, 226, 226)'
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
};

export class DatePickerTimePickerExample extends React.Component<{}, IDatePickerTimePickerExampleState> {
  public constructor(props: {}) {
    super(props);

    this.state = {
      firstDayOfWeek: DayOfWeek.Sunday
    };
  }

  public render() {
    const { firstDayOfWeek } = this.state;

    return (<div>
      <DatePicker displayDatePickerFormat={ DatePickerFormat.bothDateAndDate } firstDayOfWeek={ firstDayOfWeek } allowTextInput strings={ DayPickerStrings } showGoToToday={ false } isMonthPickerVisible={ false } placeholder='Select a date...' />
      <DatePicker timeComboboxStyles={ TimeCombobox } borderless displayDatePickerFormat={ DatePickerFormat.timeOnly } firstDayOfWeek={ firstDayOfWeek } allowTextInput strings={ DayPickerStrings } showGoToToday={ false } isMonthPickerVisible={ false } placeholder='Select a date...' />
    </div>);
  }
}