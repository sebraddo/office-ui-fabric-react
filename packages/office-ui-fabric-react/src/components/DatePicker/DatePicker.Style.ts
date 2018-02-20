import { IDatePickerStyles } from './DatePicker.types';
import { memoizeFunction } from '../../Utilities';
import { concatStyleSets, IStyle } from '../../Styling';
import * as stylesImport from './DatePicker.scss';
const styles: any = stylesImport;

export const getStyles = memoizeFunction((
  customStyles?: Partial<IDatePickerStyles>,
): Partial<IDatePickerStyles> => {

  const datetimePickerStyle: IDatePickerStyles = {
    root: styles.root,
    dateTextField: styles.textField,
    iconStyle: styles.eventWithLabel
  };

  customStyles = {
    root: {
      display: 'flex'
    },
    dateContainer: {
      height: '100%',
      display: 'flex'
    },
    dateTextField: {
      border: '1px solid transparent',
      selectors: {
        ':hover': {
          border: '1px solid rgb(226, 226, 226)'
        }
      }
    },
    dateCalendar: {
      border: '1px solid rgb(226, 226, 226)',
      boxShadow: 'none'
    },
    TimeCombobox: {
      root: {
        border: '1px solid transparent',
        selectors: {
          ':hover': {
            border: '1px solid rgb(226, 226, 226)'
          }
        }
      },
      callout: {
        boxShadow: 'none',
        borderColor: 'rgb(226, 226, 226)'
      }
    },
    timePickerIconStyle: {
      fontSize: "16px",
      lineHeight: "18px"
    }
  };

  return concatStyleSets(datetimePickerStyle, customStyles);
});