import * as React from 'react';
import {
  BaseComponent,
  IRenderFunction,
  anchorProperties,
  assign,
  autobind,
  buttonProperties,
  getId,
  getNativeProps,
  KeyCodes
} from '../../Utilities';
import { Icon, IIconProps } from '../../Icon';
import { DirectionalHint } from '../../common/DirectionalHint';
import { ContextualMenu, IContextualMenuProps } from '../../ContextualMenu';
import { IButtonProps, IButton } from './Button.types';
import { IButtonClassNames, getBaseButtonClassNames } from './BaseButton.classNames';
import { getClassNames as getBaseSplitButtonClassNames, ISplitButtonClassNames } from './SplitButton/SplitButton.classNames';

export interface IBaseButtonProps extends IButtonProps {
  baseClassName?: string;
  variantClassName?: string;
}

export interface IBaseButtonState {
  menuProps?: IContextualMenuProps | null;
}

export class BaseButton extends BaseComponent<IBaseButtonProps, IBaseButtonState> implements IButton {

  private get _isSplitButton(): boolean {
    return (!!this.props.menuProps && !!this.props.onClick) && this.props.split === true;
  }

  private get _isExpanded(): boolean {
    return !!this.state.menuProps;
  }

  public static defaultProps = {
    baseClassName: 'ms-Button',
    classNames: {},
    styles: {},
    split: false,
  };

  private _buttonElement: HTMLElement;
  private _splitButtonContainer: HTMLElement;
  private _labelId: string;
  private _descriptionId: string;
  private _ariaDescriptionId: string;
  private _classNames: IButtonClassNames;

  constructor(props: IBaseButtonProps, rootClassName: string) {
    super(props);

    this._warnConditionallyRequiredProps(
      ['menuProps', 'onClick'],
      'split',
      this.props.split!
    );

    this._warnDeprecations({
      rootProps: undefined
    });
    this._labelId = getId();
    this._descriptionId = getId();
    this._ariaDescriptionId = getId();
    this.state = {
      menuProps: null
    };
  }

  public render(): JSX.Element {
    const {
      ariaDescription,
      ariaLabel,
      ariaHidden,
      className,
      description,
      disabled,
      primaryDisabled,
      href,
      iconProps,
      menuIconProps,
      styles,
      text,
      checked,
      variantClassName,
      theme,
      getClassNames
    } = this.props;

    const { menuProps } = this.state;
    // Button is disabled if the whole button (in case of splitbutton is disabled) or if the primary action is disabled
    const isPrimaryButtonDisabled = (disabled || primaryDisabled);

    this._classNames = getClassNames ? getClassNames(
      theme!,
      className!,
      variantClassName!,
      iconProps && iconProps.className,
      menuIconProps && menuIconProps.className,
      isPrimaryButtonDisabled!,
      checked!,
      !!this.state.menuProps,
      this.props.split) : getBaseButtonClassNames(styles!, className!,
        variantClassName!,
        iconProps && iconProps.className,
        menuIconProps && menuIconProps.className,
        isPrimaryButtonDisabled!,
        checked!,
        !!this.state.menuProps,
        this.props.split);

    const { _ariaDescriptionId, _labelId, _descriptionId } = this;
    // Anchor tag cannot be disabled hence in disabled state rendering
    // anchor button as normal button
    const renderAsAnchor: boolean = !isPrimaryButtonDisabled && !!href;
    const tag = renderAsAnchor ? 'a' : 'button';
    const nativeProps = getNativeProps(
      assign(
        renderAsAnchor ? {} : { type: 'button' },
        this.props.rootProps,
        this.props),
      renderAsAnchor ? anchorProperties : buttonProperties,
      [
        'disabled' // let disabled buttons be focused and styled as disabled.
      ]);

    // Check for ariaDescription, description or aria-describedby in the native props to determine source of aria-describedby
    // otherwise default to null.
    let ariaDescribedBy;
    if (ariaDescription) {
      ariaDescribedBy = _ariaDescriptionId;
    } else if (description) {
      ariaDescribedBy = _descriptionId;
    } else if ((nativeProps as any)['aria-describedby']) {
      ariaDescribedBy = (nativeProps as any)['aria-describedby'];
    } else {
      ariaDescribedBy = null;
    }

    // If an explicit ariaLabel is given, use that as the label and we're done.
    // If an explicit aria-labelledby is given, use that and we're done.
    // If any kind of description is given (which will end up as an aria-describedby attribute),
    // set the labelledby element. Otherwise, the button is labeled implicitly by the descendent
    // text on the button (if it exists). Never set both aria-label and aria-labelledby.
    let ariaLabelledBy = null;
    if (!ariaLabel) {
      if ((nativeProps as any)['aria-labelledby']) {
        ariaLabelledBy = (nativeProps as any)['aria-labelledby'];
      } else if (ariaDescribedBy) {
        ariaLabelledBy = text ? _labelId : null;
      }
    }

    const buttonProps = assign(
      nativeProps,
      {
        className: this._classNames.root,
        ref: this._resolveRef('_buttonElement'),
        'disabled': isPrimaryButtonDisabled,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'data-is-focusable': ((this.props as any)['data-is-focusable'] === false || disabled) ? false : true,
        'aria-pressed': checked
      }
    );

    if (ariaHidden) {
      buttonProps['aria-hidden'] = true;
    }

    if (this._isSplitButton) {
      return (
        this._onRenderSplitButtonContent(tag, buttonProps)
      );
    } else if (this.props.menuProps) {
      assign(
        buttonProps,
        {
          'onKeyDown': this._onMenuKeyDown,
          'onClick': this._onMenuClick,
          'aria-expanded': this._isExpanded,
          'aria-owns': this.state.menuProps ? this._labelId + '-menu' : null,
          'aria-haspopup': true
        }
      );
    }

    return this._onRenderContent(tag, buttonProps);
  }

