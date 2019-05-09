import React from 'react';
import {render} from 'react-dom';
// Import the react-swipe-to-delete-component
import SwipeToDelete from 'react-swipe-to-delete-component';

const data = [
  {id: 5, text: 'Good morning to 9M of you?!?! ❤️🙏🏻Feeling very grateful and giddy.', date: '12.01.2019'},
  {id: 4, text: 'Somewhere in the middle 📸', date: '23.01.2017'},
  {id: 3, text: 'Best part of the day ☕', date: '5.03.2016'},
  {id: 2, text: 'What\'s everybody reading?', date: '3.03.2016'},
  {id: 1, text: 'End of summer reading list', date: '1.03.2016'}
];

const onDelete = () => console.info('onDelete');
const onCancel = () => console.info('onCancel');
const onLeft = (...args) => console.info('onLeft', ...args);
const onRight = (...args) => console.info('onRight', ...args);

const list = data.map(item => (
  <SwipeToDelete key={item.id} tag="li" classNameTag="tw feed" onDelete={onDelete} onCancel={onCancel} onLeft={onLeft} onRight={onRight}>
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
    <ul className="list-group list-unstyled">
      {list}
    </ul>
  </div>
);

render(app, document.getElementById('root'));
