import * as React from 'react';
import {
  ExampleCard,
  IComponentDemoPageProps,
  ComponentPage,
  PropertiesTableSet
} from '@uifabric/example-app-base';
import { DatePickerBasicExample } from './examples/DatePicker.Basic.Example';
import { DatePickerTimePickerExample } from './examples/DatePicker.TimePicker.Example';
import { DatePickerOnlyTimePickerExample } from './examples/DatePicker.OnlyTimePicker.Example';
import { DatePickerWeekNumbersExample } from './examples/DatePicker.WeekNumbers.Example';
import { DatePickerRequiredExample } from './examples/DatePicker.Required.Example';
import { DatePickerInputExample } from './examples/DatePicker.Input.Example';
import { DatePickerFormatExample } from './examples/DatePicker.Format.Example';
import { DatePickerBoundedExample } from './examples/DatePicker.Bounded.Example';
import { ComponentStatus } from '../../demo/ComponentStatus/ComponentStatus';
import { DatePickerStatus } from './DatePicker.checklist';

const DatePickerBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DatePicker/examples/DatePicker.Basic.Example.tsx') as string;
const DatePickerTimePickerExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DatePicker/examples/DatePicker.TimePicker.Example.tsx') as string;
const DatePickerOnlyTimePickerExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DatePicker/examples/DatePicker.OnlyTimePicker.Example.tsx') as string;
const DatePickerWeekNumbersExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DatePicker/examples/DatePicker.WeekNumbers.Example.tsx') as string;
const DatePickerRequiredExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DatePicker/examples/DatePicker.Required.Example.tsx') as string;
const DatePickerInputExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/DatePicker/examples/DatePicker.Input.Example.tsx') as string;
const DatePickerFormatExampleCode = require
  ('!raw-loader!office-ui-fabric-react/src/components/DatePicker/examples/DatePicker.Format.Example.tsx') as string;
const DatePickerBoundedExampleCode = require
  ('!raw-loader!office-ui-fabric-react/src/components/DatePicker/examples/DatePicker.Bounded.Example.tsx') as string;

export class DatePickerPage extends React.Component<IComponentDemoPageProps, {}> {
  public render() {
    return (
      <ComponentPage
        title='DatePicker'
        componentName='DatePickerExample'
        exampleCards={
          <div>
            <ExampleCard title='Default DatePicker' code={ DatePickerBasicExampleCode }>
              <DatePickerBasicExample />
            </ExampleCard>
            <ExampleCard title='Date and Time Picker' code={ DatePickerTimePickerExampleCode }>
              <DatePickerTimePickerExample />
            </ExampleCard>
            <ExampleCard title='Only Time Picker' code={ DatePickerOnlyTimePickerExampleCode }>
              <DatePickerOnlyTimePickerExample />
            </ExampleCard>
            <ExampleCard title='DatePicker with week numbers' code={ DatePickerWeekNumbersExampleCode }>
              <DatePickerWeekNumbersExample />
            </ExampleCard>
            <ExampleCard title='DatePicker with required field' code={ DatePickerRequiredExampleCode }>
              <DatePickerRequiredExample />
            </ExampleCard>
            <ExampleCard title='DatePicker allows input date string' code={ DatePickerInputExampleCode }>
              <DatePickerInputExample />
            </ExampleCard>
            <ExampleCard title='DatePicker allows dates to be formatted' code={ DatePickerFormatExampleCode }>
              <DatePickerFormatExample />
            </ExampleCard>
            <ExampleCard title='DatePicker with date boundary (minDate, maxDate)' code={ DatePickerBoundedExampleCode }>
              <DatePickerBoundedExample />
            </ExampleCard>
          </div>
        }
        propertiesTables={
          <PropertiesTableSet
            sources={ [
              require<string>('!raw-loader!office-ui-fabric-react/src/components/DatePicker/DatePicker.types.ts')
            ] }
          />
        }
        overview={
          <div>
            <p>
              The DatePicker component enables a user to pick a date value.
            </p>
          </div>
        }
        bestPractices={
          <div />
        }
        dos={
          <div>
            <ul>
              <li>Use the control as a single entity.</li>
              <li>Set the default date to the current date unless a specific date is required for context (e.g. the date of the conference).</li>
              <li>The control is designed to resize relative to available screen width. Allow it to render in either wide or narrow as appropriate.</li>
              <li>When the control is engaged, the DatePicker renders as a flyout and has defined widths (300px -narrow and 440px – wide). Plan your UI implementation accordingly.</li>
              <li>The control renders date in a specific format. If allowing for manual entry of date, provide helper text in the appropriate format.</li>
            </ul>
          </div>
        }
        donts={
          <div>
            <ul>
              <li>Don't attempt to break apart year from month/day selectors. If granularity is required, use the Dropdown control or something similar.</li>
              <li>Don't attempt to force resize the control in any way.</li>
              <li>Don't force the control to render one mode vs. the other (year or month/day)</li>
              <li>The flyout selector is a light dismiss control. Don't modify this behavior in any way.</li>
            </ul>
          </div>
        }
        isHeaderVisible={ this.props.isHeaderVisible }
        componentStatus={
          <ComponentStatus
            {...DatePickerStatus}
          />
        }
      />
    );
  }
}