  public componentDidUpdate(prevProps: IBaseButtonProps, prevState: IBaseButtonState) {
    // If Button's menu was closed, run onAfterMenuDismiss
    if (this.props.onAfterMenuDismiss && prevState.menuProps && !this.state.menuProps) {
      this.props.onAfterMenuDismiss();
    }
  }

  public focus(): void {
    if (this._buttonElement) {
      this._buttonElement.focus();
    }
  }

  public dismissMenu(): void {
    this.setState({ menuProps: null });
  }

  private _onRenderContent(tag: any, buttonProps: IButtonProps): JSX.Element {
    const props = this.props;
    const Tag = tag;
    const {
      menuIconProps,
      menuProps,
      onRenderIcon = this._onRenderIcon,
      onRenderAriaDescription = this._onRenderAriaDescription,
      onRenderChildren = this._onRenderChildren,
      onRenderMenu = this._onRenderMenu,
      onRenderMenuIcon = this._onRenderMenuIcon
    } = props;

    const Content = (
      <Tag { ...buttonProps }>
        <div className={ this._classNames.flexContainer } >
          { onRenderIcon(props, this._onRenderIcon) }
          { this._onRenderTextContents() }
          { onRenderAriaDescription(props, this._onRenderAriaDescription) }
          { onRenderChildren(props, this._onRenderChildren) }
          { !this._isSplitButton && (menuProps || menuIconProps || this.props.onRenderMenuIcon) && onRenderMenuIcon(this.props, this._onRenderMenuIcon) }
          { this.state.menuProps && !this.state.menuProps.doNotLayer && onRenderMenu(menuProps, this._onRenderMenu) }
        </div>
      </Tag>
    );

    if (menuProps && menuProps.doNotLayer) {
      return (
        <div style={ { display: 'inline-block' } }>
          { Content }
          { this.state.menuProps && onRenderMenu(menuProps, this._onRenderMenu) }
        </div>
      );
    }

    return Content;
  }

  @autobind
  private _onRenderIcon(buttonProps?: IButtonProps, defaultRender?: IRenderFunction<IButtonProps>): JSX.Element | null {
    const {
      iconProps
    } = this.props;

    if (iconProps) {
      return (
        <Icon
          { ...iconProps }
          className={ this._classNames.icon }
        />
      );
    }
    return null;
  }

  @autobind
  private _onRenderTextContents(): JSX.Element | (JSX.Element | null)[] {
    const {
      text,
      children,
      description,
      onRenderText = this._onRenderText,
      onRenderDescription = this._onRenderDescription
    } = this.props;

    if (text || typeof (children) === 'string' || description) {
      return (
        <div
          className={ this._classNames.textContainer }
        >
          { onRenderText(this.props, this._onRenderText) }
          { onRenderDescription(this.props, this._onRenderDescription) }
        </div>
      );
    }
    return ([
      onRenderText(this.props, this._onRenderText),
      onRenderDescription(this.props, this._onRenderDescription)
    ]);
  }

  @autobind
  private _onRenderText(): JSX.Element | null {
    let {
      text
    } = this.props;
    const {
      children
    } = this.props;

    // For backwards compat, we should continue to take in the text content from children.
    if (text === undefined && typeof (children) === 'string') {
      text = children;
    }

    if (text) {
      return (
        <div
          key={ this._labelId }
          className={ this._classNames.label }
          id={ this._labelId }
        >
          { text }
        </div>
      );
    }

    return null;
  }

  @autobind
  private _onRenderChildren(): JSX.Element | null {
    const { children } = this.props;

    // If children is just a string, either it or the text will be rendered via onRenderLabel
    // If children is another component, it will be rendered after text
    if (typeof (children) === 'string') {
      return null;
    }

    return children as any;
  }

  @autobind
  private _onRenderDescription(props: IButtonProps) {
    const {
      description
    } = this.props;

    // ms-Button-description is only shown when the button type is compound.
    // In other cases it will not be displayed.
    return description ? (
      <div
        key={ this._descriptionId }
        className={ this._classNames.description }
        id={ this._descriptionId }
      >
        { description }
      </div>
    ) : (
        null
      );
  }

