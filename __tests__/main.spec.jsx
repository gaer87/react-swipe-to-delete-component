import React from 'react';
import renderer from 'react-test-renderer';
import ReactTestUtils from 'react-addons-test-utils';
import SwipeToDelete from '../src/js/main';
import Device from '../src/js/utils/device';


describe('A SwipeToDelete', () => {
  const device = Device.factory(false);
  const componentDidMountOrig = SwipeToDelete.prototype.componentDidMount;
  const addHandlersOrig = SwipeToDelete.prototype.addHandlers;
  const moveAtOrig = SwipeToDelete.prototype.moveAt;
  const startInteractOrig = SwipeToDelete.prototype.startInteract;
  const interactOrig = SwipeToDelete.prototype.interact;
  const stopInteractOrig = SwipeToDelete.prototype.stopInteract;

  afterEach(() => {
    // Return original methods after mock
    SwipeToDelete.prototype.componentDidMount = componentDidMountOrig;
    SwipeToDelete.prototype.addHandlers = addHandlersOrig;
    // SwipeToDelete.prototype.moveAt = moveAtOrig;
    // SwipeToDelete.prototype.startInteract = startInteractOrig;
    // SwipeToDelete.prototype.interact = interactOrig;
    // SwipeToDelete.prototype.stopInteract = stopInteractOrig;
  });

  it('should renders correctly', () => {
    // In componentDidMount requires a DOM
    SwipeToDelete.prototype.componentDidMount = () => {};

    const component = renderer.create(<SwipeToDelete><div>Content ...</div></SwipeToDelete>);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should call "addHandlers()" on "componentDidMount"', () => {
    SwipeToDelete.prototype.addHandlers = jest.fn();
    const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
    expect(SwipeToDelete.prototype.addHandlers).toBeCalled();
  });

  xdescribe('A "addHandlers()"', () => {
    xit('should call "startInteract()"', () => {
      SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValue(new $.Deferred());
      const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
      expect(SwipeToDelete.prototype.startInteract).toBeCalled();
    });

    xit('should call "interact()", when start interact', () => {
      SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValue(new $.Deferred().resolve());
      SwipeToDelete.prototype.interact = jest.fn();
      const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
      expect(SwipeToDelete.prototype.interact).toBeCalled();
    });

    it('should call "stopInteract()", when start interact', () => {
      SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValue(new $.Deferred().resolve());
      SwipeToDelete.prototype.stopInteract = jest.fn(() => {
        console.info(7, new Date());
        expect(SwipeToDelete.prototype.stopInteract).toBeCalled();
        return new $.Deferred();
      });
      const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);

      console.info(1, new Date());
      console.info(11, new Date());
    });
  });

  xit('should move a content component', () => {
    SwipeToDelete.prototype.moveAt = jest.fn();

    const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
    const content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');

    // console.info(1);
    simulateDOMMouseEvent(device.getStartEventName(), content);
    // console.info(2);
    simulateDOMMouseEvent(device.getInteractEventName(), document);
    console.info(3);
    expect(SwipeToDelete.prototype.moveAt).toBeCalled();
    console.info(33);
  });

  xdescribe('A content component is moved', () => {
    const startInteractOrig = SwipeToDelete.prototype.startInteract;

    beforeEach(() => {
    });

    afterEach(() => {
      // SwipeToDelete.prototype.startInteract = startInteractOrig;
    });

    describe('It\'s moved more "deleteSwipe" props', () => {
      xit('should add a "js-transition-delete-right" class, when content component will be swiped on right', () => {
        // let dfd = (new $.Deferred()).resolve();
        // let dfd = (new $.Deferred());
        // SwipeToDelete.prototype.startInteract = jest.fn().mockReturnValue(dfd);

        // const promise = new Promise((resolve, reject) => {});
/*
        SwipeToDelete.prototype.onStopInteract = jest.fn((e, el, dfd) => {
          console.info('_onStopInteract', new Date() * 1, dfd.state());
          dfd.resolve();
        });
*/

        // const stopInteractOrig = SwipeToDelete.prototype.stopInteract;
/*
        SwipeToDelete.prototype.stopInteract = function() {
          // console.info(1, new Date() * 1);
          const dfd = stopInteractOrig.call(this);
          console.info('st', dfd.state());
          // console.info(11, new Date() * 1, this.regionContent.firstChild);
          // simulateDOMMouseEvent(device.getStopEventNames()[0], content);
          simulateDOMMouseEvent(device.getStopEventNames()[0], this.regionContent.firstChild);
          console.info('st', dfd.state());

          return dfd;
        };
*/


        const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
        const content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');


        // component.stopInteract();

/*
        dfd
          .then(() => {
            console.info(device.getStopEventNames()[0], new Date() * 1);
            simulateDOMMouseEvent(device.getStopEventNames()[0], content);
            // return (new $.Deferred()).resolve();
          });
*/
      });

      it('should add a "js-transition-delete-left" class, when content component will be swiped on left', () => {

      });

      it('should call a "onDelete()" method', () => {

      });

      describe('A "onDelete()"', () => {
        it('should call a "onDelete()" props', () => {

        });

        it('should delete component', () => {

        });
      });
    });

    describe('It\'s moved less "deleteSwipe" props', () => {
      it('should add "js-transition-cancel" class', () => {

      });

      it('should call a "onCancel()" method', () => {

      });

      describe('A "onCancel()"', () => {
        it('should call a "onCancel()" props', () => {

        });

        it('should remove a "js-transition-cancel" class', () => {

        });
      });

      it('should again add handlers of lifecycle swiping', () => {

      });
    });
  });

  describe('A content component isn\'t moved', () => {
    it('should not call a "stopInteract()" method', () => {

    });

    it('should again add handlers of lifecycle swiping', () => {

    });
  });
});

// Simulate a mouse events; can't use TestUtils here because it uses react's event system only,
// but <SwipeToDelete> attaches event listeners directly to the document.
const simulateDOMMouseEvent = (eventName, node, {pageX = 0, pageY = 0} = {}) => {
  const event = new MouseEvent(eventName, {
    pageX,
    pageY,
    bubbles: true,
    cancelable: true
  });

  node.dispatchEvent(event);
};
