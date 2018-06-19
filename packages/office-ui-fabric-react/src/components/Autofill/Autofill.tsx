import * as React from 'react';
import { IAutofillProps, IAutofill } from './Autofill.types';
import {
  BaseComponent,
  KeyCodes,
  autobind,
  getNativeProps,
  inputProperties
} from '../../Utilities';

export interface IAutofillState {
  displayValue?: string;
}

const SELECTION_FORWARD = 'forward';
const SELECTION_BACKWARD = 'backward';

export class Autofill extends BaseComponent<IAutofillProps, IAutofillState> implements IAutofill {

  public static defaultProps = {
    enableAutofillOnKeyPress: [KeyCodes.down, KeyCodes.up]
  };

  private _inputElement: HTMLInputElement;
  private _autoFillEnabled = true;
  private _value: string;

  constructor(props: IAutofillProps) {
    super(props);
    this._value = '';
    this.state = {
      displayValue: props.defaultVisibleValue || ''
    };
  }

  public get cursorLocation(): number {
    if (this._inputElement) {
      const inputElement = this._inputElement;
      if (inputElement.selectionDirection !== SELECTION_FORWARD) {
        return inputElement.selectionEnd;
      } else {
        return inputElement.selectionStart;
      }
    } else {
      return -1;
    }
  }

  public get isValueSelected(): boolean {
    return this.inputElement.selectionStart !== this.inputElement.selectionEnd;
  }

  public get value(): string {
    return this._value;
  }

  public get selectionStart(): number {
    return this._inputElement ? this._inputElement.selectionStart : -1;
  }

  public get selectionEnd(): number {
    return this._inputElement ? this._inputElement.selectionEnd : -1;
  }

  public get inputElement(): HTMLInputElement {
    return this._inputElement;
  }

  public componentWillReceiveProps(nextProps: IAutofillProps) {
    let newValue;

    if (this.props.updateValueInWillReceiveProps) {
      newValue = this.props.updateValueInWillReceiveProps();
    }

    newValue = this._getDisplayValue(newValue ? newValue : this._value, nextProps.suggestedDisplayValue);

    if (typeof newValue === 'string') {
      this.setState({ displayValue: newValue });
    }
  }

  public componentDidUpdate() {
    const value = this._value;
    const {
      suggestedDisplayValue,
      shouldSelectFullInputValueInComponentDidUpdate
    } = this.props;
    let differenceIndex = 0;

    if (this._autoFillEnabled && value && suggestedDisplayValue && this._doesTextStartWith(suggestedDisplayValue, value)) {
      let shouldSelectFullRange = false;

      if (shouldSelectFullInputValueInComponentDidUpdate) {
        shouldSelectFullRange = shouldSelectFullInputValueInComponentDidUpdate();
      }

      if (shouldSelectFullRange) {
        this._inputElement.setSelectionRange(0, suggestedDisplayValue.length, SELECTION_BACKWARD);
      } else {
        while (differenceIndex < value.length && value[differenceIndex].toLocaleLowerCase() === suggestedDisplayValue[differenceIndex].toLocaleLowerCase()) {
          differenceIndex++;
        }
        if (differenceIndex > 0) {
          this._inputElement.setSelectionRange(differenceIndex, suggestedDisplayValue.length, SELECTION_BACKWARD);
        }
      }
    }
  }

  public render() {
    const {
      displayValue
    } = this.state;

    const nativeProps = getNativeProps(this.props, inputProperties);
    return (
      <input
        { ...nativeProps }
        ref={ this._resolveRef('_inputElement') }
        value={ displayValue }
        autoCapitalize={ 'off' }
        autoComplete={ 'off' }
        aria-required={ this.props.ariaRequired }
        onCompositionStart={ this._onCompositionStart }
        onCompositionEnd={ this._onCompositionEnd }
        onChange={ this._onChanged }
        onInput={ this._onInputChanged }
        onKeyDown={ this._onKeyDown }
        onClick={ this.props.onClick ? this.props.onClick : this._onClick }
        data-lpignore={ true }
      />
    );
  }

  public focus() {
    this._inputElement.focus();
  }

  public clear() {
    this._autoFillEnabled = true;
    this._updateValue('');
    this._inputElement.setSelectionRange(0, 0);
  }

  // Composition events are used when the character/text requires several keystrokes to be completed.
  // Some examples of this are mobile text input and langauges like Japanese or Arabic.
  // Find out more at https://developer.mozilla.org/en-US/docs/Web/Events/compositionstart
  @autobind
  private _onCompositionStart(ev: React.CompositionEvent<HTMLInputElement>) {
    this._autoFillEnabled = false;
  }

