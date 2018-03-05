import * as React from 'react';
import {
  BaseComponent,
  KeyCodes,
  autobind,
  css,
  getRTL
} from '../../Utilities';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { Suggestions, ISuggestionsProps, SuggestionsController, IBasePickerSuggestionsProps, ISuggestionModel }
  from 'office-ui-fabric-react/lib/Pickers';
import { IBaseFloatingPicker, IBaseFloatingPickerProps } from './BaseFloatingPicker.types';
import * as stylesImport from './BaseFloatingPicker.scss';
// tslint:disable-next-line:no-any
const styles: any = stylesImport;

export interface IBaseFloatingPickerState {
  queryString: string;
  suggestedDisplayValue?: string;
  moreSuggestionsAvailable?: boolean;
  isSearching?: boolean;
  isMostRecentlyUsedVisible?: boolean;
  suggestionsVisible?: boolean;
  suggestionsLoading?: boolean;
  isResultsFooterVisible?: boolean;
  didBind: boolean;
}

export class BaseFloatingPicker<T, P extends IBaseFloatingPickerProps<T>> extends BaseComponent<P, IBaseFloatingPickerState>
  implements IBaseFloatingPicker {
  protected selection: Selection;

  protected root: HTMLElement;
  protected suggestionElement: Suggestions<T>;

  protected suggestionStore: SuggestionsController<T>;
  protected SuggestionOfProperType: new (props: ISuggestionsProps<T>) => Suggestions<T> =
  Suggestions as new (props: ISuggestionsProps<T>) => Suggestions<T>;
  protected loadingTimer: number | undefined;
  // tslint:disable-next-line:no-any
  protected currentPromise: PromiseLike<any>;

  constructor(basePickerProps: P) {
    super(basePickerProps);

    this.suggestionStore = basePickerProps.suggestionsController;
    this.state = {
      queryString: '',
      suggestedDisplayValue: '',
      isMostRecentlyUsedVisible: false,
      moreSuggestionsAvailable: false,
      isSearching: false,
      didBind: false,
    };
  }

  public get inputText(): string {
    return this.state.queryString;
  }

  // tslint:disable-next-line:no-any
  public get suggestions(): any[] {
    return this.suggestionStore.suggestions;
  }

  public forceResolveSuggestion(): void {
    if (this.suggestionStore.hasSelectedSuggestion()) {
      this.completeSuggestion();
    } else {
      this._onValidateInput();
    }
  }

  public get isSuggestionsShown(): boolean {
    return this.state.suggestionsVisible ? false : this.state.suggestionsVisible as boolean;
  }

  public onQueryStringChanged(queryString: string): void {
    if (queryString !== this.state.queryString) {
      this.setState({
        queryString: queryString,
        moreSuggestionsAvailable: true,
        isMostRecentlyUsedVisible: false,
        suggestionsVisible: true,
      });
      if (queryString === '') {
        this.updateSuggestionWithZeroState();
      } else {
        this.updateValue(queryString);
      }
    }
  }

  public hidePicker(): void {
    this.setState({
      suggestionsVisible: false,
    });
  }

  public showPicker(): void {
    this.setState({
      suggestionsVisible: true,
    });

    if (this.suggestionStore.suggestions.length === 0
      || this.props.inputElement && this.props.inputElement.textContent !== this.state.queryString) {
      if (this.state.queryString === '') {
        this.updateSuggestionWithZeroState();
      } else {
        this.updateValue(this.state.queryString);
      }
    }
  }

  public componentDidMount(): void {
    this._bindToInputElement();

    this._onResolveSuggestions = this._async.debounce(this._onResolveSuggestions, this.props.resolveDelay);
  }

  public componentDidUpdate(): void {
    this._bindToInputElement();
  }

  public componentWillUnmount(): void {
    this._unbindFromInputElement();
  }

  @autobind
  public dismissSuggestions(): void {
    this.setState({ suggestionsVisible: false });
  }

  public completeSuggestion(): void {
    if (this.suggestionStore.hasSelectedSuggestion()) {
      this.onChange(this.suggestionStore.currentSuggestion!.item);
    }
  }

  @autobind
  public refocusSuggestions(keyCode: KeyCodes): void {
    if (this.suggestionStore.suggestions && this.suggestionStore.suggestions.length > 0) {
      if (keyCode === KeyCodes.up) {
        this.suggestionStore.setSelectedSuggestion(
          this.suggestionStore.suggestions.length - 1
        );
      } else if (keyCode === KeyCodes.down) {
        this.suggestionStore.setSelectedSuggestion(0);
      }
    }
  }

  public render(): JSX.Element {
    let { className } = this.props;
    return (
      <div
        ref={ this._resolveRef('root') }
        className={ css('ms-BasePicker', className ? className : '') }
      >
        { this.renderSuggestions() }
      </div>
    );
  }

  protected renderSuggestions(): JSX.Element | null {
    let TypedSuggestion = this.SuggestionOfProperType;
    return this.state.suggestionsVisible ? (
      <Callout
        className={ styles.callout }
        isBeakVisible={ false }
        gapSpace={ 5 }
        target={ this.props.inputElement }
        onDismiss={ this.dismissSuggestions }
        directionalHint={
          getRTL() ? (
            DirectionalHint.bottomRightEdge
          ) : (
              DirectionalHint.bottomLeftEdge
            )
        }
        calloutWidth={ this.props.calloutWidth ? this.props.calloutWidth : 0 }
      >
        <TypedSuggestion
          showForceResolve={ this._showForceResolve }
          createGenericItem={ this._onValidateInput }
          onRenderSuggestion={ this.props.onRenderSuggestionsItem }
          onSuggestionClick={ this.onSuggestionClick }
          onSuggestionRemove={ this.onSuggestionRemove }
          suggestions={ this.suggestionStore.getSuggestions() }
          ref={ this._resolveRef('suggestionElement') }
          onGetMoreResults={ this.onGetMoreResults }
          moreSuggestionsAvailable={ this.state.moreSuggestionsAvailable }
          isLoading={ this.state.suggestionsLoading }
          isSearching={ this.state.isSearching }
          isMostRecentlyUsedVisible={ this.state.isMostRecentlyUsedVisible }
          isResultsFooterVisible={ this.state.isResultsFooterVisible }
          refocusSuggestions={ this.refocusSuggestions }
          {...this.props.pickerSuggestionsProps as IBasePickerSuggestionsProps}
        />
      </Callout>
    ) : null;
  }

  protected onSuggestionSelect(): void {
    if (this.suggestionStore.currentSuggestion) {
      let currentValue: string = this.state.queryString;
      let itemValue: string = this._getTextFromItem(
        this.suggestionStore.currentSuggestion.item,
        currentValue
      );
      this.setState({ suggestedDisplayValue: itemValue });
    }
  }

  protected onSelectionChange(): void {
    this.forceUpdate();
  }

  protected updateSuggestions(suggestions: T[]): void {
    this.suggestionStore.updateSuggestions(suggestions, 0);
  }

  protected updateValue(updatedValue: string): void {
    // Call onInputChanged
    if (this.props.onInputChanged) {
      (this.props.onInputChanged as (filter: string) => void)(updatedValue);
    }

    this._onResolveSuggestions(updatedValue);
  }

  protected updateSuggestionWithZeroState(): void {
    if (this.props.onZeroQuerySuggestion) {
      let onEmptyInputFocus = this.props.onZeroQuerySuggestion as (selectedItems?: T[]) => T[] | PromiseLike<T[]>;
      let suggestions: T[] | PromiseLike<T[]> = onEmptyInputFocus(this.props.selectedItems);
      this.updateSuggestionsList(suggestions);
    } else {
      this.setState({ suggestionsVisible: false });
    }
  }

  protected updateSuggestionsList(
    suggestions: T[] | PromiseLike<T[]>,
    updatedValue?: string
  ): void {
    let suggestionsArray: T[] = suggestions as T[];
    let suggestionsPromiseLike: PromiseLike<T[]> = suggestions as PromiseLike<
      T[]
      >;

    // Check to see if the returned value is an array, if it is then just pass it into the next function.
    // If the returned value is not an array then check to see if it's a promise or PromiseLike. If it is then resolve it asynchronously.
    if (Array.isArray(suggestionsArray)) {
      if (updatedValue !== undefined) {
        this.resolveNewValue(updatedValue, suggestionsArray);
      } else {
        this.suggestionStore.updateSuggestions(suggestionsArray, 0);
      }
    } else if (suggestionsPromiseLike && suggestionsPromiseLike.then) {
      this.setState({
        suggestionsLoading: true
      });

      if (updatedValue !== undefined) {
        this.setState({
          suggestionsVisible: updatedValue !== ''
        });
      } else {
        this.setState({
          suggestionsVisible: false
        });
      }

      // Ensure that the promise will only use the callback if it was the most recent one.
      let promise: PromiseLike<
        T[]
        > = (this.currentPromise = suggestionsPromiseLike);
      promise.then((newSuggestions: T[]) => {
        if (promise === this.currentPromise) {
          if (updatedValue !== undefined) {
            this.resolveNewValue(updatedValue, newSuggestions);
          } else {
            this.suggestionStore.updateSuggestions(newSuggestions);
            this.setState({
              suggestionsVisible: newSuggestions.length > 0,
              suggestionsLoading: false
            });
          }
          if (this.loadingTimer) {
            this._async.clearTimeout(this.loadingTimer);
            this.loadingTimer = undefined;
          }
        }
      });
    }
  }

  protected resolveNewValue(updatedValue: string, suggestions: T[]): void {
    this.suggestionStore.updateSuggestions(suggestions, 0);
    let itemValue: string | undefined = undefined;

    if (this.suggestionStore.currentSuggestion) {
      itemValue = this._getTextFromItem(
        this.suggestionStore.currentSuggestion.item,
        updatedValue
      );
    }

    this.setState({
      suggestionsLoading: false,
      suggestedDisplayValue: itemValue,
      suggestionsVisible: updatedValue !== ''
    });
  }

  protected onChange(item: T): void {
    if (this.props.onChange) {
      (this.props.onChange as ((items: T) => void))(item);
    }
  }

  @autobind
  protected onSuggestionClick(
    ev: React.MouseEvent<HTMLElement>,
    item: T,
    index: number
    ): void {
    this.onChange(item);
  }

  @autobind
  protected onSuggestionRemove(
    ev: React.MouseEvent<HTMLElement>,
    item: T,
    index: number
    ): void {
    if (this.props.onRemoveSuggestion) {
      (this.props.onRemoveSuggestion as ((item: T) => void))(item);
    }
    this.suggestionStore.removeSuggestion(index);
  }

  @autobind
  protected onKeyDown(ev: MouseEvent): void {
    if (!this.state.suggestionsVisible ||
      (this.props.inputElement &&
        !(this.props.inputElement as HTMLElement).contains(ev.target as HTMLElement))) {
      return;
    }
    let keyCode = ev.which;
    switch (keyCode) {
      case KeyCodes.escape:
        this.setState({ suggestionsVisible: false });
        ev.preventDefault();
        ev.stopPropagation();
        break;

      case KeyCodes.tab:
      case KeyCodes.enter:
        if (this.suggestionElement.hasSuggestedActionSelected()) {
          this.suggestionElement.executeSelectedAction();
        } else if (!ev.shiftKey &&
          !ev.ctrlKey &&
          this.suggestionStore.hasSelectedSuggestion()) {
          this.completeSuggestion();
          ev.preventDefault();
          ev.stopPropagation();
        } else {
          this._onValidateInput();
        }
        break;

      case KeyCodes.del:
        if (this.suggestionStore.currentIndex !== -1) {
          if (this.props.onRemoveSuggestion) {
            (this.props.onRemoveSuggestion as ((item: T) => void))(
              this.suggestionStore.currentSuggestion!.item
            );
          }
          this.suggestionStore.removeSuggestion(
            this.suggestionStore.currentIndex
          );
          this.forceUpdate();
        }
        ev.stopPropagation();
        break;

      case KeyCodes.up:
        if (this.suggestionElement.tryHandleKeyDown(keyCode, this.suggestionStore.currentIndex)) {
          ev.preventDefault();
          ev.stopPropagation();
        } else {
          if (this.suggestionElement.hasSuggestedAction() &&
            this.suggestionStore.currentIndex === 0
          ) {
            ev.preventDefault();
            ev.stopPropagation();
            this.suggestionElement.focusAboveSuggestions();
            this.suggestionStore.deselectAllSuggestions();
            this.forceUpdate();
          } else {
            if (this.suggestionStore.previousSuggestion()) {
              ev.preventDefault();
              ev.stopPropagation();
              this.onSuggestionSelect();
            }
          }
        }
        break;

      case KeyCodes.down:
        if (this.suggestionElement.tryHandleKeyDown(keyCode, this.suggestionStore.currentIndex)) {
          ev.preventDefault();
          ev.stopPropagation();
        } else {
          if (
            this.suggestionElement.hasSuggestedAction() &&
            this.suggestionStore.currentIndex + 1 ===
            this.suggestionStore.suggestions.length
          ) {
            ev.preventDefault();
            ev.stopPropagation();
            this.suggestionElement.focusBelowSuggestions();
            this.suggestionStore.deselectAllSuggestions();
            this.forceUpdate();
          } else {
            if (this.suggestionStore.nextSuggestion()) {
              ev.preventDefault();
              ev.stopPropagation();
              this.onSuggestionSelect();
            }
          }
        }
        break;
    }
  }

  @autobind
  protected onGetMoreResults(): void {
    this.setState(
      {
        isSearching: true
      },
      () => {
        if (this.props.onGetMoreResults) {
          let suggestions: T[] | PromiseLike<T[]> =
            (this.props.onGetMoreResults as ((filter: string, selectedItems?: T[]) => T[] | PromiseLike<T[]>))
              (this.state.queryString, []);
          let suggestionsArray: T[] = suggestions as T[];
          let suggestionsPromiseLike: PromiseLike<
            T[]
            > = suggestions as PromiseLike<T[]>;

          if (Array.isArray(suggestionsArray)) {
            this.updateSuggestions(suggestionsArray);
            this.setState({ isSearching: false });
          } else if (suggestionsPromiseLike.then) {
            suggestionsPromiseLike.then((newSuggestions: T[]) => {
              this.updateSuggestions(newSuggestions);
              this.setState({ isSearching: false });
            });
          }

          // Focus back on the input element
          if (this.props.inputElement) {
            (this.props.inputElement as HTMLDivElement).focus();
          }
        } else {
          this.setState({ isSearching: false });
        }
        this.setState({
          moreSuggestionsAvailable: false,
          isResultsFooterVisible: true
        });
      }
    );
  }

  private _onResolveSuggestions(updatedValue: string): void {
    let suggestions: T[] | PromiseLike<T[]> | null = this.props.onResolveSuggestions(updatedValue, this.props.selectedItems);

    if (suggestions !== null) {
      this.updateSuggestionsList(suggestions, updatedValue);
    }
  }

  @autobind
  private _onValidateInput(): void {
    if (
      this.props.onValidateInput &&
      this.props.createGenericItem
    ) {
      let itemToConvert = (this.props.createGenericItem as ((
        input: string,
        isValid: boolean
      ) => ISuggestionModel<T>))(
        this.state.queryString,
        (this.props.onValidateInput as ((input: string) => boolean))(this.state.queryString)
        );
      this.suggestionStore.createGenericSuggestion(itemToConvert);
      this.completeSuggestion();
    }
  }

  @autobind
  private _showForceResolve(): boolean {
    return this.props.showForceResolve ? this.props.showForceResolve() : false;
  }

  private _getTextFromItem(item: T, currentValue?: string): string {
    if (this.props.getTextFromItem) {
      return (this.props.getTextFromItem as ((item: T, currentValue?: string) => string))(item, currentValue);
    } else {
      return '';
    }
  }

  private _bindToInputElement(): void {
    if (this.props.inputElement && !this.state.didBind) {
      this.props.inputElement.addEventListener('keydown', this.onKeyDown);
      this.setState({ didBind: true });
    }
  }

  private _unbindFromInputElement(): void {
    if (this.props.inputElement && this.state.didBind) {
      this.props.inputElement.removeEventListener('keydown', this.onKeyDown);
      this.setState({ didBind: false });
    }
  }
}