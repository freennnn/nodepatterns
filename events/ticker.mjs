// Example of combining callback and Observer pattern: Events/EventEmitter API style for async task
import { EventEmitter } from 'events';
import { nextTick } from 'process'; 
function ticker(number, callback) {
  const eventEmitter = new EventEmitter();
  let timeElapsed = 0;
  let ticksEmitted = 0;

  function tick() {
    if (timeElapsed < number) {
      // emitting event asynchronously to avoid Zalgo
      nextTick(() => { 
        eventEmitter.emit('tick', ++ticksEmitted, timeElapsed);
        timeElapsed += 50;
      });
      setTimeout(tick, 50);
    } else {
      nextTick(() => callback(null, ticksEmitted)); // Node.js error first callback signature pattern
    }

  }
  tick();
  return eventEmitter;
}

ticker(0, (err, count) => console.log(`ticks been emitted ${count}`))
  .on('tick', (index, timeElapsed) => console.log(`ticked ${index} at ${timeElapsed}`)) 