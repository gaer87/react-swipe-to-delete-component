import React from 'react';
import PropTypes from 'prop-types';
import Background from './background';
import Model from './model';
import isMobile from './utils/isMobile';
import Device from './utils/device';
import '../css/main.scss';


export default class SwipeToDelete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {isDeleted: false};

    this.model = new Model({deleteSwipe: this.props.deleteSwipe});
    this.device = Device.factory(isMobile.any());

    this.bindHandlers();
  }

  render() {
    if (this.state.isDeleted) {
      return null;
    }

    return React.createElement(
      this.props.tag,
      {className: `swipe-to-delete ${this.props.classNameTag}`},
      [
        <div key="delete" className="js-delete">{this.props.background}</div>,
        <div key="content" className="js-content" ref={el => this.regionContent = el}>{this.props.children}</div>
      ]
    );
  }

  componentDidMount() {
    this.addHandlers();
  }

  componentWillUnmount() {
    this.regionContent && this.removeHandlers();
  }

  bindHandlers() {
    this.addHandlers = this.addHandlers.bind(this);
    this.isInteract = this.isInteract.bind(this);
    this.interact = this.interact.bind(this);
    this.onMove = this.onMove.bind(this);
    this.stopInteract = this.stopInteract.bind(this);
    this.offInteract = this.offInteract.bind(this);
    this.endInteract = this.endInteract.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  addHandlers() {
    this.startInteract()
      .then(this.isInteract)
      .then(this.interact)
      .then(this.stopInteract)
      .then(this.endInteract)
      .catch(this.addHandlers);
  }

  removeHandlers() {
    const el = this.regionContent.firstChild;
    this.stopListenStartInteract(el);
    this.stopListenIsInteract();
    this.offInteract();
    this.stopListenStopInteract(el);
    this.stopListenEndInteract(el);
  }

  startInteract() {
    return new Promise(resolve => {
      const el = this.regionContent.firstChild;

      this._onStartInteract = e => {
        this.stopListenStartInteract(el);
        this.model.startX = this.device.getPageX(e);
        this.model.startY = this.device.getPageY(e);
        resolve();
      };

      el.addEventListener(this.device.getStartEventName(), this._onStartInteract, false);
    });
  }

  stopListenStartInteract(el) {
    el.removeEventListener(this.device.getStartEventName(), this._onStartInteract);
  }

  isInteract() {
    return new Promise((resolve, reject) => {
      this._onIsInteract = e => {
        this.stopListenIsInteract();
        const wayX = this.device.getPageX(e) - this.model.startX;
        const wayY = this.device.getPageY(e) - this.model.startY;
        Math.abs(wayX) > Math.abs(wayY) ? resolve() : reject();
      };

      document.addEventListener(this.device.getInteractEventName(), this._onIsInteract, false);
    });
  }

  stopListenIsInteract() {
    document.removeEventListener(this.device.getInteractEventName(), this._onIsInteract);
  }

  interact() {
    document.addEventListener(this.device.getInteractEventName(), this.onMove, false);
  }

  offInteract() {
    document.removeEventListener(this.device.getInteractEventName(), this.onMove, false);
  }

  onMove(e) {
    this.moveAt(e);
    this.callMoveCB(e);
  }

  moveAt(e) {
    const target = this.regionContent.firstChild;
    const res = this.device.getPageX(e) - this.model.startX;

    target.style.left = `${res}px`;
  }

  callMoveCB(e) {
    const x = this.device.getPageX(e);
    const prev = this.model.prevX || this.model.startX;

    const shift = x - prev;
    if (!shift) {
      return;
    }

    shift > 0 ? this.props.onRight(e) : this.props.onLeft(e);

    this.model.prevX = x;
  }

  stopInteract() {
    return new Promise((resolve, reject) => {
      const el = this.regionContent.firstChild;

      this._onStopInteract = e => {
        this.stopListenStopInteract(el);
        this.onStopInteract(e, resolve, reject);
      }

      this.device.getStopEventNames().forEach(eventName => el.addEventListener(eventName, this._onStopInteract, false));
    });
  }

  stopListenStopInteract(el) {
    this.device.getStopEventNames().forEach(eventName => el.removeEventListener(eventName, this._onStopInteract));
  }

  onStopInteract(e, resolve, reject) {
    this.offInteract();
    this.model.erasePrevX();

    const shift = e.currentTarget.offsetLeft;
    !shift ? reject() : resolve();
  }

  endInteract() {
    const el = this.regionContent.firstChild;
    const swipePercent = this.getSwipePercent();

    const promise = new Promise((resolve, reject) => {
      this._onTransitionendDelete = e => {
        this.stopListenEndInteract(el);
        resolve(e);
      }
      this._onTransitionendCancel = e => {
        this.stopListenEndInteract(el);
        reject(e);
      }

      if (this.model.isDelete(swipePercent)) {
        el.addEventListener('transitionend', this._onTransitionendDelete, false);
        swipePercent < 0 ? el.classList.add('js-transition-delete-left') : el.classList.add('js-transition-delete-right');
      } else {
        el.addEventListener('transitionend', this._onTransitionendCancel, false);
        el.classList.add('js-transition-cancel');
      }
    });

    promise
      .then(this.onDelete, this.onCancel);

    return promise;
  }

  stopListenEndInteract(el) {
    el.removeEventListener('transitionend', this._onTransitionendDelete);
    el.removeEventListener('transitionend', this._onTransitionendCancel);
  }

  getSwipePercent() {
    const shift = this.regionContent.firstChild.offsetLeft;
    const width = this.regionContent.clientWidth;

    return this.model.calcSwipePercent({shift, width});
  }

  onDelete() {
    this.props.onDelete(this.customProps);
    this.setState({isDeleted: true});
  }

  onCancel(e) {
    this.props.onCancel(this.customProps);

    const target = e.currentTarget;
    target.classList.remove('js-transition-cancel');

    this.model.startX = this.model.startY = target.style.left = 0;
  }

  get customProps() {
    const props = Object.keys(SwipeToDelete.propTypes);
    const customProps = Object.keys(this.props).filter(name => !props.includes(name));
    return customProps.reduce((memo, name) => {
      memo[name] = this.props[name];
      return memo;
    }, {});
  }
}

SwipeToDelete.defaultProps = {
  tag: 'div',
  classNameTag: '',
  background: <Background/>,
  onDelete: () => {},
  onCancel: () => {},
  onLeft: () => {},
  onRight: () => {}
};

SwipeToDelete.propTypes = {
  children: PropTypes.element.isRequired,
  background: PropTypes.element,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  onLeft: PropTypes.func,
  onRight: PropTypes.func,
  tag: PropTypes.string,
  classNameTag: PropTypes.string,
  deleteSwipe: (props, propName, componentName) => {
    let val = props[propName];

    if (!val) {
      return;
    }

    if (typeof val !== 'number') {
      return new Error(`Invalid prop "deleteSwipe" in ${componentName}: can be number only.`);
    }

    if (val < 0 || val > 1) {
      return new Error(`Invalid prop "deleteSwipe" in ${componentName}: can be in range [0, 1].`);
    }
  }
};
