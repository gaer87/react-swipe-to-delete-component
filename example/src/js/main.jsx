import React from 'react';
import {render} from 'react-dom';
// Import the react-swipe-to-delete-component
import SwipeToDelete from 'react-swipe-to-delete-component';

// Example data
const data = [
  {id: 1, text: 'Best part of the day ☕', date: '5.03.2016'},
  {id: 2, text: 'What\'s everybody reading?', date: '3.03.2016'},
  {id: 3, text: 'End of summer reading list', date: '1.03.2016'}
];

const onDelete = () => console.info('onDelete');
const onCancel = () => console.info('onCancel');

const list = data.map(item => (
  // Wrap a content component in the react-swipe-to-delete-component
  <SwipeToDelete key={item.id} onDelete={onDelete} onCancel={onCancel}>
    {/* An example content component */}
    <a className="list-group-item">
      <h4 className="list-group-item-heading">{item.date}</h4>
      <p className="list-group-item-text">{item.text}</p>
    </a>
  </SwipeToDelete>
));

const app = (
  <div className="panel panel-default">
    <div className="panel-heading">
      <h1 className="panel-title">Messages</h1>
    </div>
    <div className="panel-body text-info">Swipe a row and it is deleted.</div>
    <div className="list-group">
      {list}
    </div>
  </div>
);

render(app, document.getElementById('root'));
