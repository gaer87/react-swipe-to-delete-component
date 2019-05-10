import 'raf/polyfill';
import React from 'react';
import renderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import SwipeToDelete from '../src/js/main';
import Model from '../src/js/model';
import Device from '../src/js/utils/device';


describe('A SwipeToDelete', () => {
  const device = Device.factory(false);
  const componentDidMountOrig = SwipeToDelete.prototype.componentDidMount;
  const addHandlersOrig = SwipeToDelete.prototype.addHandlers;
  const startInteractOrig = SwipeToDelete.prototype.startInteract;
  const isInteractOrig = SwipeToDelete.prototype.isInteract;
  const moveAtOrig = SwipeToDelete.prototype.moveAt;
  const stopInteractOrig = SwipeToDelete.prototype.stopInteract;
  const onStopInteractOrig = SwipeToDelete.prototype.onStopInteract;
  const endInteractOrig = SwipeToDelete.prototype.endInteract;
  const onDeleteOrig = SwipeToDelete.prototype.onDelete;
  const onCancelOrig = SwipeToDelete.prototype.onCancel;

  afterEach(() => {
    // Return original methods after mock
    SwipeToDelete.prototype.componentDidMount = componentDidMountOrig;
    SwipeToDelete.prototype.startInteract = startInteractOrig;
    SwipeToDelete.prototype.isInteract = isInteractOrig;
    SwipeToDelete.prototype.addHandlers = addHandlersOrig;
    SwipeToDelete.prototype.moveAt = moveAtOrig;
    SwipeToDelete.prototype.stopInteract = stopInteractOrig;
    SwipeToDelete.prototype.onStopInteract = onStopInteractOrig;
    SwipeToDelete.prototype.endInteract = endInteractOrig;
    SwipeToDelete.prototype.onDelete = onDeleteOrig;
    SwipeToDelete.prototype.onCancel = onCancelOrig;
  });

  it('should renders correctly', () => {
    // In componentDidMount requires a DOM
    SwipeToDelete.prototype.componentDidMount = () => {};

    const component = renderer.create(<SwipeToDelete tag={'li'} classNameTag={'list children'}><div>Content ...</div></SwipeToDelete>);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('if a content component is moved', () => {
    let content;
    beforeEach(() => {
      SwipeToDelete.prototype.moveAt = jest.fn();

      // Skip next steps for async test
      SwipeToDelete.prototype.endInteract = jest.fn().mockReturnValueOnce(Promise.resolve());

      const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
      content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');

      simulateDOMMouseEvent(device.getStartEventName(), content);

      return waitExec();
    });

    it('should move it when it is moved by X', () => {
      simulateDOMMouseEvent(device.getInteractEventName(), document, {pageX: 10, pageY: 0});
      return waitExec()
        .then(() => {
          simulateDOMMouseEvent(device.getInteractEventName(), document, {pageX: 11, pageY: 0});
          expect(SwipeToDelete.prototype.moveAt).toBeCalled();
          simulateDOMMouseEvent(device.getStopEventNames()[0], content);
        })
    });

    it('should not move it when it is moved by Y', () => {
      simulateDOMMouseEvent(device.getInteractEventName(), document, {pageX: 4, pageY: 10});
      return waitExec()
        .then(() => {
          simulateDOMMouseEvent(device.getInteractEventName(), document, {pageX: 5, pageY: 11});
          expect(SwipeToDelete.prototype.moveAt).not.toBeCalled();
          simulateDOMMouseEvent(device.getStopEventNames()[0], content);
        });
    });
  });


  describe('A "onMove()"', () => {
    it('should set "left" style on a content component', () => {
      const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
      const content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');

      const pageX = 5;
      const e = {pageX};

      component.moveAt(e);
      expect(content.style.left).toBe(`${pageX}px`);
    });

    it('should call "onRight()" then an user swipe content on right', () => {
      const onRight = jest.fn();
      const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete onRight={onRight}><div className="content">Content ...</div></SwipeToDelete>);

      const pageX = 5;
      const e = {pageX};

      component.callMoveCB(e);

      expect(onRight).toBeCalled();
    });

    it('should call "onLeft()" then an user swipe content on left', () => {
      const onLeft = jest.fn();
      const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete onLeft={onLeft}><div className="content">Content ...</div></SwipeToDelete>);

      const pageX = -5;
      const e = {pageX};

      component.callMoveCB(e);

      expect(onLeft).toBeCalled();
    });
  });

  it('should call "onStopInteract()" when user stop interacting', () => {
    SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
    SwipeToDelete.prototype.isInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
    SwipeToDelete.prototype.onStopInteract = jest.fn();

    const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
    const content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');

    return waitExec()
      .then(() => {
        simulateDOMMouseEvent(device.getStartEventName(), content);
        simulateDOMMouseEvent(device.getStopEventNames()[0], content);

        expect(SwipeToDelete.prototype.onStopInteract).toBeCalled();
      });
  });

  it('A "onStopInteract()" should stop executing, when content will be not moved', () => {
    const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);

    const e = {currentTarget: {offsetLeft: 0}};
    const resolve = () => {};
    const reject = jest.fn();

    expect(reject).not.toHaveBeenCalled();
    component.onStopInteract(e, resolve, reject);
    expect(reject).toHaveBeenCalled();
  });

  describe('A content component is moved more "deleteSwipe" props', () => {
    let component;
    let content;

    beforeEach(() => {
      Model.prototype.calcSwipePercent = jest.fn().mockReturnValueOnce(.7);
      SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.isInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.stopInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.onDelete = jest.fn();

      component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
      content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');

      return waitExec();
    });

    it('should add a "js-transition-delete-[right|left]" class', () => {
      expect(content.classList.contains('js-transition-delete-right')).toBe(true);
    });

    it('should call a "onDelete()" method', () => {
      // Simulate a transitionend events
      const event = new Event('transitionend');
      content.dispatchEvent(event);

      return waitExec()
        .then(() => {
          expect(SwipeToDelete.prototype.onDelete).toBeCalled();
        });
    });
  });


  describe('A content component is moved less "deleteSwipe" props', () => {
    let component;
    let content;

    beforeEach(() => {
      Model.prototype.calcSwipePercent = jest.fn().mockReturnValueOnce(-.3);
      SwipeToDelete.prototype.addHandlers = jest.fn(function() {
        // Second calls - stop executing
      })
        .mockImplementationOnce(function () {
          // First call - exec
          addHandlersOrig.call(this);
        });
      SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.isInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.stopInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.onCancel = jest.fn();

      component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
      content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');

      return waitExec();
    });

    it('should add a "js-transition-cancel" class', () => {
      expect(content.classList.contains('js-transition-cancel')).toBe(true);
    });

    it('should call a "onCancel()" method', () => {
      // Simulate a transitionend events
      const event = new Event('transitionend');
      content.dispatchEvent(event);

      return waitExec()
        .then(() => {
          expect(SwipeToDelete.prototype.onCancel).toBeCalled();
        });
    });

    it('should again add handlers of lifecycle swiping', () => {
      expect(SwipeToDelete.prototype.addHandlers).toHaveBeenCalledTimes(1);

      // Simulate a transitionend events
      const event = new Event('transitionend');
      content.dispatchEvent(event);

      const waitTransExec = new Promise((resolve) => {setTimeout(resolve, 4)});
      return waitTransExec
        .then(() => {
          expect(SwipeToDelete.prototype.addHandlers).toHaveBeenCalledTimes(2);
        });
    });
  });


  describe('A content component isn\'t moved', () => {
    beforeEach(() => {
      Model.prototype.calcSwipePercent = jest.fn().mockReturnValueOnce(0);
      SwipeToDelete.prototype.addHandlers = jest.fn(function() {
        // Second calls - stop executing
      })
        .mockImplementationOnce(function () {
          // First call - exec
          addHandlersOrig.call(this);
        });
      SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.isInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.stopInteract = jest.fn().mockReturnValueOnce(Promise.reject());
      SwipeToDelete.prototype.endInteract = jest.fn();

      ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);

      return waitExec();
    });

    it('should not call a "endInteract()" method', () => {
      expect(SwipeToDelete.prototype.endInteract).not.toHaveBeenCalled();
    });

    it('should again add handlers of lifecycle swiping', () => {
      expect(SwipeToDelete.prototype.addHandlers).toHaveBeenCalledTimes(2);
    });
  });


  describe('A "onDelete()"', () => {
    let component;
    let content;
    let onDelete;

    beforeEach(() => {
      onDelete = jest.fn();

      SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.isInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.stopInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.endInteract = jest.fn(function() {
        return Promise.resolve()
          .then(() => {
            this.onDelete();
          });
      });

      component = ReactTestUtils.renderIntoDocument(<SwipeToDelete onDelete={onDelete}><div className="content">Content ...</div></SwipeToDelete>);

      return waitExec();
    });

    it('should call a "onDelete()" props', () => {
      expect(onDelete).toBeCalled();
    });

    it('should delete component', () => {
      content = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'content');
      expect(content.length).toBe(0);
    });
  });


  describe('A "onCancel()"', () => {
    let component;
    let content;
    let onCancel;

    beforeEach(() => {
      onCancel = jest.fn();

      SwipeToDelete.prototype.addHandlers = jest.fn(function() {
        // Second calls - stop executing
      })
        .mockImplementationOnce(function () {
          // First call - exec
          addHandlersOrig.call(this);
        });
      SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.isInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.stopInteract = jest.fn().mockReturnValueOnce(Promise.resolve());
      SwipeToDelete.prototype.endInteract = jest.fn(function() {
        return Promise.reject()
          .catch(() => {
            const e = {currentTarget: this.regionContent.firstChild};
            this.onCancel(e);
          });
      });

      component = ReactTestUtils.renderIntoDocument(<SwipeToDelete onCancel={onCancel}><div className="content js-transition-cancel">Content ...</div></SwipeToDelete>);

      return waitExec();
    });

    it('should call a "onCancel()" props', () => {
      expect(onCancel).toBeCalled();
    });

    it('should remove a "js-transition-cancel" class', () => {
      content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');
      expect(content.classList.contains('js-transition-cancel')).toBe(false);
    });
  });
});

// Simulate a mouse events; can't use TestUtils here because it uses react's event system only,
// but <SwipeToDelete> attaches event listeners directly to the document.
const simulateDOMMouseEvent = (eventName, node, {pageX = 0, pageY = 0} = {}) => {
  const event = new MouseEvent(eventName, {
    bubbles: true,
    cancelable: true
  });
  event.pageX = pageX;
  event.pageY = pageY;

  node.dispatchEvent(event);
};

const waitExec = () => new Promise((resolve) => {setTimeout(resolve, 4)});
