import Device from '../src/js/utils/device';

describe('Devices', () => {
  it('should support a mouse', () => {
    const device = Device.factory(true);

    expect(device.getStartEventName()).toBe('touchstart');
    expect(device.getInteractEventName()).toBe('touchmove');
    expect(device.getStopEventNames()).toEqual(['touchend']);
    expect(device.getPageX({ targetTouches: [{ pageX: 1, pageY: 2 }] })).toBe(1);
    expect(device.getPageY({ targetTouches: [{ pageX: 1, pageY: 2 }] })).toBe(2);
  })

  it('should support a touch screen', () => {
    expect(Device.factory(false).getInteractEventName()).toBe('mousemove');
  });
});
