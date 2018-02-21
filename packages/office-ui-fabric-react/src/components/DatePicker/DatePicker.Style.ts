import { IDatePickerStyles } from './DatePicker.types';
import { memoizeFunction } from '../../Utilities';
import { concatStyleSets, IStyle } from '../../Styling';
import * as stylesImport from './DatePicker.scss';
import { ResponsiveMode } from '../../utilities/decorators/withResponsiveMode';
const styles: any = stylesImport;

export const getStyles = memoizeFunction((
  customStyles?: Partial<IDatePickerStyles>,
  responsiveMode?: ResponsiveMode
): Partial<IDatePickerStyles> => {

  const datetimePickerStyle: IDatePickerStyles = {
    root: styles.root,
    dateTextField: styles.textField,
    iconStyle: styles.eventWithLabel
  };

  customStyles = {
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
    dateContainer: {
      height: '100%',
      display: 'flex',
      minWidth: responsiveMode! <= ResponsiveMode.small ? '9rem' : '18rem',
      flexDirection: responsiveMode! <= ResponsiveMode.small ? 'column' : 'row'
    },
    dateTextField: {
      border: '1px solid transparent',
      selectors: {
        ':hover': {
          border: '1px solid rgb(226, 226, 226)'
        }
      },
      marginRight: responsiveMode! <= ResponsiveMode.small ? '0rem' : '0.5rem'
    },
    dateCalendar: {
      border: '1px solid rgb(226, 226, 226)',
      boxShadow: 'none'
    },
    TimeCombobox: {
      root: {
        border: '1px solid transparent',
        margin: '0px',
        paddingRight: '12px'
      },
      rootHovered: {
        selectors: {
          ':hover': {
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
    },
    timePickerIconStyle: {
      fontSize: "16px",
      lineHeight: "18px"
    }
  };

  return concatStyleSets(datetimePickerStyle, customStyles);
});