  // Composition events are used when the character/text requires several keystrokes to be completed.
  // Some examples of this are mobile text input and langauges like Japanese or Arabic.
  // Find out more at https://developer.mozilla.org/en-US/docs/Web/Events/compositionstart
  @autobind
  private _onCompositionEnd(ev: React.CompositionEvent<HTMLInputElement>) {
    const inputValue = this._getCurrentInputValue();
    this._tryEnableAutofill(inputValue, this.value, false, true);
    // Due to timing, this needs to be async, otherwise no text will be selected.
    this._async.setTimeout(() => this._updateValue(inputValue), 0);
  }

  @autobind
  private _onClick() {
    if (this._value && this._value !== '' && this._autoFillEnabled) {
      this._autoFillEnabled = false;
    }
  }

  @autobind
  private _onKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(ev);
    }

    // If the event is actively being composed, then don't alert autofill.
    // Right now typing does not have isComposing, once that has been fixed any should be removed.
    if (!(ev.nativeEvent as any).isComposing) {
      switch (ev.which) {
        case KeyCodes.backspace:
          this._autoFillEnabled = false;
          break;
        case KeyCodes.left:
        case KeyCodes.right:
          if (this._autoFillEnabled) {
            this._value = this.state.displayValue!;
            this._autoFillEnabled = false;
          }
          break;
        default:
          if (!this._autoFillEnabled) {
            if (this.props.enableAutofillOnKeyPress!.indexOf(ev.which) !== -1) {
              this._autoFillEnabled = true;
            }
          }
          break;
      }
    }
  }

  @autobind
  private _onInputChanged(ev: React.FormEvent<HTMLElement>) {
    const value: string = this._getCurrentInputValue(ev);

    // Right now typing does not have isComposing, once that has been fixed any should be removed.
    this._tryEnableAutofill(value, this._value, (ev.nativeEvent as any).isComposing);
    this._updateValue(value);
  }

  @autobind
  private _onChanged(): void {
    // Swallow this event, we don't care about it
    // We must provide it because React PropTypes marks it as required, but onInput serves the correct purpose
    return;
  }

  private _getCurrentInputValue(ev?: React.FormEvent<HTMLElement>): string {
    if (ev && ev.target && (ev.target as any).value) {
      return (ev.target as any).value;
    } else {
      return this._inputElement.value;
    }
  }

  /**
   * Attempts to enable autofill. Whether or not autofill is enabled depends on the input value,
   * whether or not any text is selected, and only if the new input value is longer than the old input value.
   * Autofill should never be set to true if the value is composing. Once compositionEnd is called, then
   * it should be completed.
   * See https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent for more information on composition.
   * @param newValue
   * @param oldValue
   * @param isComposing if true then the text is actively being composed and it has not completed.
   * @param isComposed if the text is a composed text value.
   */
  private _tryEnableAutofill(newValue: string, oldValue: string, isComposing?: boolean, isComposed?: boolean) {
    if (!isComposing
      && newValue
      && this._inputElement.selectionStart === newValue.length
      && !this._autoFillEnabled
      && (newValue.length > oldValue.length || isComposed)) {
      this._autoFillEnabled = true;
    }
  }

  private _notifyInputChange(newValue: string) {
    if (this.props.onInputValueChange) {
      this.props.onInputValueChange(newValue);
    }
  }

  /**
   * Updates the current input value as well as getting a new display value.
   * @param newValue The new value from the input
   */
  @autobind
  private _updateValue(newValue: string) {
    this._value = this.props.onInputChange ? this.props.onInputChange(newValue) : newValue;
    this.setState({
      displayValue: this._getDisplayValue(this._value, this.props.suggestedDisplayValue)
    }, () => this._notifyInputChange(this._value));
  }

  /**
   * Returns a string that should be used as the display value.
   * It evaluates this based on whether or not the suggested value starts with the input value
   * and whether or not autofill is enabled.
   * @param inputValue the value that the input currently has.
   * @param suggestedDisplayValue the possible full value
   */
  private _getDisplayValue(inputValue: string, suggestedDisplayValue?: string) {
    let displayValue = inputValue;
    if (suggestedDisplayValue
      && inputValue
      && this._doesTextStartWith(suggestedDisplayValue, displayValue)
      && this._autoFillEnabled) {
      displayValue = suggestedDisplayValue;
    }
    return displayValue;
  }

  private _doesTextStartWith(text: string, startWith: string) {
    if (!text || !startWith) {
      return false;
    }
    return text.toLocaleLowerCase().indexOf(startWith.toLocaleLowerCase()) === 0;
  }
}

/**
 *  Legacy, @deprecated, do not use.
 */
export class BaseAutoFill extends Autofill {

}