import * as React from 'react';
import { autobind } from '../../../Utilities';
import { DatePicker, DayOfWeek, IDatePickerStrings, DatePickerFormat } from 'office-ui-fabric-react/lib/DatePicker';

export interface IDatePickerOnlyTimePickerExampleState {
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

export class DatePickerOnlyTimePickerExample extends React.Component<{}, IDatePickerOnlyTimePickerExampleState> {
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
        <DatePicker setSelectedDateTime={ this._timeChangeCallback } defaultSelectedTimeKey={ 10 } timeComboboxStyles={ TimeCombobox } borderless displayDatePickerFormat={ DatePickerFormat.timeOnly } firstDayOfWeek={ firstDayOfWeek } allowTextInput showGoToToday={ false } isMonthPickerVisible={ false } placeholder='Select a date...' />
      </div>
    );
  }

  private _timeChangeCallback(date: Date) {
    console.log(date);
  }
}