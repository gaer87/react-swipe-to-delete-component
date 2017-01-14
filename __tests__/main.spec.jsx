import $ from 'jquery';
import React from 'react';
import renderer from 'react-test-renderer';
import {mount} from 'enzyme';
import ReactTestUtils from 'react-addons-test-utils';
import SwipeToDelete from '../src/js/main';
import Device from '../src/js/utils/device';


describe('A SwipeToDelete', () => {
  const device = Device.factory(false);

  it('should renders correctly', () => {
    const componentDidMountOrig = SwipeToDelete.prototype.componentDidMount;
    // In componentDidMount requires a DOM
    SwipeToDelete.prototype.componentDidMount = () => {};

    const component = renderer.create(
      <SwipeToDelete><div>Content ...</div></SwipeToDelete>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    SwipeToDelete.prototype.componentDidMount = componentDidMountOrig;
  });

  it('should add handlers of lifecycle swiping on "componentDidMount"', () => {

  });

  it('should move a content component', () => {
    SwipeToDelete.prototype.moveAt = jest.fn();

    const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);
    const content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');

    simulateDOMMouseEvent(device.getStartEventName(), content);
    simulateDOMMouseEvent(device.getInteractEventName(), document);

    expect(SwipeToDelete.prototype.moveAt).toBeCalled();
  });

  describe('A content component is moved', () => {
    describe('It\'s moved more "deleteSwipe" props', () => {
      it('should add a "js-transition-delete-right" class, when content component will be swiped on right', () => {

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