  @autobind
  private _onRenderAriaDescription() {
    const {
      ariaDescription
    } = this.props;

    // If ariaDescription is given, descriptionId will be assigned to ariaDescriptionSpan,
    // otherwise it will be assigned to descriptionSpan.
    return ariaDescription ? (
      <span className={ this._classNames.screenReaderText } id={ this._ariaDescriptionId }>{ ariaDescription }</span>
    ) : (
        null
      );
  }

  @autobind
  private _onRenderMenuIcon(props: IButtonProps): JSX.Element | null {
    const {
      menuIconProps
    } = this.props;

    return (

      <Icon
        iconName='ChevronDown'
        { ...menuIconProps }
        className={ this._classNames.menuIcon }
      />

    );
  }

  @autobind
  private _onRenderMenu(menuProps: IContextualMenuProps): JSX.Element {
    const { onDismiss = this._dismissMenu } = menuProps;

    return (
      <ContextualMenu
        id={ this._labelId + '-menu' }
        directionalHint={ DirectionalHint.bottomLeftEdge }
        { ...menuProps }
        className={ 'ms-BaseButton-menuhost ' + menuProps.className }
        target={ this._isSplitButton ? this._splitButtonContainer : this._buttonElement }
        labelElementId={ this._labelId }
        onDismiss={ onDismiss }
      />
    );
  }

  @autobind
  private _dismissMenu(): void {
    this.setState({ menuProps: null });
  }

  @autobind
  private _onToggleMenu(): void {
    const { menuProps } = this.props;
    const currentMenuProps = this.state.menuProps;
    this.setState({ menuProps: currentMenuProps ? null : menuProps });
  }

  private _onRenderSplitButtonContent(tag: any, buttonProps: IButtonProps): JSX.Element {
    const {
      styles = {},
      disabled,
      checked,
      getSplitButtonClassNames,
      onClick,
      primaryDisabled
    } = this.props;

    const classNames = getSplitButtonClassNames ? getSplitButtonClassNames(
      !!disabled,
      !!this.state.menuProps,
      !!checked) : styles && getBaseSplitButtonClassNames(
        styles!,
        !!disabled,
        !!this.state.menuProps,
        !!checked);

    buttonProps = { ...buttonProps, onClick: undefined };

    return (
      <div
        role={ 'button' }
        aria-labelledby={ buttonProps.ariaLabel }
        aria-disabled={ disabled }
        aria-haspopup={ true }
        aria-expanded={ this._isExpanded }
        aria-pressed={ this.props.checked }
        aria-describedby={ buttonProps.ariaDescription }
        className={ classNames && classNames.splitButtonContainer }
        onKeyDown={ this._onMenuKeyDown }
        ref={ this._resolveRef('_splitButtonContainer') }
        data-is-focusable={ true }
        onClick={ !disabled && !primaryDisabled ? onClick : undefined }
      >
        <span
          style={ { 'display': 'flex' } }
        >
          { this._onRenderContent(tag, buttonProps) }
          { this._onRenderSplitButtonMenuButton(classNames) }
          { this._onRenderSplitButtonDivider(classNames) }
        </span>
      </div>
    );
  }

  private _onRenderSplitButtonDivider(classNames: ISplitButtonClassNames | undefined): JSX.Element | null {
    if (classNames && classNames.divider) {
      return <span className={ classNames.divider } />;
    }
    return null;
  }

  private _onRenderSplitButtonMenuButton(classNames: ISplitButtonClassNames | undefined): JSX.Element {
    let {
      menuIconProps,
    } = this.props;

    const {
      splitButtonAriaLabel
    } = this.props;

    if (menuIconProps === undefined) {
      menuIconProps = {
        iconName: 'ChevronDown'
      };
    }

    const splitButtonProps = {
      'styles': classNames,
      'checked': this.props.checked,
      'disabled': this.props.disabled,
      'onClick': this._onMenuClick,
      'menuProps': undefined,
      'iconProps': menuIconProps,
      'ariaLabel': splitButtonAriaLabel,
      'aria-haspopup': true,
      'aria-expanded': this._isExpanded
    };

    return <BaseButton { ...splitButtonProps } onMouseDown={ this._onMouseDown } />;

  }

  @autobind
  private _onMouseDown(ev: React.MouseEvent<BaseButton>) {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(ev);
    }

    ev.preventDefault();
  }

  @autobind
  private _onMenuKeyDown(ev: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(ev);
    }

    const { onMenuClick } = this.props;
    if (onMenuClick) {
      onMenuClick(ev, this);
    }

    if (!ev.defaultPrevented &&
      this.props.menuTriggerKeyCode !== null &&
      ev.which === (this.props.menuTriggerKeyCode === undefined ? KeyCodes.down : this.props.menuTriggerKeyCode)) {
      this._onToggleMenu();
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  @autobind
  private _onMenuClick(ev: React.MouseEvent<HTMLAnchorElement>) {
    const { onMenuClick } = this.props;
    if (onMenuClick) {
      onMenuClick(ev, this);
    }

    if (!ev.defaultPrevented) {
      this._onToggleMenu();
      ev.preventDefault();
      ev.stopPropagation();
    }
  }
}
