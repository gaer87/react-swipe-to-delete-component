'use strict';

import $ from 'jquery';
import Marionette from 'backbone.marionette';
import SwipeToDeleteView from '../src/js/main';
import State from '../src/js/model';
import DelView from '../src/js/delete';

class View extends Marionette.ItemView {
	template() {
		return '<p>Test</p>';
	}
}

let swipeToDeleteView;

function renderView() {
	let el = document.createElement('div');
	document.body.appendChild(el);
	swipeToDeleteView = new SwipeToDeleteView({View, el}).render();
}

function triggerAllSequenceEvents($el) {
	$el.trigger('mousedown');
	$(document).trigger('mousemove');
	$el.trigger('mouseup');
	$el.trigger('transitionend');
}

describe('The MainView', function () {
	afterEach(() => {
		$(document).off();
		swipeToDeleteView.destroy();
	});

	it('do an instance', () => {
		swipeToDeleteView = new SwipeToDeleteView({View});
		expect(typeof swipeToDeleteView).toBe('object');
	});

	it('has the "swipe-to-delete" class', () => {
		swipeToDeleteView = new SwipeToDeleteView({View});
		expect(swipeToDeleteView.$el.hasClass('swipe-to-delete')).toBe(true);
	});

	it('has "js-delete" and "js-content" elements', () => {
		swipeToDeleteView = new SwipeToDeleteView({View});
		swipeToDeleteView.render();

		expect(swipeToDeleteView.$('.js-delete').length).toBe(1);
		expect(swipeToDeleteView.$('.js-content').length).toBe(1);
	});

	describe('initializing', () => {
		it('accept options', () => {
			expect(() => new SwipeToDeleteView()).toThrowError('"View" can be any Backbone.View or be derived from Marionette.ItemView.');
			expect(() => new SwipeToDeleteView({View: 'dummy'})).toThrowError('"View" can be any Backbone.View or be derived from Marionette.ItemView.');
			expect(() => new SwipeToDeleteView({View: View, DeleteView: 'dummy'})).toThrowError('"DeleteView" can be any Backbone.View or be derived from Marionette.ItemView.');
		});

		it('validate the "deleteSwipe" option', () => {
			spyOn(State.prototype, 'validate');
			new SwipeToDeleteView({View: View});
			expect(State.prototype.validate).toHaveBeenCalled();
		});
	});

	it('render child views', () => {
		spyOn(DelView.prototype, 'render');
		spyOn(View.prototype, 'render');

		swipeToDeleteView = new SwipeToDeleteView({View});
		swipeToDeleteView.render();

		expect(View.prototype.render).toHaveBeenCalled();
		expect(DelView.prototype.render).toHaveBeenCalled();
	});

	describe('when start to interact', () => {
		it('should call "interact"', () => {
			spyOn(SwipeToDeleteView.prototype, 'interact');
			renderView();

			let $el = swipeToDeleteView.$('.js-content > *');

			expect(SwipeToDeleteView.prototype.interact).not.toHaveBeenCalled();
			$el.trigger('mousedown');
			expect(SwipeToDeleteView.prototype.interact).toHaveBeenCalled();

			$el.trigger('mouseup');
		});

		it('should call "stopInteract"', () => {
			spyOn(SwipeToDeleteView.prototype, 'stopInteract').and.callThrough();
			renderView();

			let $el = swipeToDeleteView.$('.js-content > *');

			expect(SwipeToDeleteView.prototype.stopInteract).not.toHaveBeenCalled();
			$el.trigger('mousedown');
			expect(SwipeToDeleteView.prototype.stopInteract).toHaveBeenCalled();

			$el.trigger('mouseup');
		});
	});

	it('when interact should move a view', () => {
		spyOn(SwipeToDeleteView.prototype, 'moveAt');
		renderView();

		let $el = swipeToDeleteView.$('.js-content > *');

		$el.trigger('mousedown');

		expect(SwipeToDeleteView.prototype.moveAt).not.toHaveBeenCalled();
		$(document).trigger('mousemove');
		expect(SwipeToDeleteView.prototype.moveAt).toHaveBeenCalled();

		$el.trigger('mouseup');
	});

	describe('when stop interacting', () => {
		it('should call "offInteract" by "mouseup"', () => {
			spyOn(SwipeToDeleteView.prototype, 'offInteract');
			renderView();

			let $el = swipeToDeleteView.$('.js-content > *');

			$el.trigger('mousedown');
			$(document).trigger('mousemove');

			expect(SwipeToDeleteView.prototype.offInteract).not.toHaveBeenCalled();
			$el.trigger('mouseup');
			expect(SwipeToDeleteView.prototype.offInteract).toHaveBeenCalled();
		});

		it('should call "offInteract" by "mouseleave"', () => {
			spyOn(SwipeToDeleteView.prototype, 'offInteract');
			renderView();

			let $el = swipeToDeleteView.$('.js-content > *');

			$el.trigger('mousedown');
			$(document).trigger('mousemove');

			expect(SwipeToDeleteView.prototype.offInteract).not.toHaveBeenCalled();
			$el.trigger('mouseleave');
			expect(SwipeToDeleteView.prototype.offInteract).toHaveBeenCalled();
			$el.trigger('mouseup');
		});

		it('should call "endInteract"', () => {
			spyOn(SwipeToDeleteView.prototype, 'endInteract');
			renderView();

			let $el = swipeToDeleteView.$('.js-content > *');

			$el.trigger('mousedown');
			$(document).trigger('mousemove');

			expect(SwipeToDeleteView.prototype.endInteract).not.toHaveBeenCalled();
			$el.trigger('mouseup');
			expect(SwipeToDeleteView.prototype.endInteract).toHaveBeenCalled();
		});
	});

	describe('when is deleted', () => {
		it('should add the class "js-transition-delete-right"', () => {
			renderView();
			spyOn(swipeToDeleteView, 'getSwipePercent').and.callFake(() => .7);

			let $el = swipeToDeleteView.$('.js-content > *');

			$el.trigger('mousedown');
			$(document).trigger('mousemove');
			$el.trigger('mouseup');

			expect($el.hasClass('js-transition-delete-right')).toBe(true);
		});

		it('should add the class "js-transition-delete-left"', () => {
			renderView();
			spyOn(swipeToDeleteView, 'getSwipePercent').and.callFake(() => -.7);

			let $el = swipeToDeleteView.$('.js-content > *');

			$el.trigger('mousedown');
			$(document).trigger('mousemove');
			$el.trigger('mouseup');

			expect($el.hasClass('js-transition-delete-left')).toBe(true);
		});

		it('should call "onDelete"', () => {
			renderView();
			spyOn(swipeToDeleteView, 'getSwipePercent').and.callFake(() => .7);
			spyOn(swipeToDeleteView, 'onDelete');

			triggerAllSequenceEvents(swipeToDeleteView.$('.js-content > *'));

			expect(swipeToDeleteView.onDelete).toHaveBeenCalled();
		});

		it('"onDelete" should trigger "swipe:delete" events on a content view', () => {
			renderView();
			swipeToDeleteView.getRegion('content').currentView.onSwipeDelete = () => {};

			spyOn(swipeToDeleteView, 'getSwipePercent').and.callFake(() => .7);
			spyOn(swipeToDeleteView.getRegion('content').currentView, 'onSwipeDelete');

			triggerAllSequenceEvents(swipeToDeleteView.$('.js-content > *'));

			expect(swipeToDeleteView.getRegion('content').currentView.onSwipeDelete).toHaveBeenCalled();
		});
	});

	describe('when is canceled', () => {
		it('should add the class "js-transition-cancel"', () => {
			renderView();
			spyOn(swipeToDeleteView, 'getSwipePercent').and.callFake(() => .1);

			let $el = swipeToDeleteView.$('.js-content > *');

			$el.trigger('mousedown');
			$(document).trigger('mousemove');
			$el.trigger('mouseup');

			expect($el.hasClass('js-transition-cancel')).toBe(true);
		});

		it('should call "onCancel"', () => {
			renderView();
			spyOn(swipeToDeleteView, 'getSwipePercent').and.callFake(() => .1);
			spyOn(swipeToDeleteView, 'onCancel');

			triggerAllSequenceEvents(swipeToDeleteView.$('.js-content > *'));

			expect(swipeToDeleteView.onCancel).toHaveBeenCalled();
		});

		it('"onCancel" should trigger "swipe:cancel" events on a content view', () => {
			renderView();
			swipeToDeleteView.getRegion('content').currentView.onSwipeCancel = () => {};

			spyOn(swipeToDeleteView, 'getSwipePercent').and.callFake(() => .1);
			spyOn(swipeToDeleteView.getRegion('content').currentView, 'onSwipeCancel');

			triggerAllSequenceEvents(swipeToDeleteView.$('.js-content > *'));

			expect(swipeToDeleteView.getRegion('content').currentView.onSwipeCancel).toHaveBeenCalled();
		});

		it('"onCancel" should remove the class "js-transition-cancel"', () => {
			renderView();
			spyOn(swipeToDeleteView, 'getSwipePercent').and.callFake(() => .1);

			let $el = swipeToDeleteView.$('.js-content > *');
			triggerAllSequenceEvents($el);

			expect($el.hasClass('js-transition-cancel')).toBe(false);
		});

		it('"onCancel" should reset "startX"', () => {
			renderView();
			spyOn(swipeToDeleteView, 'getSwipePercent').and.callFake(() => .1);

			let $el = swipeToDeleteView.$('.js-content > *');
			triggerAllSequenceEvents($el);

			expect(swipeToDeleteView.state.get('startX')).toBe(0);
		});
	});
});