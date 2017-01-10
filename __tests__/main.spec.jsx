import React from 'react';
import SwipeToDelete from '../src/js/main';
import renderer from 'react-test-renderer';


describe('A SwipeToDelete', () => {
  it('should renders correctly', () => {
    // In componentDidMount requires a DOM
    SwipeToDelete.prototype.componentDidMount = jest.fn();

    const component = renderer.create(
      <SwipeToDelete><div>Content ...</div></SwipeToDelete>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
