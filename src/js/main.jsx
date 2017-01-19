import React from 'react';
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

    return (
      <div className="swipe-to-delete">
        <div className="js-delete">{this.props.background}</div>
        <div className="js-content" ref={el => this.regionContent = el}>{this.props.children}</div>
      </div>
    );
  }

  componentDidMount() {
    this.addHandlers();
  }

  bindHandlers() {
    this.addHandlers = this.addHandlers.bind(this);
    this.interact = this.interact.bind(this);
    this.moveAt = this.moveAt.bind(this);
    this.stopInteract = this.stopInteract.bind(this);
    this.offInteract = this.offInteract.bind(this);
    this.endInteract = this.endInteract.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  addHandlers() {
    this.startInteract()
      .then(this.interact)
      .then(this.stopInteract)
      .then(this.endInteract)
      .catch(this.addHandlers);
  }

  startInteract() {
    return new Promise(resolve => {
      this.onInteract = e => {
        el.removeEventListener(this.device.getStartEventName(), this.onInteract, false);
        this.model.startX = this.device.getPageX(e);
        resolve();
      };

      const el = this.regionContent.firstChild;
      el.addEventListener(this.device.getStartEventName(), this.onInteract, false);
    });
  }

  interact() {
    document.addEventListener(this.device.getInteractEventName(), this.moveAt, false);
  }

  offInteract() {
    document.removeEventListener(this.device.getInteractEventName(), this.moveAt, false);
  }

  moveAt(e) {
    const target = this.regionContent.firstChild;
    const res = this.device.getPageX(e) - this.model.startX;

    target.style.left = `${res}px`;
  }

  stopInteract() {
    return new Promise((resolve, reject) => {
      const el = this.regionContent.firstChild;

      this.onStopInteract = e => {
        this.offInteract();
        this.device.getStopEventNames().forEach(event => el.removeEventListener(event, this.onStopInteract, false));

        const shift = e.currentTarget.offsetLeft;
        !shift ? reject() : resolve(e);
      };

      this.device.getStopEventNames().forEach(event => el.addEventListener(event, this.onStopInteract, false));
    });
  }

  endInteract(event) {
    const target = event.currentTarget;
    const swipePercent = this.getSwipePercent();

    const promise = new Promise((resolve, reject) => {
      if (this.model.isDelete(swipePercent)) {
        target.addEventListener('transitionend', e => resolve(e), false);
        swipePercent < 0 ? target.classList.add('js-transition-delete-left') : target.classList.add('js-transition-delete-right');
      } else {
        target.addEventListener('transitionend', e => reject(e), false);
        target.classList.add('js-transition-cancel');
      }
    });

    promise
      .then(this.onDelete, this.onCancel);

    return promise;
  }

  getSwipePercent() {
    const shift = this.regionContent.firstChild.offsetLeft;
    const width = this.regionContent.clientWidth;

    return this.model.calcSwipePercent({shift, width});
  }

  onDelete() {
    this.props.onDelete();
    this.setState({isDeleted: true});
  }

  onCancel(e) {
    this.props.onCancel();

    const target = e.currentTarget;
    target.classList.remove('js-transition-cancel');

    this.model.startX = target.style.left = 0;
  }
}

SwipeToDelete.defaultProps = {
  background: <Background/>,
  onDelete: () => {},
  onCancel: () => {}
};

SwipeToDelete.propTypes = {
  children: React.PropTypes.element.isRequired,
  background: React.PropTypes.element,
  onDelete: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  deleteSwipe: (props, propName, componentName) => {
    let val = props[propName];

    if (!val) {
      return;
    }

    if (typeof val !== 'number') {
      return new Error(`Invalid prop "deleteWidth" in ${componentName}: can be number only.`);
    }

    if (val < 0 || val > 1) {
      return new Error(`Invalid prop "deleteWidth" in ${componentName}: can be in range [0, 1].`);
    }
  }
};
