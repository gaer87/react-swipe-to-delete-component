import react from 'react';
import SwipeToDelete from '../src/js/main';
import renderer from 'react-test-renderer';


describe('A SwipeToDelete', () => {
  it('should renders correctly', () => {
    const component = renderer.create(
      <SwipeToDelete><div>Content ...</div></SwipeToDelete>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
