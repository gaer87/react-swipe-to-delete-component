import $ from 'jquery';
import React from 'react';
import renderer from 'react-test-renderer';
import {mount} from 'enzyme';
import ReactTestUtils from 'react-addons-test-utils';
import SwipeToDelete from '../src/js/main';
import Device from '../src/js/utils/device';


describe('A SwipeToDelete', () => {
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

  it('should move a content component, when user swipe this', () => {
    SwipeToDelete.prototype.moveAt = jest.fn();

    const component = ReactTestUtils.renderIntoDocument(<SwipeToDelete><div className="content">Content ...</div></SwipeToDelete>);

    // const device = Device.factory(false);

    const content = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'content');
    mouseDown(5, 5, content);
    mouseMove(10, 10, document);

    expect(SwipeToDelete.prototype.moveAt).toBeCalled();
  });
});


// Simulate a mouse events; can't use TestUtils here because it uses react's event system only,
// but <SwipeToDelete> attaches event listeners directly to the document.
const mouseDown = (pageX = 0, pageY = 0, node) => {
  const event = new MouseEvent('mousedown', {
    pageX,
    pageY,
    bubbles: true,
    cancelable: true
  });

  node.dispatchEvent(event);
};

const mouseMove = (pageX = 0, pageY = 0, node) => {
  const event = new MouseEvent('mousemove', {
    pageX,
    pageY,
    bubbles: true,
    cancelable: true
  });

  node.dispatchEvent(event);
};
