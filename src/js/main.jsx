import $ from 'jquery';
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
      .done(this.interact)
      .then(this.stopInteract)
        .always(this.offInteract)
        .then(this.endInteract)
          .fail(this.addHandlers);
  }

  startInteract() {
    let dfd = new $.Deferred();
    let el = $(this.regionContent.firstChild);

    this.onInteract = e => {
      console.info('onInteract');
      this.model.startX = this.device.getPageX(e);
      dfd.resolve();
    };

    el.one(this.device.getStartEventName(), this.onInteract);

    return dfd;
  }

  interact() {
    console.info('interact');
    $(document).on(this.device.getInteractEventName(), this.moveAt);
  }

  moveAt(e) {
    let target = $(this.regionContent.firstChild);
    let res = this.device.getPageX(e) - this.model.startX;
    console.info('moveAt');

    target.css({left: res});
  }

  offInteract() {
    $(document).off(this.device.getInteractEventName(), this.moveAt);
  }

  stopInteract() {
    let dfd = new $.Deferred();
    let el = $(this.regionContent.firstChild);

    this.onStopInteract = e => {
      this.device.getStopEventNames().forEach(event => el.off(event, this.onStopInteract));

      let shift = $(e.currentTarget).position().left;
      !shift ? dfd.reject(e) : dfd.resolve(e);
    };

    this.device.getStopEventNames().forEach(event => el.one(event, this.onStopInteract));

    return dfd;
  }

  endInteract(event) {
    let dfd = new $.Deferred();
    let target = $(event.currentTarget);
    let swipePercent = this.getSwipePercent();

    dfd
      .done(this.onDelete)
      .fail(this.onCancel);

    if (this.model.isDelete(swipePercent)) {
      target.one('transitionend', e => dfd.resolve(e));
      swipePercent < 0 ? target.addClass('js-transition-delete-left') : target.addClass('js-transition-delete-right');
    } else {
      target.one('transitionend', e => dfd.reject(e));
      target.addClass('js-transition-cancel');
    }

    return dfd;
  }

  getSwipePercent() {
    let shift = $(this.regionContent.firstChild).position().left;
    let width = $(this.regionContent).innerWidth();

    return this.model.calcSwipePercent({shift, width});
  }

  onDelete() {
    this.props.onDelete();
    this.setState({isDeleted: true});
  }

  onCancel(e) {
    this.props.onCancel();

    let target = $(e.currentTarget);
    target.removeClass('js-transition-cancel');
    target.css({left: 0});

    this.model.startX = 0;
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
